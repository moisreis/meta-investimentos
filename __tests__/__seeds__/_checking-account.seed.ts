import { db } from "@/__tests__/__setup__/_database.setup";
import { CheckingAccount } from "@/business/entities";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import SignedMoney from "@/business/value-objects/signed-money.vo";
import { checkingAccount } from "@/infrastructure/database/schemas";
import {
  BANK_ACCOUNT_ID,
  OTHER_BANK_ACCOUNT_ID,
  seedBankAccounts,
} from "./_bank-account.seed";

export const CHECKING_ACCOUNT_ID = "456789ab-cd0e-4fab-c345-6789abcde0f1";
export const OTHER_CHECKING_ACCOUNT_ID = "56789abc-de0f-4abc-d456-789abcde0f12";
export const EXTERNAL_CHECKING_ACCOUNT_ID =
  "6789abcd-ef0a-4bcd-e567-89abcde0f123";
export const PERIOD_OUTSIDE_ACCOUNT_ID = "789abcde-f0ab-4cd1-9f67-8abcde012345";

export const JANUARY_DATE = new Date("2026-01-05T00:00:00.000Z");
export const JANUARY_DUPLICATE_DATE = new Date("2026-01-15T00:00:00.000Z");
export const FEBRUARY_DATE = new Date("2026-02-10T00:00:00.000Z");

export const CHECKING_ACCOUNT = CheckingAccount.create(
  {
    bankAccountId: EntityId.create(BANK_ACCOUNT_ID),
    date: JANUARY_DATE,
    value: SignedMoney.create("1234.56"),
  },
  CHECKING_ACCOUNT_ID,
);

export const OTHER_CHECKING_ACCOUNT = CheckingAccount.create(
  {
    bankAccountId: EntityId.create(OTHER_BANK_ACCOUNT_ID),
    date: FEBRUARY_DATE,
    value: SignedMoney.create("-50.00"),
  },
  OTHER_CHECKING_ACCOUNT_ID,
);

export const EXTERNAL_CHECKING_ACCOUNT = CheckingAccount.create(
  {
    bankAccountId: EntityId.create(BANK_ACCOUNT_ID),
    date: JANUARY_DUPLICATE_DATE,
    value: SignedMoney.create("2000.00"),
  },
  EXTERNAL_CHECKING_ACCOUNT_ID,
);

export const PERIOD_OUTSIDE_ACCOUNT = CheckingAccount.create(
  {
    bankAccountId: EntityId.create(BANK_ACCOUNT_ID),
    date: new Date("2026-03-01T00:00:00.000Z"),
    value: SignedMoney.create("500.00"),
  },
  PERIOD_OUTSIDE_ACCOUNT_ID,
);

export const UPDATED_CHECKING_ACCOUNT = CheckingAccount.create(
  {
    bankAccountId: EntityId.create(BANK_ACCOUNT_ID),
    date: JANUARY_DATE,
    value: SignedMoney.create("4321.10"),
  },
  CHECKING_ACCOUNT_ID,
);

export const FRESH_CHECKING_ACCOUNT = CheckingAccount.create({
  bankAccountId: EntityId.create(BANK_ACCOUNT_ID),
  date: new Date("2026-04-05T00:00:00.000Z"),
  value: SignedMoney.create("3000.00"),
});

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
