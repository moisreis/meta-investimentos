import {
  BANK_ACCOUNT,
  BANK_ACCOUNT_ID,
  BANK_ID,
  FRESH_BANK_ACCOUNT,
  OTHER_BANK_ACCOUNT,
  OTHER_BANK_ACCOUNT_ID,
  OTHER_BANK_ID,
  OTHER_PORTFOLIO_ID,
  PORTFOLIO_ID,
  THIRD_BANK_ACCOUNT,
  THIRD_BANK_ACCOUNT_ID,
  UPDATED_BANK_ACCOUNT,
} from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import type { BankAccount } from "@/business/entities";
import { bankAccount } from "@/infrastructure/database/schemas";
import { seedBankById } from "./_bank.seed";
import { seedPortfolioById } from "./_portfolio.seed";

export {
  BANK_ACCOUNT_ID,
  OTHER_BANK_ACCOUNT_ID,
  THIRD_BANK_ACCOUNT_ID,
  BANK_ACCOUNT,
  OTHER_BANK_ACCOUNT,
  THIRD_BANK_ACCOUNT,
  UPDATED_BANK_ACCOUNT,
  FRESH_BANK_ACCOUNT,
};

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
