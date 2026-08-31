import { db } from "@/__tests__/__setup__/_database.setup";
import { Account } from "@/business/entities";
import { account } from "@/infrastructure/database/schemas";
import { OTHER_USER_ID, seedUserById, USER_ID } from "./_user.seed";

export const ACCOUNT_ID = "a1b2c3d4-5e6f-4a7b-8c9d-0e1f2a3b4c5d";
export const OTHER_ACCOUNT_ID = "b2c3d4e5-6f7a-4b8c-9d0e-1f2a3b4c5d6e";
export const THIRD_ACCOUNT_ID = "c3d4e5f6-7a8b-4c9d-8e0f-1a2b3c4d5e6f";

export const ACCOUNT = Account.create(
  {
    issuer: "github",
    providerId: "github",
    accountId: "octocat",
    userId: USER_ID,
  },
  ACCOUNT_ID,
);

export const OTHER_ACCOUNT = Account.create(
  {
    issuer: "github",
    providerId: "github",
    accountId: "octodog",
    userId: OTHER_USER_ID,
  },
  OTHER_ACCOUNT_ID,
);

export const THIRD_ACCOUNT = Account.create(
  {
    issuer: "github",
    providerId: "github",
    accountId: "octopus",
    userId: USER_ID,
  },
  THIRD_ACCOUNT_ID,
);

export const ACCOUNTS = [ACCOUNT, OTHER_ACCOUNT];

export const UPDATED_ACCOUNT = Account.create(
  {
    issuer: "github",
    providerId: "github",
    accountId: "octocat-updated",
    userId: USER_ID,
  },
  ACCOUNT_ID,
);

export const FRESH_ACCOUNT = Account.create({
  issuer: "github",
  providerId: "github",
  accountId: "fresh-bot",
  userId: USER_ID,
});

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
