import {
  canMutatePortfolio,
  resolvePortfolioAccess,
} from "@/business/use-cases/shared/portfolio-access";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError, ValidationError } from "@/shared/errors";

/**
 * Input for {@link deletePosition}.
 */
export interface DeletePositionInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the position to delete.
   */
  positionId: string;
}

/**
 * Deletes a position.
 *
 * Only the portfolio owner or an editor may delete a position, and the
 * position must not have any applications or withdrawals referencing
 * it. The deletion runs inside one `UnitOfWork` transaction.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The actor and the position id.
 *
 * @throws {NotFoundError} When the position or its portfolio is not
 *   accessible.
 * @throws {ValidationError} When the position has applications or
 *   withdrawals.
 */
export async function deletePosition(
  unitOfWork: UnitOfWork,
  input: DeletePositionInput,
): Promise<void> {
  await unitOfWork.run(
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

      const applications = await tx.applications.findAllByPositionId(
        EntityId.create(input.positionId),
      );
      const withdrawals = await tx.withdrawals.findAllByPositionId(
        EntityId.create(input.positionId),
      );

      if (applications.length > 0 || withdrawals.length > 0) {
        throw new ValidationError(
          "Cannot delete a position that has applications or withdrawals.",
        );
      }

      await tx.positions.delete(EntityId.create(input.positionId));
    },
    { userId: EntityId.create(input.actorId) },
  );
}
