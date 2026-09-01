import { db } from "@/__tests__/__setup__/_database.setup";
import { BankAccount } from "@/business/entities";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { bankAccount } from "@/infrastructure/database/schemas";
import { BANK_ID, OTHER_BANK_ID, seedBankById } from "./_bank.seed";
import {
  OTHER_PORTFOLIO_ID,
  PORTFOLIO_ID,
  seedPortfolioById,
} from "./_portfolio.seed";

export const BANK_ACCOUNT_ID = "12345678-90ab-4cde-f012-3456789abcde";
export const OTHER_BANK_ACCOUNT_ID = "23456789-0abc-4def-a123-456789abcdef";
export const THIRD_BANK_ACCOUNT_ID = "3456789a-bc0d-4efa-b234-56789abcde0f";

export const BANK_ACCOUNT = BankAccount.create(
  {
    portfolioId: EntityId.create(PORTFOLIO_ID),
    bankId: EntityId.create(BANK_ID),
    agency: "0001",
    accountNumber: "12345-6",
  },
  BANK_ACCOUNT_ID,
);

export const OTHER_BANK_ACCOUNT = BankAccount.create(
  {
    portfolioId: EntityId.create(OTHER_PORTFOLIO_ID),
    bankId: EntityId.create(OTHER_BANK_ID),
    agency: "0002",
    accountNumber: "67890-1",
  },
  OTHER_BANK_ACCOUNT_ID,
);

export const THIRD_BANK_ACCOUNT = BankAccount.create(
  {
    portfolioId: EntityId.create(PORTFOLIO_ID),
    bankId: EntityId.create(OTHER_BANK_ID),
    agency: "0003",
    accountNumber: "11111-2",
  },
  THIRD_BANK_ACCOUNT_ID,
);

export const UPDATED_BANK_ACCOUNT = BankAccount.create(
  {
    portfolioId: EntityId.create(PORTFOLIO_ID),
    bankId: EntityId.create(BANK_ID),
    agency: "0001",
    accountNumber: "54321-0",
  },
  BANK_ACCOUNT_ID,
);

export const FRESH_BANK_ACCOUNT = BankAccount.create({
  portfolioId: EntityId.create(PORTFOLIO_ID),
  bankId: EntityId.create(BANK_ID),
  agency: "0004",
  accountNumber: "99999-9",
});

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

export async function seedBankAccounts(): Promise<BankAccount[]> {
  await seedBankById(BANK_ID);
  await seedBankById(OTHER_BANK_ID);
  await seedPortfolioById(PORTFOLIO_ID);
  await seedPortfolioById(OTHER_PORTFOLIO_ID);

  for (const fixture of [BANK_ACCOUNT, OTHER_BANK_ACCOUNT]) {
    await db
      .insert(bankAccount)
      .values({ ...toBankAccountRow(fixture), id: fixture.id });
  }

  return [BANK_ACCOUNT, OTHER_BANK_ACCOUNT];
}

export async function seedThirdBankAccount(): Promise<BankAccount> {
  await seedBankById(THIRD_BANK_ACCOUNT.bankId);
  await seedPortfolioById(THIRD_BANK_ACCOUNT.portfolioId);

  await db.insert(bankAccount).values({
    ...toBankAccountRow(THIRD_BANK_ACCOUNT),
    id: THIRD_BANK_ACCOUNT.id,
  });

  return THIRD_BANK_ACCOUNT;
}
