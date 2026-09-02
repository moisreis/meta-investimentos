import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  ACCOUNT,
  ACCOUNT_ID,
  FRESH_ACCOUNT,
  newAccountRepository,
  OTHER_ACCOUNT,
  OTHER_USER_ID,
  seedAccounts,
  seedThirdAccount,
  THIRD_ACCOUNT,
  UPDATED_ACCOUNT,
  USER_ID,
} from "@/__tests__/__helpers__/repositories/_user.test.helper";
import {
  closeDatabase,
  resetDatabase,
} from "@/__tests__/__setup__/_database.setup";
import { EntityId } from "@/business/value-objects/entity-id.vo";

describe("AccountRepository", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe("findById", () => {
    it("returns the persisted account", async () => {
      await seedAccounts();

      const FOUND = await newAccountRepository().findById(
        EntityId.create(ACCOUNT_ID),
      );

      expect(FOUND?.equals(ACCOUNT)).toBe(true);
    });

    it("returns null when the account does not exist", async () => {
      expect(
        await newAccountRepository().findById(EntityId.create(ACCOUNT_ID)),
      ).toBeNull();
    });
  });

  describe("findByIssuerAndAccountId", () => {
    it("returns the persisted account", async () => {
      await seedAccounts();

      const FOUND = await newAccountRepository().findByIssuerAndAccountId(
        ACCOUNT.issuer,
        ACCOUNT.accountId,
      );

      expect(FOUND?.equals(ACCOUNT)).toBe(true);
    });

    it("returns null when no account matches the pair", async () => {
      await seedAccounts();

      const FOUND = await newAccountRepository().findByIssuerAndAccountId(
        ACCOUNT.issuer,
        "unknown-account",
      );

      expect(FOUND).toBeNull();
    });
  });

  describe("findAllByUserId", () => {
    it("returns all accounts of the user", async () => {
      await seedAccounts();
      await seedThirdAccount();

      const FOUND = await newAccountRepository().findAllByUserId(
        EntityId.create(USER_ID),
      );

      expect(FOUND).toHaveLength(2);
      expect(FOUND.some((ROW) => ROW.equals(ACCOUNT))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(THIRD_ACCOUNT))).toBe(true);
    });

    it("returns an empty array when no accounts exist", async () => {
      expect(
        await newAccountRepository().findAllByUserId(EntityId.create(USER_ID)),
      ).toEqual([]);
    });
  });

  describe("findAllByUserIds", () => {
    it("returns the accounts of all the provided users", async () => {
      await seedAccounts();

      const FOUND = await newAccountRepository().findAllByUserIds([
        EntityId.create(USER_ID),
        EntityId.create(OTHER_USER_ID),
      ]);

      expect(FOUND).toHaveLength(2);
      expect(FOUND.some((ROW) => ROW.equals(ACCOUNT))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(OTHER_ACCOUNT))).toBe(true);
    });

    it("returns an empty array when no ids are provided", async () => {
      expect(await newAccountRepository().findAllByUserIds([])).toEqual([]);
    });
  });

  describe("save", () => {
    it("persists a new account", async () => {
      await seedAccounts();

      const SAVED = await newAccountRepository().save(FRESH_ACCOUNT);

      expect(SAVED.id).toBeDefined();
      expect(SAVED.accountId).toBe(FRESH_ACCOUNT.accountId);
      expect(
        (
          await newAccountRepository().findById(
            EntityId.create(SAVED.id as string),
          )
        )?.equals(SAVED),
      ).toBe(true);
    });

    it("updates an existing account", async () => {
      await seedAccounts();

      await newAccountRepository().save(UPDATED_ACCOUNT);

      const FOUND = await newAccountRepository().findById(
        EntityId.create(ACCOUNT_ID),
      );

      expect(FOUND?.accountId).toBe(UPDATED_ACCOUNT.accountId);
      expect(FOUND?.equals(UPDATED_ACCOUNT)).toBe(true);
    });
  });

  describe("delete", () => {
    it("removes the persisted account", async () => {
      await seedAccounts();

      await newAccountRepository().delete(EntityId.create(ACCOUNT_ID));

      expect(
        await newAccountRepository().findById(EntityId.create(ACCOUNT_ID)),
      ).toBeNull();
    });
  });
});
