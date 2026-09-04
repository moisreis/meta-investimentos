import {
  canMutatePortfolio,
  resolvePortfolioAccess,
} from "@/business/use-cases/shared/portfolio-access";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

/**
 * Input for {@link deleteBankAccount}.
 */
export interface DeleteBankAccountInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the bank account to delete.
   */
  bankAccountId: string;
}

/**
 * Deletes a bank account of a portfolio.
 *
 * The actor must be able to mutate the account's portfolio. The deletion
 * runs inside one `UnitOfWork` transaction so the removal and its audit
 * log commit atomically.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The delete input.
 *
 * @throws {NotFoundError} When the bank account does not exist or the
 *   actor cannot mutate its portfolio.
 */
export async function deleteBankAccount(
  unitOfWork: UnitOfWork,
  input: DeleteBankAccountInput,
): Promise<void> {
  await unitOfWork.run(
    async (tx) => {
      const bankAccountId = EntityId.create(input.bankAccountId);

      const existing = await tx.bankAccounts.findById(bankAccountId);

      if (existing === null) {
        throw new NotFoundError(
          `BankAccount with id ${input.bankAccountId} was not found.`,
        );
      }

      const { role } = await resolvePortfolioAccess(
        tx,
        existing.portfolioId,
        EntityId.create(input.actorId),
      );

      if (!canMutatePortfolio(role)) {
        throw new NotFoundError(
          `BankAccount with id ${input.bankAccountId} was not found.`,
        );
      }

      await tx.bankAccounts.delete(bankAccountId);
    },
    { userId: EntityId.create(input.actorId) },
  );
}
