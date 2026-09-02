import { beforeEach, describe, expect, it } from "vitest";

import {
  BANK_ACCOUNT_ID,
  CHECKING_ACCOUNT,
  CHECKING_ACCOUNT_ID,
  createInMemoryCheckingAccountRepository,
  PROPS,
  UPDATED_CHECKING_ACCOUNT,
} from "@/__tests__/__helpers__/interfaces/_checking-account.test.helper";

import { CheckingAccount } from "@/business/entities/bank/checking-account.entity";
import type { ICheckingAccount } from "@/business/interfaces/bank/checking-account.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { SignedMoney } from "@/business/value-objects/signed-money.vo";

describe("ICheckingAccount", () => {
  let REPOSITORY: ICheckingAccount;

  beforeEach(() => {
    REPOSITORY = createInMemoryCheckingAccountRepository();
  });

  describe("findById", () => {
    it("returns the persisted checking account", async () => {
      await REPOSITORY.save(CHECKING_ACCOUNT);

      const FOUND = await REPOSITORY.findById(
        EntityId.create(CHECKING_ACCOUNT_ID),
      );

      expect(FOUND?.equals(CHECKING_ACCOUNT)).toBe(true);
    });

    it("returns null when the checking account does not exist", async () => {
      expect(
        await REPOSITORY.findById(EntityId.create(CHECKING_ACCOUNT_ID)),
      ).toBeNull();
    });
  });

  describe("findAllByBankAccountId", () => {
    it("returns all checking accounts matching the bank account id", async () => {
      const OTHER = CheckingAccount.create(
        {
          ...PROPS,
          date: new Date("2026-01-02T00:00:00.000Z"),
          value: SignedMoney.create("50.00"),
        },
        "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d",
      );

      await REPOSITORY.save(CHECKING_ACCOUNT);
      await REPOSITORY.save(OTHER);

      const FOUND = await REPOSITORY.findAllByBankAccountId(
        EntityId.create(BANK_ACCOUNT_ID),
      );

      expect(FOUND).toHaveLength(2);
      expect(FOUND[0]?.equals(CHECKING_ACCOUNT)).toBe(true);
      expect(FOUND[1]?.equals(OTHER)).toBe(true);
    });

    it("returns an empty array when there are no matches", async () => {
      expect(
        await REPOSITORY.findAllByBankAccountId(
          EntityId.create(BANK_ACCOUNT_ID),
        ),
      ).toEqual([]);
    });
  });

  describe("findByBankAccountIdAndDate", () => {
    it("returns the persisted checking account matching the date", async () => {
      await REPOSITORY.save(CHECKING_ACCOUNT);

      const FOUND = await REPOSITORY.findByBankAccountIdAndDate(
        EntityId.create(BANK_ACCOUNT_ID),
        new Date("2026-01-05T00:00:00.000Z"),
      );

      expect(FOUND?.equals(CHECKING_ACCOUNT)).toBe(true);
    });

    it("returns null when the checking account does not exist", async () => {
      expect(
        await REPOSITORY.findByBankAccountIdAndDate(
          EntityId.create(BANK_ACCOUNT_ID),
          new Date("2026-01-05T00:00:00.000Z"),
        ),
      ).toBeNull();
    });
  });

  describe("save", () => {
    it("persists a new checking account", async () => {
      await REPOSITORY.save(CHECKING_ACCOUNT);

      const FOUND = await REPOSITORY.findById(
        EntityId.create(CHECKING_ACCOUNT_ID),
      );

      expect(FOUND?.equals(CHECKING_ACCOUNT)).toBe(true);
    });

    it("updates an existing checking account", async () => {
      await REPOSITORY.save(CHECKING_ACCOUNT);

      await REPOSITORY.save(UPDATED_CHECKING_ACCOUNT);

      const FOUND = await REPOSITORY.findById(
        EntityId.create(CHECKING_ACCOUNT_ID),
      );

      expect(FOUND?.equals(CHECKING_ACCOUNT)).toBe(true);
      expect(FOUND?.value.value.toString()).toBe("4321.1");
    });
  });

  describe("delete", () => {
    it("removes the persisted checking account", async () => {
      await REPOSITORY.save(CHECKING_ACCOUNT);

      await REPOSITORY.delete(EntityId.create(CHECKING_ACCOUNT_ID));

      expect(
        await REPOSITORY.findById(EntityId.create(CHECKING_ACCOUNT_ID)),
      ).toBeNull();
    });
  });
});
