import {
  canMutatePortfolio,
  resolvePortfolioAccess,
} from "@/business/use-cases/shared/portfolio-access";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { SignedMoney } from "@/business/value-objects/signed-money.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import type { CheckingAccountDto } from "./bank.dtos";
import { toCheckingAccountDto } from "./bank.dtos";

/**
 * Input for {@link updateCheckingAccount}.
 */
export interface UpdateCheckingAccountInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the checking account transaction to update.
   */
  checkingAccountId: string;

  /**
   * The new value of the transaction, as a signed decimal string.
   */
  value?: string;
}

/**
 * Updates a checking account transaction.
 *
 * The actor must be able to mutate the portfolio of the transaction's
 * bank account. The update runs inside one `UnitOfWork` transaction so
 * the change and its audit log commit atomically.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The update input.
 * @returns The updated {@link CheckingAccountDto}.
 *
 * @throws {NotFoundError} When the transaction or its bank account does
 *   not exist, or the actor cannot mutate the portfolio.
 */
export async function updateCheckingAccount(
  unitOfWork: UnitOfWork,
  input: UpdateCheckingAccountInput,
): Promise<CheckingAccountDto> {
  return unitOfWork.run(
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

      const updated =
        input.value !== undefined
          ? existing.updateValue(SignedMoney.create(input.value))
          : existing;

      const saved = await tx.checkingAccounts.save(updated);

      return toCheckingAccountDto(saved);
    },
    { userId: EntityId.create(input.actorId) },
  );
}
