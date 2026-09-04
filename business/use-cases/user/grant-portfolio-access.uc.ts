import type { PortfolioPermissionRole } from "@/business/entities/portfolio/portfolio-permission.entity";
import { PortfolioPermission } from "@/business/entities/portfolio/portfolio-permission.entity";
import {
  canManagePortfolio,
  resolvePortfolioAccess,
} from "@/business/use-cases/shared/portfolio-access";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError, ValidationError } from "@/shared/errors";

import type { PortfolioPermissionDto } from "./portfolio-permission.dtos";
import { toPortfolioPermissionDto } from "./portfolio-permission.mapper";

/**
 * Input for {@link grantPortfolioAccess}.
 */
export interface GrantPortfolioAccessInput {
  /**
   * The id of the acting user who must own or manage the portfolio.
   */
  actorId: string;

  /**
   * The id of the user to grant access to.
   */
  userId: string;

  /**
   * The id of the portfolio to grant access to.
   */
  portfolioId: string;

  /**
   * The access level to grant.
   */
  role: PortfolioPermissionRole;
}

/**
 * Grants a user access to a portfolio.
 *
 * Only the portfolio owner may grant access. The grant is recorded
 * inside one `UnitOfWork` transaction so the permission row and its
 * audit log commit atomically.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The actor, granted user, portfolio, and role.
 * @returns The created {@link PortfolioPermissionDto}.
 *
 * @throws {NotFoundError} When the portfolio does not exist or the
 *   actor is not its owner.
 * @throws {ValidationError} When granting access to the owner or when
 *   a permission already exists.
 */
export async function grantPortfolioAccess(
  unitOfWork: UnitOfWork,
  input: GrantPortfolioAccessInput,
): Promise<PortfolioPermissionDto> {
  return unitOfWork.run(
    async (tx) => {
      const { portfolio, role } = await resolvePortfolioAccess(
        tx,
        EntityId.create(input.portfolioId),
        EntityId.create(input.actorId),
      );

      if (!canManagePortfolio(role)) {
        throw new NotFoundError(
          `Portfolio with id ${input.portfolioId} was not found.`,
        );
      }

      const grantedUser = await tx.users.findById(
        EntityId.create(input.userId),
      );

      if (grantedUser === null) {
        throw new NotFoundError(`User with id ${input.userId} was not found.`);
      }

      if (grantedUser.id === portfolio.userId) {
        throw new ValidationError(
          "Cannot grant access to the portfolio owner.",
        );
      }

      const existing = await tx.portfolioPermissions.findByUserIdAndPortfolioId(
        EntityId.create(input.userId),
        EntityId.create(input.portfolioId),
      );

      if (existing !== null) {
        throw new ValidationError(
          "Portfolio access already granted to this user.",
        );
      }

      const permission = PortfolioPermission.create({
        userId: EntityId.create(input.userId),
        portfolioId: EntityId.create(input.portfolioId),
        role: input.role,
        grantedByUserId: EntityId.create(input.actorId),
      });

      const saved = await tx.portfolioPermissions.save(permission);

      return toPortfolioPermissionDto(saved);
    },
    { userId: EntityId.create(input.actorId) },
  );
}
