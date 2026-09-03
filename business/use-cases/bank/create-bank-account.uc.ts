import { BankAccount } from "@/business/entities/bank/bank-account.entity";
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
 * Input for {@link createBankAccount}.
 */
export interface CreateBankAccountInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the portfolio the account belongs to.
   */
  portfolioId: string;

  /**
   * The id of the bank of the account.
   */
  bankId: string;

  /**
   * The agency of the account.
   */
  agency: string;

  /**
   * The account number.
   */
  accountNumber: string;
}

/**
 * Creates a bank account for a portfolio.
 *
 * The account is created inside one `UnitOfWork` transaction so the
 * insertion and its audit log commit atomically. The actor must be able
 * to mutate the portfolio.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The bank account properties.
 * @returns The created {@link BankAccountDto}.
 *
 * @throws {NotFoundError} When the bank or the portfolio is not found
 *   or accessible.
 */
export async function createBankAccount(
  unitOfWork: UnitOfWork,
  input: CreateBankAccountInput,
): Promise<BankAccountDto> {
  return unitOfWork.run(
    async (tx) => {
      const portfolioId = EntityId.create(input.portfolioId);
      const bankId = EntityId.create(input.bankId);

      const { role } = await resolvePortfolioAccess(
        tx,
        portfolioId,
        EntityId.create(input.actorId),
      );

      if (!canMutatePortfolio(role)) {
        throw new NotFoundError(
          `Portfolio with id ${input.portfolioId} was not found.`,
        );
      }

      const bank = await tx.banks.findById(bankId);

      if (bank === null) {
        throw new NotFoundError(`Bank with id ${input.bankId} was not found.`);
      }

      const bankAccount = BankAccount.create({
        portfolioId,
        bankId,
        agency: input.agency,
        accountNumber: input.accountNumber,
      });

      const saved = await tx.bankAccounts.save(bankAccount);

      return toBankAccountDto(saved);
    },
    { userId: EntityId.create(input.actorId) },
  );
}
