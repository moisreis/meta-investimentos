import { ID } from "@/__tests__/__fixtures__";
import { createInMemoryRepository } from "@/__tests__/__fixtures__/_in-memory-repository";
import { Account } from "@/business/entities/user/account.entity";
import type { IAccount } from "@/business/interfaces/user/account.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";

/**
 * Represents the default account fixture for tests.
 *
 * The fixture links to the default user, uses the issuer
 * `github`, and has the account ID `octocat`.
 */
const ACCOUNT = Account.create(
  {
    issuer: "github",
    providerId: "github",
    accountId: "octocat",
    userId: EntityId.create(ID.USER.DEFAULT),
  },
  ID.ACCOUNT.DEFAULT,
);

/**
 * Represents an alternative account fixture for tests.
 *
 * The fixture links to the alternative user, uses the issuer
 * `github`, and has the account ID `octodog`.
 */
const OTHER_ACCOUNT = Account.create(
  {
    issuer: "github",
    providerId: "github",
    accountId: "octodog",
    userId: EntityId.create(ID.USER.OTHER),
  },
  ID.ACCOUNT.OTHER,
);

/**
 * Represents an updated version of the default account fixture.
 *
 * The fixture keeps the same ID as the default account. The
 * account ID changes to `octocat-updated`.
 */
const UPDATED_ACCOUNT = Account.create(
  {
    issuer: "github",
    providerId: "github",
    accountId: "octocat-updated",
    userId: EntityId.create(ID.USER.DEFAULT),
  },
  ID.ACCOUNT.DEFAULT,
);

/**
 * Represents an account fixture without a predefined ID.
 *
 * The fixture links to the default user, uses the issuer
 * `github`, and has the account ID `fresh-bot`. The code
 * generates the ID at creation.
 */
const FRESH_ACCOUNT = Account.create({
  issuer: "github",
  providerId: "github",
  accountId: "fresh-bot",
  userId: EntityId.create(ID.USER.DEFAULT),
});

/**
 * Represents the entity ID of the default account fixture.
 */
const ACCOUNT_ID = ID.ACCOUNT.DEFAULT;

/**
 * Represents the entity ID of the alternative account fixture.
 */
const OTHER_ACCOUNT_ID = ID.ACCOUNT.OTHER;

/**
 * Represents the entity ID of the default user fixture.
 */
const USER_ID = ID.USER.DEFAULT;

/**
 * Represents the entity ID of the alternative user fixture.
 */
const OTHER_USER_ID = ID.USER.OTHER;

export {
  ACCOUNT,
  ACCOUNT_ID,
  FRESH_ACCOUNT,
  OTHER_ACCOUNT,
  OTHER_ACCOUNT_ID,
  OTHER_USER_ID,
  UPDATED_ACCOUNT,
  USER_ID,
};

/**
 * Creates an in-memory implementation of the {@link IAccount}
 * repository interface.
 *
 * The repository stores {@link Account} instances in memory
 * and supports lookup by ID, by issuer and account ID, and
 * by user ID. Use this factory in unit tests that need a
 * persistent but isolated account store.
 *
 * @returns A fresh {@link IAccount} instance backed by memory.
 */
export function createInMemoryAccountRepository(): IAccount {
  const BASE = createInMemoryRepository<Awaited<ReturnType<IAccount["save"]>>>({
    extractId: (a) => a.id,
  });

  return {
    findById: (id) => BASE.findById(id),
    async findByIssuerAndAccountId(issuer, accountId) {
      return BASE.findOne(
        (a) => a.issuer === issuer && a.accountId === accountId,
      );
    },
    async findAllByUserId(userId) {
      return BASE.match((a) => a.userId === userId);
    },
    save: (account) => BASE.save(account),
    delete: (id) => BASE.delete(id),
  };
}
