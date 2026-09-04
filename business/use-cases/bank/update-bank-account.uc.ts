import {
  canMutatePortfolio,
  resolvePortfolioAccess,
} from "@/business/use-cases/shared/portfolio-access";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import type { BankAccountDto } from "./bank.dtos";
import { toBankAccountDto } from "./bank.dtos";

/**
 * Input for {@link updateBankAccount}.
 */
export interface UpdateBankAccountInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the bank account to update.
   */
  bankAccountId: string;

  /**
   * The new agency of the account.
   */
  agency?: string;

  /**
   * The new account number.
   */
  accountNumber?: string;
}

/**
 * Updates a bank account of a portfolio.
 *
 * The actor must be able to mutate the account's portfolio. The update
 * runs inside one `UnitOfWork` transaction so the change and its audit
 * log commit atomically.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The update input.
 * @returns The updated {@link BankAccountDto}.
 *
 * @throws {NotFoundError} When the bank account does not exist or the
 *   actor cannot mutate its portfolio.
 */
export async function updateBankAccount(
  unitOfWork: UnitOfWork,
  input: UpdateBankAccountInput,
): Promise<BankAccountDto> {
  return unitOfWork.run(
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

      const updated = existing.update({
        agency: input.agency,
        accountNumber: input.accountNumber,
      });

      const saved = await tx.bankAccounts.save(updated);

      return toBankAccountDto(saved);
    },
    { userId: EntityId.create(input.actorId) },
  );
}
