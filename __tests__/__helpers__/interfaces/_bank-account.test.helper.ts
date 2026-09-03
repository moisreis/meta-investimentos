import { ID } from "@/__tests__/__fixtures__";
import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import { BankAccount } from "@/business/entities/bank/bank-account.entity";
import type { IBankAccount } from "@/business/interfaces/bank/bank-account.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";

/**
 * Represents the default bank account fixture for tests.
 *
 * The fixture links to the default portfolio and the default
 * bank. The agency is `0001` and the account number is
 * `12345-6`.
 */
export const BANK_ACCOUNT = BankAccount.create(
  {
    portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
    bankId: EntityId.create(ID.BANK.DEFAULT),
    agency: "0001",
    accountNumber: "12345-6",
  },
  ID.BANK_ACCOUNT.DEFAULT,
);

/**
 * Represents an alternative bank account fixture for tests.
 *
 * The fixture links to the alternative portfolio and the
 * alternative bank. The agency is `0002` and the account
 * number is `67890-1`.
 */
export const OTHER_BANK_ACCOUNT = BankAccount.create(
  {
    portfolioId: EntityId.create(ID.PORTFOLIO.OTHER),
    bankId: EntityId.create(ID.BANK.OTHER),
    agency: "0002",
    accountNumber: "67890-1",
  },
  ID.BANK_ACCOUNT.OTHER,
);

/**
 * Represents a third bank account fixture for tests.
 *
 * The fixture links to the default portfolio and the
 * alternative bank. The agency is `0003` and the account
 * number is `11111-2`.
 */
export const THIRD_BANK_ACCOUNT = BankAccount.create(
  {
    portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
    bankId: EntityId.create(ID.BANK.OTHER),
    agency: "0003",
    accountNumber: "11111-2",
  },
  ID.BANK_ACCOUNT.THIRD,
);

/**
 * Represents an updated version of the default bank account.
 *
 * The fixture keeps the same portfolio, bank, and agency as
 * the default bank account. The account number changes to
 * `54321-0`.
 */
export const UPDATED_BANK_ACCOUNT = BankAccount.create(
  {
    portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
    bankId: EntityId.create(ID.BANK.DEFAULT),
    agency: "0001",
    accountNumber: "54321-0",
  },
  ID.BANK_ACCOUNT.DEFAULT,
);

/**
 * Represents a bank account fixture without a predefined ID.
 *
 * The fixture links to the default portfolio and the default
 * bank. The agency is `0004` and the account number is
 * `99999-9`. The code generates the ID at creation.
 */
export const FRESH_BANK_ACCOUNT = BankAccount.create({
  portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
  bankId: EntityId.create(ID.BANK.DEFAULT),
  agency: "0004",
  accountNumber: "99999-9",
});

/**
 * Represents the raw creation props for the default bank
 * account fixture.
 *
 * Use this object to create matching instances in tests
 * without going through the entity factory.
 */
export const PROPS = {
  portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
  bankId: EntityId.create(ID.BANK.DEFAULT),
  agency: "0001",
  accountNumber: "12345-6",
};

/**
 * Represents the default bank account identifier for tests.
 */
export const BANK_ACCOUNT_ID = ID.BANK_ACCOUNT.DEFAULT;

/**
 * Represents the default bank identifier referenced by
 * {@link BANK_ACCOUNT}.
 */
export const BANK_ID = ID.BANK.DEFAULT;

/**
 * Represents the default portfolio identifier referenced by
 * {@link BANK_ACCOUNT}.
 */
export const PORTFOLIO_ID = ID.PORTFOLIO.DEFAULT;

/**
 * Creates an in-memory implementation of the
 * {@link IBankAccount} repository interface.
 *
 * The repository stores {@link BankAccount} instances in
 * memory and supports lookup by ID, by portfolio ID, and
 * by bank ID. Use this factory in unit tests that need a
 * persistent but isolated bank account store.
 *
 * @returns A fresh {@link IBankAccount} instance backed
 *          by memory.
 */
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
