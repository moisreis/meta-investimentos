import { ID } from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import { BankAccount } from "@/business/entities/bank/bank-account.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { bankAccount } from "@/infrastructure/database/schemas";
import { seedBankById } from "./_bank.seed";
import { seedPortfolioById } from "./_portfolio.seed";

/**
 * Represents the default bank account fixture used in tests.
 *
 * The fixture uses the default portfolio, the default bank,
 * and agency `0001` with account number `12345-6`.
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
 * The fixture uses the other portfolio, the other bank,
 * and agency `0002` with account number `67890-1`.
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
 * The fixture uses the default portfolio, the other bank,
 * and agency `0003` with account number `11111-2`.
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
 * Represents an updated version of the default bank account fixture.
 *
 * The fixture reuses the default bank account ID but changes
 * the account number to `54321-0`.
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
 * The fixture uses the default portfolio and default bank.
 * It has agency `0004` and account number `99999-9`.
 */
export const FRESH_BANK_ACCOUNT = BankAccount.create({
  portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
  bankId: EntityId.create(ID.BANK.DEFAULT),
  agency: "0004",
  accountNumber: "99999-9",
});

/**
 * Represents the default bank account identifier for tests.
 */
export const BANK_ACCOUNT_ID = ID.BANK_ACCOUNT.DEFAULT;

/**
 * Represents the other bank account identifier for tests.
 */
export const OTHER_BANK_ACCOUNT_ID = ID.BANK_ACCOUNT.OTHER;

/**
 * Represents the third bank account identifier for tests.
 */
export const THIRD_BANK_ACCOUNT_ID = ID.BANK_ACCOUNT.THIRD;

function toBankAccountRow(
  entity: BankAccount,
): typeof bankAccount.$inferInsert {
  return {
    portfolioId: entity.portfolioId,
    bankId: entity.bankId,
    agency: entity.agency,
    accountNumber: entity.accountNumber,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}

/**
 * Seeds the default bank accounts into the test database.
 *
 * The function ensures that both the default and the other
 * bank and portfolio records exist. It then inserts the
 * `BANK_ACCOUNT` and `OTHER_BANK_ACCOUNT` fixtures.
 *
 * @returns A promise that resolves to an array containing
 *          the seeded `BankAccount` fixtures.
 */
export async function seedBankAccounts(): Promise<BankAccount[]> {
  await seedBankById(ID.BANK.DEFAULT);
  await seedBankById(ID.BANK.OTHER);
  await seedPortfolioById(ID.PORTFOLIO.DEFAULT);
  await seedPortfolioById(ID.PORTFOLIO.OTHER);

  for (const fixture of [BANK_ACCOUNT, OTHER_BANK_ACCOUNT]) {
    await db
      .insert(bankAccount)
      .values({ ...toBankAccountRow(fixture), id: fixture.id });
  }

  return [BANK_ACCOUNT, OTHER_BANK_ACCOUNT];
}

/**
 * Seeds the third bank account into the test database.
 *
 * The function ensures that the required bank and portfolio
 * records exist. It then inserts the `THIRD_BANK_ACCOUNT`
 * fixture.
 *
 * @returns A promise that resolves to the seeded
 *          `THIRD_BANK_ACCOUNT` fixture.
 */
export async function seedThirdBankAccount(): Promise<BankAccount> {
  await seedBankById(THIRD_BANK_ACCOUNT.bankId);
  await seedPortfolioById(THIRD_BANK_ACCOUNT.portfolioId);

  await db.insert(bankAccount).values({
    ...toBankAccountRow(THIRD_BANK_ACCOUNT),
    id: THIRD_BANK_ACCOUNT.id,
  });

  return THIRD_BANK_ACCOUNT;
}
