import { beforeEach, describe, expect, it } from "vitest";

import {
  ACCOUNT,
  ACCOUNT_ID,
  createInMemoryAccountRepository,
  OTHER_ACCOUNT,
  OTHER_USER_ID,
  USER_ID,
} from "@/__tests__/__helpers__/interfaces/_account.test.helper";

import { Account } from "@/business/entities/user/account.entity";
import type { IAccount } from "@/business/interfaces/user/account.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";

describe("IAccount", () => {
  let REPOSITORY: IAccount;

  beforeEach(() => {
    REPOSITORY = createInMemoryAccountRepository();
  });

  describe("findById", () => {
    it("returns the persisted account", async () => {
      await REPOSITORY.save(ACCOUNT);

      const FOUND = await REPOSITORY.findById(EntityId.create(ACCOUNT_ID));

      expect(FOUND?.equals(ACCOUNT)).toBe(true);
    });

    it("returns null when the account does not exist", async () => {
      expect(await REPOSITORY.findById(EntityId.create(ACCOUNT_ID))).toBeNull();
    });
  });

  describe("findByIssuerAndAccountId", () => {
    it("returns the persisted account", async () => {
      await REPOSITORY.save(ACCOUNT);

      const FOUND = await REPOSITORY.findByIssuerAndAccountId(
        ACCOUNT.issuer,
        ACCOUNT.accountId,
      );

      expect(FOUND?.equals(ACCOUNT)).toBe(true);
    });

    it("returns null when no account matches both the issuer and account id", async () => {
      expect(
        await REPOSITORY.findByIssuerAndAccountId(
          ACCOUNT.issuer,
          ACCOUNT.accountId,
        ),
      ).toBeNull();
    });
  });

  describe("findAllByUserId", () => {
    it("returns all accounts of the persisted user", async () => {
      await REPOSITORY.save(ACCOUNT);
      await REPOSITORY.save(OTHER_ACCOUNT);

      const FIRST = Account.create(
        {
          issuer: "google",
          providerId: "google",
          accountId: "jose",
          userId: EntityId.create(OTHER_USER_ID),
        },
        "2c3d4e5f-6a7b-4c8d-9e0f-1a2b3c4d5e6f",
      );

      await REPOSITORY.save(FIRST);

      const FOUND = await REPOSITORY.findAllByUserId(
        EntityId.create(OTHER_USER_ID),
      );

      expect(FOUND).toHaveLength(2);
      expect(FOUND.some((ROW) => ROW.equals(OTHER_ACCOUNT))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(FIRST))).toBe(true);
    });

    it("returns an empty array when the user has no accounts", async () => {
      expect(
        await REPOSITORY.findAllByUserId(EntityId.create(USER_ID)),
      ).toEqual([]);
    });
  });

  describe("save", () => {
    it("persists a new account", async () => {
      const SAVED = await REPOSITORY.save(ACCOUNT);

      expect(SAVED.equals(ACCOUNT)).toBe(true);
      expect(
        (await REPOSITORY.findById(EntityId.create(ACCOUNT_ID)))?.equals(
          ACCOUNT,
        ),
      ).toBe(true);
    });

    it("updates an existing account", async () => {
      await REPOSITORY.save(ACCOUNT);

      const UPDATED = Account.create(
        {
          issuer: ACCOUNT.issuer,
          providerId: ACCOUNT.providerId,
          accountId: ACCOUNT.accountId,
          userId: ACCOUNT.userId,
          accessToken: "updated-token",
        },
        ACCOUNT_ID,
      );

      await REPOSITORY.save(UPDATED);

      const FOUND = await REPOSITORY.findById(EntityId.create(ACCOUNT_ID));

      expect(FOUND?.accessToken).toBe("updated-token");
      expect(FOUND?.equals(UPDATED)).toBe(true);
    });
  });

  describe("delete", () => {
    it("removes the persisted account", async () => {
      await REPOSITORY.save(ACCOUNT);

      await REPOSITORY.delete(EntityId.create(ACCOUNT_ID));

      expect(await REPOSITORY.findById(EntityId.create(ACCOUNT_ID))).toBeNull();
    });
  });
});
