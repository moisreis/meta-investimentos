import {
  canMutatePortfolio,
  resolvePortfolioAccess,
} from "@/business/use-cases/shared/portfolio-access";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import type { PositionDto } from "./position.dtos";
import { toPositionDto } from "./position.dtos";

/**
 * Input for {@link updatePosition}.
 */
export interface UpdatePositionInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the position to update.
   */
  positionId: string;

  /**
   * The new initial balance, as a decimal string.
   */
  initialBalance: string;

  /**
   * The effective date of the initial balance.
   */
  initialBalanceDate: Date;
}

/**
 * Sets the initial balance of a position.
 *
 * Only the portfolio owner or an editor may set an initial balance. The
 * transition is performed by {@link Position.setInitialBalance}, which
 * bumps the optimistic-locking version, inside one `UnitOfWork`
 * transaction.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The actor, position, and initial balance.
 * @returns The updated {@link PositionDto}.
 *
 * @throws {NotFoundError} When the position or its portfolio is not
 *   accessible.
 */
export async function updatePosition(
  unitOfWork: UnitOfWork,
  input: UpdatePositionInput,
): Promise<PositionDto> {
  return unitOfWork.run(
    async (tx) => {
      const position = await tx.positions.findById(
        EntityId.create(input.positionId),
      );

      if (position === null) {
        throw new NotFoundError(
          `Position with id ${input.positionId} was not found.`,
        );
      }

      const { role } = await resolvePortfolioAccess(
        tx,
        position.portfolioId,
        EntityId.create(input.actorId),
      );

      if (!canMutatePortfolio(role)) {
        throw new NotFoundError(
          `Portfolio with id ${position.portfolioId} was not found.`,
        );
      }

      const updated = position.setInitialBalance(
        PositiveMoney.create(input.initialBalance),
        input.initialBalanceDate,
      );

      const saved = await tx.positions.save(updated);

      return toPositionDto(saved);
    },
    { userId: EntityId.create(input.actorId) },
  );
}
