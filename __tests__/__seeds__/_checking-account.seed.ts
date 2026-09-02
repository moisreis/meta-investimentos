import {
  CHECKING_ACCOUNT,
  CHECKING_ACCOUNT_ID,
  EXTERNAL_CHECKING_ACCOUNT,
  EXTERNAL_CHECKING_ACCOUNT_ID,
  FEBRUARY_DATE,
  FRESH_CHECKING_ACCOUNT,
  JANUARY_DATE,
  JANUARY_DUPLICATE_DATE,
  OTHER_CHECKING_ACCOUNT,
  OTHER_CHECKING_ACCOUNT_ID,
  PERIOD_OUTSIDE_CHECKING_ACCOUNT,
  PERIOD_OUTSIDE_CHECKING_ACCOUNT_ID,
  UPDATED_CHECKING_ACCOUNT,
} from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import type { CheckingAccount } from "@/business/entities";
import { checkingAccount } from "@/infrastructure/database/schemas";
import { seedBankAccounts } from "./_bank-account.seed";

const PERIOD_OUTSIDE_ACCOUNT_ID = PERIOD_OUTSIDE_CHECKING_ACCOUNT_ID;
const PERIOD_OUTSIDE_ACCOUNT = PERIOD_OUTSIDE_CHECKING_ACCOUNT;

export {
  CHECKING_ACCOUNT_ID,
  OTHER_CHECKING_ACCOUNT_ID,
  EXTERNAL_CHECKING_ACCOUNT_ID,
  JANUARY_DATE,
  JANUARY_DUPLICATE_DATE,
  FEBRUARY_DATE,
  CHECKING_ACCOUNT,
  OTHER_CHECKING_ACCOUNT,
  EXTERNAL_CHECKING_ACCOUNT,
  UPDATED_CHECKING_ACCOUNT,
  FRESH_CHECKING_ACCOUNT,
};

export { PERIOD_OUTSIDE_ACCOUNT_ID, PERIOD_OUTSIDE_ACCOUNT };

export async function seedCheckingAccounts(): Promise<CheckingAccount[]> {
  await seedBankAccounts();

  for (const fixture of [CHECKING_ACCOUNT, OTHER_CHECKING_ACCOUNT]) {
    await db
      .insert(checkingAccount)
      .values({ ...toCheckingAccountRow(fixture), id: fixture.id });
  }

  return [CHECKING_ACCOUNT, OTHER_CHECKING_ACCOUNT];
}

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
