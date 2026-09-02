import {
  ACCOUNT,
  ACCOUNT_ID,
  ACCOUNTS,
  FRESH_ACCOUNT,
  OTHER_ACCOUNT,
  OTHER_ACCOUNT_ID,
  OTHER_USER_ID,
  THIRD_ACCOUNT,
  THIRD_ACCOUNT_ID,
  UPDATED_ACCOUNT,
  USER_ID,
} from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import type { Account } from "@/business/entities";
import { account } from "@/infrastructure/database/schemas";
import { seedUserById } from "./_user.seed";

export {
  ACCOUNT_ID,
  OTHER_ACCOUNT_ID,
  THIRD_ACCOUNT_ID,
  ACCOUNT,
  OTHER_ACCOUNT,
  THIRD_ACCOUNT,
  UPDATED_ACCOUNT,
  FRESH_ACCOUNT,
  ACCOUNTS,
};

function toAccountRow(entity: Account): typeof account.$inferInsert {
  return {
    issuer: entity.issuer,
    providerId: entity.providerId,
    accountId: entity.accountId,
    userId: entity.userId,
    accessToken: entity.accessToken,
    refreshToken: entity.refreshToken,
    idToken: entity.idToken,
    accessTokenExpiresAt: entity.accessTokenExpiresAt,
    refreshTokenExpiresAt: entity.refreshTokenExpiresAt,
    scope: entity.scope,
    password: entity.password,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}

export async function seedAccounts(): Promise<Account[]> {
  await seedUserById(USER_ID);
  await seedUserById(OTHER_USER_ID);

  for (const fixture of [ACCOUNT, OTHER_ACCOUNT]) {
    await db
      .insert(account)
      .values({ ...toAccountRow(fixture), id: fixture.id });
  }

  return [ACCOUNT, OTHER_ACCOUNT];
}

export async function seedThirdAccount(): Promise<Account> {
  await seedUserById(USER_ID);

  await db
    .insert(account)
    .values({ ...toAccountRow(THIRD_ACCOUNT), id: THIRD_ACCOUNT.id });

  return THIRD_ACCOUNT;
}
