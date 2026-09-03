import { ID } from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import type { Account } from "@/business/entities";
import { Account as AccountEntity } from "@/business/entities/user/account.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { account } from "@/infrastructure/database/schemas";
import { seedUserById } from "./_user.seed";

/**
 * Represents the default account fixture for tests.
 *
 * Creates an `Account` linked to the default user with
 * the `github` issuer and `octocat` account identifier.
 */
const ACCOUNT = AccountEntity.create(
  {
    issuer: "github",
    providerId: "github",
    accountId: "octocat",
    userId: EntityId.create(ID.USER.DEFAULT),
  },
  ID.ACCOUNT.DEFAULT,
);

/**
 * Represents a secondary account fixture for tests.
 *
 * Creates an `Account` linked to the other user with
 * the `github` issuer and `octodog` account identifier.
 */
const OTHER_ACCOUNT = AccountEntity.create(
  {
    issuer: "github",
    providerId: "github",
    accountId: "octodog",
    userId: EntityId.create(ID.USER.OTHER),
  },
  ID.ACCOUNT.OTHER,
);

/**
 * Represents a third account fixture for tests.
 *
 * Creates an `Account` linked to the default user with
 * the `github` issuer and `octopus` account identifier.
 */
const THIRD_ACCOUNT = AccountEntity.create(
  {
    issuer: "github",
    providerId: "github",
    accountId: "octopus",
    userId: EntityId.create(ID.USER.DEFAULT),
  },
  ID.ACCOUNT.THIRD,
);

/**
 * Represents an updated version of the default account fixture.
 *
 * Creates an `Account` with the same ID as `ACCOUNT` but with
 * the `octocat-updated` account identifier. Use this to test
 * update operations on account entities.
 */
const UPDATED_ACCOUNT = AccountEntity.create(
  {
    issuer: "github",
    providerId: "github",
    accountId: "octocat-updated",
    userId: EntityId.create(ID.USER.DEFAULT),
  },
  ID.ACCOUNT.DEFAULT,
);

/**
 * Represents a fresh account fixture without a fixed ID.
 *
 * Creates an `Account` with the `github` issuer and
 * `fresh-bot` account identifier. The entity generates
 * a new ID when created.
 */
const FRESH_ACCOUNT = AccountEntity.create({
  issuer: "github",
  providerId: "github",
  accountId: "fresh-bot",
  userId: EntityId.create(ID.USER.DEFAULT),
});

/**
 * Represents the default pair of account fixtures for tests.
 */
const ACCOUNTS = [ACCOUNT, OTHER_ACCOUNT];

/**
 * Represents the default account ID used in tests.
 */
const ACCOUNT_ID = ID.ACCOUNT.DEFAULT;

/**
 * Represents the other account ID used in tests.
 */
const OTHER_ACCOUNT_ID = ID.ACCOUNT.OTHER;

/**
 * Represents the third account ID used in tests.
 */
const THIRD_ACCOUNT_ID = ID.ACCOUNT.THIRD;

/**
 * Represents the default user ID used in account tests.
 */
const USER_ID = ID.USER.DEFAULT;

/**
 * Represents the other user ID used in account tests.
 */
const OTHER_USER_ID = ID.USER.OTHER;

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

/**
 * Seeds the default and other account fixtures into the database.
 *
 * Inserts the `ACCOUNT` and `OTHER_ACCOUNT` fixtures. Creates
 * the linked user rows first when they do not exist.
 *
 * @returns An array containing the seeded `ACCOUNT` and
 *          `OTHER_ACCOUNT` instances.
 */
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

/**
 * Seeds the third account fixture into the database.
 *
 * Inserts the `THIRD_ACCOUNT` fixture. Creates the linked
 * user row first when it does not exist.
 *
 * @returns The seeded `THIRD_ACCOUNT` instance.
 */
export async function seedThirdAccount(): Promise<Account> {
  await seedUserById(USER_ID);

  await db
    .insert(account)
    .values({ ...toAccountRow(THIRD_ACCOUNT), id: THIRD_ACCOUNT.id });

  return THIRD_ACCOUNT;
}
