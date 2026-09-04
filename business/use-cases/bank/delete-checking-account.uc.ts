import {
  canMutatePortfolio,
  resolvePortfolioAccess,
} from "@/business/use-cases/shared/portfolio-access";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

/**
 * Input for {@link deleteCheckingAccount}.
 */
export interface DeleteCheckingAccountInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the checking account transaction to delete.
   */
  checkingAccountId: string;
}

/**
 * Deletes a checking account transaction.
 *
 * The actor must be able to mutate the portfolio of the transaction's
 * bank account. The deletion runs inside one `UnitOfWork` transaction so
 * the removal and its audit log commit atomically.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The delete input.
 *
 * @throws {NotFoundError} When the transaction or its bank account does
 *   not exist, or the actor cannot mutate the portfolio.
 */
export async function deleteCheckingAccount(
  unitOfWork: UnitOfWork,
  input: DeleteCheckingAccountInput,
): Promise<void> {
  await unitOfWork.run(
    async (tx) => {
      const checkingAccountId = EntityId.create(input.checkingAccountId);

      const existing = await tx.checkingAccounts.findById(checkingAccountId);

      if (existing === null) {
        throw new NotFoundError(
          `CheckingAccount with id ${input.checkingAccountId} was not found.`,
        );
      }

      const bankAccount = await tx.bankAccounts.findById(
        existing.bankAccountId,
      );

      if (bankAccount === null) {
        throw new NotFoundError(
          `BankAccount with id ${existing.bankAccountId} was not found.`,
        );
      }

      const { role } = await resolvePortfolioAccess(
        tx,
        bankAccount.portfolioId,
        EntityId.create(input.actorId),
      );

      if (!canMutatePortfolio(role)) {
        throw new NotFoundError(
          `CheckingAccount with id ${input.checkingAccountId} was not found.`,
        );
      }

      await tx.checkingAccounts.delete(checkingAccountId);
    },
    { userId: EntityId.create(input.actorId) },
  );
}
