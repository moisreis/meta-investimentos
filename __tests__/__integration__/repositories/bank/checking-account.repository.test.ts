import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  BANK_ACCOUNT_ID,
  CHECKING_ACCOUNT,
  CHECKING_ACCOUNT_ID,
  EXTERNAL_CHECKING_ACCOUNT,
  FEBRUARY_DATE,
  FRESH_CHECKING_ACCOUNT,
  JANUARY_DATE,
  JANUARY_DUPLICATE_DATE,
  newCheckingAccountRepository,
  OTHER_BANK_ACCOUNT_ID,
  OTHER_CHECKING_ACCOUNT,
  PERIOD_OUTSIDE_ACCOUNT,
  seedAllCheckingAccounts,
  seedCheckingAccounts,
  UPDATED_CHECKING_ACCOUNT,
} from "@/__tests__/__helpers__/repositories/_bank.test.helper";
import {
  closeDatabase,
  resetDatabase,
} from "@/__tests__/__setup__/_database.setup";
import { EntityId } from "@/business/value-objects/entity-id.vo";

describe("CheckingAccountRepository", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe("findById", () => {
    it("returns the persisted balance", async () => {
      await seedCheckingAccounts();

      const FOUND = await newCheckingAccountRepository().findById(
        EntityId.create(CHECKING_ACCOUNT_ID),
      );

      expect(FOUND?.equals(CHECKING_ACCOUNT)).toBe(true);
    });

    it("returns null when the balance does not exist", async () => {
      expect(
        await newCheckingAccountRepository().findById(
          EntityId.create(CHECKING_ACCOUNT_ID),
        ),
      ).toBeNull();
    });
  });

  describe("findAllByBankAccountId", () => {
    it("returns the whole balance series of the bank account", async () => {
      await seedAllCheckingAccounts();

      const FOUND = await newCheckingAccountRepository().findAllByBankAccountId(
        EntityId.create(BANK_ACCOUNT_ID),
      );

      expect(FOUND).toHaveLength(3);
      expect(FOUND.some((ROW) => ROW.equals(CHECKING_ACCOUNT))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(EXTERNAL_CHECKING_ACCOUNT))).toBe(
        true,
      );
      expect(FOUND.some((ROW) => ROW.equals(PERIOD_OUTSIDE_ACCOUNT))).toBe(
        true,
      );
    });

    it("returns an empty array when no balances exist", async () => {
      expect(
        await newCheckingAccountRepository().findAllByBankAccountId(
          EntityId.create(BANK_ACCOUNT_ID),
        ),
      ).toEqual([]);
    });
  });

  describe("findAllByBankAccountIds", () => {
    it("returns the series of all the provided bank accounts", async () => {
      await seedAllCheckingAccounts();

      const FOUND =
        await newCheckingAccountRepository().findAllByBankAccountIds([
          EntityId.create(BANK_ACCOUNT_ID),
          EntityId.create(OTHER_BANK_ACCOUNT_ID),
        ]);

      expect(FOUND).toHaveLength(4);
      expect(FOUND.some((ROW) => ROW.equals(CHECKING_ACCOUNT))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(OTHER_CHECKING_ACCOUNT))).toBe(
        true,
      );
    });

    it("returns an empty array when no ids are provided", async () => {
      expect(
        await newCheckingAccountRepository().findAllByBankAccountIds([]),
      ).toEqual([]);
    });
  });

  describe("findAllByBankAccountIdsInPeriod", () => {
    it("returns only the balances within the period, inclusive", async () => {
      await seedAllCheckingAccounts();

      const FOUND =
        await newCheckingAccountRepository().findAllByBankAccountIdsInPeriod(
          [
            EntityId.create(BANK_ACCOUNT_ID),
            EntityId.create(OTHER_BANK_ACCOUNT_ID),
          ],
          JANUARY_DATE,
          JANUARY_DUPLICATE_DATE,
        );

      expect(FOUND).toHaveLength(2);
      expect(FOUND.some((ROW) => ROW.equals(CHECKING_ACCOUNT))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(EXTERNAL_CHECKING_ACCOUNT))).toBe(
        true,
      );
      expect(FOUND.some((ROW) => ROW.equals(PERIOD_OUTSIDE_ACCOUNT))).toBe(
        false,
      );
      expect(FOUND.some((ROW) => ROW.equals(OTHER_CHECKING_ACCOUNT))).toBe(
        false,
      );
    });

    it("returns an empty array when no ids are provided", async () => {
      expect(
        await newCheckingAccountRepository().findAllByBankAccountIdsInPeriod(
          [],
          JANUARY_DATE,
          FEBRUARY_DATE,
        ),
      ).toEqual([]);
    });
  });

  describe("findByBankAccountIdAndDate", () => {
    it("returns the balance of the bank account on the date", async () => {
      await seedCheckingAccounts();

      const FOUND =
        await newCheckingAccountRepository().findByBankAccountIdAndDate(
          EntityId.create(BANK_ACCOUNT_ID),
          JANUARY_DATE,
        );

      expect(FOUND?.equals(CHECKING_ACCOUNT)).toBe(true);
    });

    it("returns null when the bank account has no balance on the date", async () => {
      await seedCheckingAccounts();

      const FOUND =
        await newCheckingAccountRepository().findByBankAccountIdAndDate(
          EntityId.create(BANK_ACCOUNT_ID),
          FEBRUARY_DATE,
        );

      expect(FOUND).toBeNull();
    });
  });

  describe("save", () => {
    it("persists a new balance", async () => {
      await seedCheckingAccounts();

      const SAVED = await newCheckingAccountRepository().save(
        FRESH_CHECKING_ACCOUNT,
      );

      expect(SAVED.id).toBeDefined();
      expect(SAVED.value.value.toString()).toBe(
        FRESH_CHECKING_ACCOUNT.value.value.toString(),
      );
      expect(
        (
          await newCheckingAccountRepository().findById(
            EntityId.create(SAVED.id as string),
          )
        )?.equals(SAVED),
      ).toBe(true);
    });

    it("updates an existing balance", async () => {
      await seedCheckingAccounts();

      await newCheckingAccountRepository().save(UPDATED_CHECKING_ACCOUNT);

      const FOUND = await newCheckingAccountRepository().findById(
        EntityId.create(CHECKING_ACCOUNT_ID),
      );

      expect(FOUND?.value.value.toString()).toBe(
        UPDATED_CHECKING_ACCOUNT.value.value.toString(),
      );
      expect(FOUND?.equals(UPDATED_CHECKING_ACCOUNT)).toBe(true);
    });
  });

  describe("delete", () => {
    it("removes the persisted balance", async () => {
      await seedCheckingAccounts();

      await newCheckingAccountRepository().delete(
        EntityId.create(CHECKING_ACCOUNT_ID),
      );

      expect(
        await newCheckingAccountRepository().findById(
          EntityId.create(CHECKING_ACCOUNT_ID),
        ),
      ).toBeNull();
    });
  });
});
