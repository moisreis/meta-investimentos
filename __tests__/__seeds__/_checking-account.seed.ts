import { ID } from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import { CheckingAccount } from "@/business/entities/bank/checking-account.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { SignedMoney } from "@/business/value-objects/signed-money.vo";
import { checkingAccount } from "@/infrastructure/database/schemas";
import { seedBankAccounts } from "./_bank-account.seed";

/**
 * Represents January 5, 2026 used for testing date scenarios.
 */
export const JANUARY_DATE = new Date("2026-01-05T00:00:00.000Z");

/**
 * Represents January 15, 2026 used for duplicate date testing.
 */
export const JANUARY_DUPLICATE_DATE = new Date("2026-01-15T00:00:00.000Z");

/**
 * Represents February 10, 2026 used for testing date scenarios.
 */
export const FEBRUARY_DATE = new Date("2026-02-10T00:00:00.000Z");

/**
 * Represents the default checking account fixture used in tests.
 *
 * The fixture uses the default bank account, January date,
 * and a positive value of `1234.56`.
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
 * The fixture uses the other bank account, February date,
 * and a negative value of `-50.00`.
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
 * Represents a checking account fixture with an external date.
 *
 * The fixture uses the default bank account, the January
 * duplicate date, and a value of `2000.00`.
 */
export const EXTERNAL_CHECKING_ACCOUNT = CheckingAccount.create(
  {
    bankAccountId: EntityId.create(ID.BANK_ACCOUNT.DEFAULT),
    date: JANUARY_DUPLICATE_DATE,
    value: SignedMoney.create("2000.00"),
  },
  ID.CHECKING_ACCOUNT.EXTERNAL,
);

/**
 * Represents a checking account fixture outside the standard period.
 *
 * The fixture uses the default bank account, March date,
 * and a value of `500.00`.
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
 * Represents an updated version of the default checking account fixture.
 *
 * The fixture reuses the default checking account ID but changes
 * the value to `4321.10`.
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
 * The fixture uses the default bank account, an April date,
 * and a value of `3000.00`.
 */
export const FRESH_CHECKING_ACCOUNT = CheckingAccount.create({
  bankAccountId: EntityId.create(ID.BANK_ACCOUNT.DEFAULT),
  date: new Date("2026-04-05T00:00:00.000Z"),
  value: SignedMoney.create("3000.00"),
});

const PERIOD_OUTSIDE_ACCOUNT_ID = ID.CHECKING_ACCOUNT.PERIOD_OUTSIDE;
const PERIOD_OUTSIDE_ACCOUNT = PERIOD_OUTSIDE_CHECKING_ACCOUNT;

/**
 * Represents the default checking account identifier for tests.
 */
export const CHECKING_ACCOUNT_ID = ID.CHECKING_ACCOUNT.DEFAULT;

/**
 * Represents the other checking account identifier for tests.
 */
export const OTHER_CHECKING_ACCOUNT_ID = ID.CHECKING_ACCOUNT.OTHER;

/**
 * Represents the external checking account identifier for tests.
 */
export const EXTERNAL_CHECKING_ACCOUNT_ID = ID.CHECKING_ACCOUNT.EXTERNAL;

/**
 * Represents the ID for the period outside checking account.
 */
export { PERIOD_OUTSIDE_ACCOUNT_ID };

/**
 * Represents the period outside checking account fixture.
 */
export { PERIOD_OUTSIDE_ACCOUNT };

/**
 * Seeds the default checking accounts into the test database.
 *
 * The function first seeds the required bank accounts. It
 * then inserts the `CHECKING_ACCOUNT` and
 * `OTHER_CHECKING_ACCOUNT` fixtures.
 *
 * @returns A promise that resolves to an array containing
 *          the seeded `CheckingAccount` fixtures.
 */
export async function seedCheckingAccounts(): Promise<CheckingAccount[]> {
  await seedBankAccounts();

  for (const fixture of [CHECKING_ACCOUNT, OTHER_CHECKING_ACCOUNT]) {
    await db
      .insert(checkingAccount)
      .values({ ...toCheckingAccountRow(fixture), id: fixture.id });
  }

  return [CHECKING_ACCOUNT, OTHER_CHECKING_ACCOUNT];
}

/**
 * Seeds all checking accounts into the test database.
 *
 * The function first seeds the required bank accounts. It
 * then inserts all checking account fixtures including the
 * external and period outside fixtures.
 *
 * @returns A promise that resolves to an array containing
 *          all seeded `CheckingAccount` fixtures.
 */
export async function seedAllCheckingAccounts(): Promise<CheckingAccount[]> {
  await seedBankAccounts();

  for (const fixture of [
    CHECKING_ACCOUNT,
    EXTERNAL_CHECKING_ACCOUNT,
    PERIOD_OUTSIDE_ACCOUNT,
    OTHER_CHECKING_ACCOUNT,
  ]) {
    await db
      .insert(checkingAccount)
      .values({ ...toCheckingAccountRow(fixture), id: fixture.id });
  }

  return [
    CHECKING_ACCOUNT,
    EXTERNAL_CHECKING_ACCOUNT,
    PERIOD_OUTSIDE_ACCOUNT,
    OTHER_CHECKING_ACCOUNT,
  ];
}

function toCheckingAccountRow(
  entity: CheckingAccount,
): typeof checkingAccount.$inferInsert {
  return {
    bankAccountId: entity.bankAccountId,
    date: entity.date,
    value: entity.value.value.toString(),
  };
}
