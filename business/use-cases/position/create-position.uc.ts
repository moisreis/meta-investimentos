import { Position } from "@/business/entities/portfolio/position.entity";
import {
  canMutatePortfolio,
  resolvePortfolioAccess,
} from "@/business/use-cases/shared/portfolio-access";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError, ValidationError } from "@/shared/errors";

import type { PositionDto } from "./position.dtos";
import { toPositionDto } from "./position.dtos";

/**
 * Input for {@link createPosition}.
 */
export interface CreatePositionInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the portfolio the position belongs to.
   */
  portfolioId: string;

  /**
   * The id of the fund the position holds.
   */
  fundId: string;
}

/**
 * Creates a position for a fund within a portfolio.
 *
 * Only the portfolio owner or an editor may create positions. The
 * position is created inside one `UnitOfWork` transaction.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The actor, portfolio, and fund.
 * @returns The created {@link PositionDto}.
 *
 * @throws {NotFoundError} When the portfolio is not accessible.
 * @throws {ValidationError} When a position for the fund already exists
 *   in the portfolio.
 */
export async function createPosition(
  unitOfWork: UnitOfWork,
  input: CreatePositionInput,
): Promise<PositionDto> {
  return unitOfWork.run(
    async (tx) => {
      const { role } = await resolvePortfolioAccess(
        tx,
        EntityId.create(input.portfolioId),
        EntityId.create(input.actorId),
      );

      if (!canMutatePortfolio(role)) {
        throw new NotFoundError(
          `Portfolio with id ${input.portfolioId} was not found.`,
        );
      }

      const existing = await tx.positions.findByPortfolioIdAndFundId(
        EntityId.create(input.portfolioId),
        EntityId.create(input.fundId),
      );

      if (existing !== null) {
        throw new ValidationError(
          "A position for this fund already exists in the portfolio.",
        );
      }

      const position = Position.create({
        portfolioId: EntityId.create(input.portfolioId),
        fundId: EntityId.create(input.fundId),
      });

      const saved = await tx.positions.save(position);

      return toPositionDto(saved);
    },
    { userId: EntityId.create(input.actorId) },
  );
}
