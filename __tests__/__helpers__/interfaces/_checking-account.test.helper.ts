import { ID } from "@/__tests__/__fixtures__";
import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import { CheckingAccount } from "@/business/entities/bank/checking-account.entity";
import type { ICheckingAccount } from "@/business/interfaces/bank/checking-account.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { SignedMoney } from "@/business/value-objects/signed-money.vo";

/**
 * Represents the shared January date for checking account fixtures.
 *
 * The date is `2026-01-05T00:00:00.000Z`.
 */
export const JANUARY_DATE = new Date("2026-01-05T00:00:00.000Z");

/**
 * Represents the shared February date for checking account fixtures.
 *
 * The date is `2026-02-10T00:00:00.000Z`.
 */
export const FEBRUARY_DATE = new Date("2026-02-10T00:00:00.000Z");

/**
 * Represents the default checking account fixture for tests.
 *
 * The fixture links to the default bank account. The date is
 * January 5, 2026 and the value is `1234.56`.
 */
export const CHECKING_ACCOUNT = CheckingAccount.create(
  {
    bankAccountId: EntityId.create(ID.BANK_ACCOUNT.DEFAULT),
    date: JANUARY_DATE,
    value: SignedMoney.create("1234.56"),
  },
  ID.CHECKING_ACCOUNT.DEFAULT,
);

/**
 * Represents an alternative checking account fixture for tests.
 *
 * The fixture links to the alternative bank account. The date
 * is February 10, 2026 and the value is `-50.00`.
 */
export const OTHER_CHECKING_ACCOUNT = CheckingAccount.create(
  {
    bankAccountId: EntityId.create(ID.BANK_ACCOUNT.OTHER),
    date: FEBRUARY_DATE,
    value: SignedMoney.create("-50.00"),
  },
  ID.CHECKING_ACCOUNT.OTHER,
);

/**
 * Represents a checking account fixture for testing external
 * lookups.
 *
 * The fixture links to the default bank account. The date is
 * January 15, 2026 and the value is `2000.00`.
 */
export const EXTERNAL_CHECKING_ACCOUNT = CheckingAccount.create(
  {
    bankAccountId: EntityId.create(ID.BANK_ACCOUNT.DEFAULT),
    date: new Date("2026-01-15T00:00:00.000Z"),
    value: SignedMoney.create("2000.00"),
  },
  ID.CHECKING_ACCOUNT.EXTERNAL,
);

/**
 * Represents a checking account fixture outside a test period.
 *
 * The fixture links to the default bank account. The date is
 * March 1, 2026 and the value is `500.00`. Use this fixture
 * to test date-range filtering.
 */
export const PERIOD_OUTSIDE_CHECKING_ACCOUNT = CheckingAccount.create(
  {
    bankAccountId: EntityId.create(ID.BANK_ACCOUNT.DEFAULT),
    date: new Date("2026-03-01T00:00:00.000Z"),
    value: SignedMoney.create("500.00"),
  },
  ID.CHECKING_ACCOUNT.PERIOD_OUTSIDE,
);

/**
 * Represents an updated version of the default checking account.
 *
 * The fixture keeps the same bank account and date as the
 * default checking account. The value changes to `4321.10`.
 */
export const UPDATED_CHECKING_ACCOUNT = CheckingAccount.create(
  {
    bankAccountId: EntityId.create(ID.BANK_ACCOUNT.DEFAULT),
    date: JANUARY_DATE,
    value: SignedMoney.create("4321.10"),
  },
  ID.CHECKING_ACCOUNT.DEFAULT,
);

/**
 * Represents a checking account fixture without a predefined ID.
 *
 * The fixture links to the default bank account. The date is
 * April 5, 2026 and the value is `3000.00`. The code
 * generates the ID at creation.
 */
export const FRESH_CHECKING_ACCOUNT = CheckingAccount.create({
  bankAccountId: EntityId.create(ID.BANK_ACCOUNT.DEFAULT),
  date: new Date("2026-04-05T00:00:00.000Z"),
  value: SignedMoney.create("3000.00"),
});

/**
 * Represents the raw creation props for the default checking
 * account fixture.
 *
 * Use this object to create matching instances in tests
 * without going through the entity factory.
 */
export const PROPS = {
  bankAccountId: EntityId.create(ID.BANK_ACCOUNT.DEFAULT),
  date: new Date("2026-01-05T00:00:00.000Z"),
  value: SignedMoney.create("-123.45"),
};

/**
 * Represents the default checking account identifier for tests.
 */
export const CHECKING_ACCOUNT_ID = ID.CHECKING_ACCOUNT.DEFAULT;

/**
 * Represents the default bank account identifier referenced
 * by {@link CHECKING_ACCOUNT}.
 */
export const BANK_ACCOUNT_ID = ID.BANK_ACCOUNT.DEFAULT;

/**
 * Creates an in-memory implementation of the
 * {@link ICheckingAccount} repository interface.
 *
 * The repository stores {@link CheckingAccount} instances in
 * memory and supports lookup by ID, by bank account ID, and
 * by bank account ID with date. Use this factory in unit
 * tests that need a persistent but isolated checking account
 * store.
 *
 * @returns A fresh {@link ICheckingAccount} instance backed
 *          by memory.
 */
export function createInMemoryCheckingAccountRepository(): ICheckingAccount {
  const BASE = createInMemoryRepository<
    Awaited<ReturnType<ICheckingAccount["save"]>>
  >({ extractId: (ca) => ca.id });

  return {
    findById: (id) => BASE.findById(id),
    async findAllByBankAccountId(bankAccountId) {
      return BASE.match((ca) => ca.bankAccountId === bankAccountId);
    },
    async findByBankAccountIdAndDate(bankAccountId, date) {
      return BASE.findOne(
        (ca) =>
          ca.bankAccountId === bankAccountId &&
          ca.date.getTime() === date.getTime(),
      );
    },
    save: (checkingAccount) => BASE.save(checkingAccount),
    delete: (id) => BASE.delete(id),
  };
}
