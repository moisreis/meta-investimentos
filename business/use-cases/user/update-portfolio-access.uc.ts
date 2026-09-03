import type { PortfolioPermissionRole } from "@/business/entities/portfolio/portfolio-permission.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import type { PortfolioPermissionDto } from "./portfolio-permission.dtos";
import { toPortfolioPermissionDto } from "./portfolio-permission.mapper";

/**
 * Input for {@link updatePortfolioAccess}.
 */
export interface UpdatePortfolioAccessInput {
  /**
   * The id of the acting user who must own the portfolio.
   */
  actorId: string;

  /**
   * The id of the user whose access is updated.
   */
  userId: string;

  /**
   * The id of the portfolio the user has access to.
   */
  portfolioId: string;

  /**
   * The new access level.
   */
  role: PortfolioPermissionRole;
}

/**
 * Updates a user's access level on a portfolio.
 *
 * Only the portfolio owner may update access. The update runs inside
 * one `UnitOfWork` transaction.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The actor, granted user, portfolio, and new role.
 * @returns The updated {@link PortfolioPermissionDto}.
 *
 * @throws {NotFoundError} When the portfolio, permission, or actor is
 *   not authorized.
 * @throws {ValidationError} When the role is invalid.
 */
export async function updatePortfolioAccess(
  unitOfWork: UnitOfWork,
  input: UpdatePortfolioAccessInput,
): Promise<PortfolioPermissionDto> {
  return unitOfWork.run(
    async (tx) => {
      const portfolio = await tx.portfolios.findById(
        EntityId.create(input.portfolioId),
      );

      if (portfolio === null || portfolio.userId !== input.actorId) {
        throw new NotFoundError(
          `Portfolio with id ${input.portfolioId} was not found.`,
        );
      }

      const permission =
        await tx.portfolioPermissions.findByUserIdAndPortfolioId(
          EntityId.create(input.userId),
          EntityId.create(input.portfolioId),
        );

      if (permission === null) {
        throw new NotFoundError(
          `Portfolio access for user ${input.userId} on portfolio ${input.portfolioId} was not found.`,
        );
      }

      const updated = permission.updateRole(input.role);
      const saved = await tx.portfolioPermissions.save(updated);

      return toPortfolioPermissionDto(saved);
    },
    { userId: EntityId.create(input.actorId) },
  );
}
