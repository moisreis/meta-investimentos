import {
  canMutatePortfolio,
  resolvePortfolioAccess,
} from "@/business/use-cases/shared/portfolio-access";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError, ValidationError } from "@/shared/errors";

/**
 * Input for {@link undoWithdrawalAllocations}.
 */
export interface UndoWithdrawalAllocationsInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the withdrawal whose allocations are undone.
   */
  withdrawalId: string;
}

/**
 * Undoes (removes) the transaction allocations of a withdrawal.
 *
 * The action loads the withdrawal and its position, resolves the
 * portfolio access, and deletes every `TransactionAllocation` record
 * that references the withdrawal, atomically within one `UnitOfWork`
 * transaction.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The actor and the withdrawal id.
 *
 * @throws {NotFoundError} When the withdrawal or its portfolio is not
 *   accessible.
 * @throws {ValidationError} When the withdrawal is reversed.
 */
export async function undoWithdrawalAllocations(
  unitOfWork: UnitOfWork,
  input: UndoWithdrawalAllocationsInput,
): Promise<void> {
  await unitOfWork.run(
    async (tx) => {
      const withdrawal = await tx.withdrawals.findById(
        EntityId.create(input.withdrawalId),
      );

      if (withdrawal === null) {
        throw new NotFoundError(
          `Withdrawal with id ${input.withdrawalId} was not found.`,
        );
      }

      if (withdrawal.reversedAt !== null) {
        throw new ValidationError(
          "Cannot undo allocations of a reversed withdrawal.",
        );
      }

      const position = await tx.positions.findById(withdrawal.positionId);

      if (position === null) {
        throw new NotFoundError(
          `Position with id ${withdrawal.positionId} was not found.`,
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

      const allocations = await tx.transactionAllocations.findAllByWithdrawalId(
        EntityId.create(input.withdrawalId),
      );

      for (const allocation of allocations) {
        if (allocation.id === undefined) {
          continue;
        }
        await tx.transactionAllocations.delete(allocation.id);
      }
    },
    { userId: EntityId.create(input.actorId) },
  );
}
