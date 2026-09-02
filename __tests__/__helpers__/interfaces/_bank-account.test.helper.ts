import {
  BANK_ACCOUNT,
  BANK_ACCOUNT_ID,
  BANK_ID,
  FRESH_BANK_ACCOUNT,
  OTHER_BANK_ACCOUNT,
  OTHER_BANK_ID,
  OTHER_PORTFOLIO_ID,
  PORTFOLIO_ID,
  THIRD_BANK_ACCOUNT,
  UPDATED_BANK_ACCOUNT,
} from "@/__tests__/__fixtures__";
import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import type { IBankAccount } from "@/business/interfaces/bank/bank-account.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";

export {
  BANK_ACCOUNT_ID,
  PORTFOLIO_ID,
  OTHER_PORTFOLIO_ID,
  BANK_ID,
  OTHER_BANK_ID,
  BANK_ACCOUNT,
  OTHER_BANK_ACCOUNT,
  THIRD_BANK_ACCOUNT,
  UPDATED_BANK_ACCOUNT,
  FRESH_BANK_ACCOUNT,
};

export const PROPS = {
  portfolioId: EntityId.create(PORTFOLIO_ID),
  bankId: EntityId.create(BANK_ID),
  agency: "0001",
  accountNumber: "12345-6",
};

export function createInMemoryBankAccountRepository(): IBankAccount {
  const BASE = createInMemoryRepository<
    Awaited<ReturnType<IBankAccount["save"]>>
  >({ extractId: (ba) => ba.id });

  return {
    findById: (id) => BASE.findById(id),
    async findAllByPortfolioId(portfolioId) {
      return BASE.match((ba) => ba.portfolioId === portfolioId);
    },
    async findAllByBankId(bankId) {
      return BASE.match((ba) => ba.bankId === bankId);
    },
    save: (bankAccount) => BASE.save(bankAccount),
    delete: (id) => BASE.delete(id),
  };
}
