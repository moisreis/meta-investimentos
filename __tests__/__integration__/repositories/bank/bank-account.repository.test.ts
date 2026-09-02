import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  BANK_ACCOUNT,
  BANK_ACCOUNT_ID,
  BANK_ID,
  FRESH_BANK_ACCOUNT,
  newBankAccountRepository,
  OTHER_BANK_ACCOUNT,
  OTHER_BANK_ID,
  OTHER_PORTFOLIO_ID,
  PORTFOLIO_ID,
  seedBankAccounts,
  seedThirdBankAccount,
  THIRD_BANK_ACCOUNT,
  UPDATED_BANK_ACCOUNT,
} from "@/__tests__/__helpers__/repositories/_bank.test.helper";
import {
  closeDatabase,
  resetDatabase,
} from "@/__tests__/__setup__/_database.setup";
import { EntityId } from "@/business/value-objects/entity-id.vo";

describe("BankAccountRepository", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe("findById", () => {
    it("returns the persisted bank account", async () => {
      await seedBankAccounts();

      const FOUND = await newBankAccountRepository().findById(
        EntityId.create(BANK_ACCOUNT_ID),
      );

      expect(FOUND?.equals(BANK_ACCOUNT)).toBe(true);
    });

    it("returns null when the bank account does not exist", async () => {
      expect(
        await newBankAccountRepository().findById(
          EntityId.create(BANK_ACCOUNT_ID),
        ),
      ).toBeNull();
    });
  });

  describe("findAllByPortfolioId", () => {
    it("returns all bank accounts of the portfolio", async () => {
      await seedBankAccounts();
      await seedThirdBankAccount();

      const FOUND = await newBankAccountRepository().findAllByPortfolioId(
        EntityId.create(PORTFOLIO_ID),
      );

      expect(FOUND).toHaveLength(2);
      expect(FOUND.some((ROW) => ROW.equals(BANK_ACCOUNT))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(THIRD_BANK_ACCOUNT))).toBe(true);
    });

    it("returns an empty array when no accounts exist", async () => {
      expect(
        await newBankAccountRepository().findAllByPortfolioId(
          EntityId.create(PORTFOLIO_ID),
        ),
      ).toEqual([]);
    });
  });

  describe("findAllByPortfolioIds", () => {
    it("returns the bank accounts of all the provided portfolios", async () => {
      await seedBankAccounts();

      const FOUND = await newBankAccountRepository().findAllByPortfolioIds([
        EntityId.create(PORTFOLIO_ID),
        EntityId.create(OTHER_PORTFOLIO_ID),
      ]);

      expect(FOUND).toHaveLength(2);
      expect(FOUND.some((ROW) => ROW.equals(BANK_ACCOUNT))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(OTHER_BANK_ACCOUNT))).toBe(true);
    });

    it("returns an empty array when no ids are provided", async () => {
      expect(
        await newBankAccountRepository().findAllByPortfolioIds([]),
      ).toEqual([]);
    });
  });

  describe("findAllByBankId", () => {
    it("returns all bank accounts of the bank", async () => {
      await seedBankAccounts();
      await seedThirdBankAccount();

      const FOUND = await newBankAccountRepository().findAllByBankId(
        EntityId.create(BANK_ID),
      );

      expect(FOUND).toHaveLength(1);
      expect(FOUND[0]?.equals(BANK_ACCOUNT)).toBe(true);
    });
  });

  describe("findAllByBankIds", () => {
    it("returns the bank accounts of all the provided banks", async () => {
      await seedBankAccounts();

      const FOUND = await newBankAccountRepository().findAllByBankIds([
        EntityId.create(BANK_ID),
        EntityId.create(OTHER_BANK_ID),
      ]);

      expect(FOUND).toHaveLength(2);
      expect(FOUND.some((ROW) => ROW.equals(BANK_ACCOUNT))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(OTHER_BANK_ACCOUNT))).toBe(true);
    });

    it("returns an empty array when no ids are provided", async () => {
      expect(await newBankAccountRepository().findAllByBankIds([])).toEqual([]);
    });
  });

  describe("save", () => {
    it("persists a new bank account", async () => {
      await seedBankAccounts();

      const SAVED = await newBankAccountRepository().save(FRESH_BANK_ACCOUNT);

      expect(SAVED.id).toBeDefined();
      expect(SAVED.accountNumber).toBe(FRESH_BANK_ACCOUNT.accountNumber);
      expect(
        (
          await newBankAccountRepository().findById(
            EntityId.create(SAVED.id as string),
          )
        )?.equals(SAVED),
      ).toBe(true);
    });

    it("updates an existing bank account", async () => {
      await seedBankAccounts();

      await newBankAccountRepository().save(UPDATED_BANK_ACCOUNT);

      const FOUND = await newBankAccountRepository().findById(
        EntityId.create(BANK_ACCOUNT_ID),
      );

      expect(FOUND?.accountNumber).toBe(UPDATED_BANK_ACCOUNT.accountNumber);
      expect(FOUND?.equals(UPDATED_BANK_ACCOUNT)).toBe(true);
    });
  });

  describe("delete", () => {
    it("removes the persisted bank account", async () => {
      await seedBankAccounts();

      await newBankAccountRepository().delete(EntityId.create(BANK_ACCOUNT_ID));

      expect(
        await newBankAccountRepository().findById(
          EntityId.create(BANK_ACCOUNT_ID),
        ),
      ).toBeNull();
    });
  });
});
