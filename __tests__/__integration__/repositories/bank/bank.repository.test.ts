import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  BANK,
  BANK_ID,
  FRESH_BANK,
  newBankRepository,
  OTHER_BANK,
  OTHER_BANK_ID,
  seedBanks,
  UPDATED_BANK,
} from "@/__tests__/__helpers__/repositories/_bank.test.helper";
import {
  closeDatabase,
  resetDatabase,
} from "@/__tests__/__setup__/_database.setup";

describe("BankRepository", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe("findById", () => {
    it("returns the persisted bank", async () => {
      await seedBanks();

      const FOUND = await newBankRepository().findById(BANK_ID);

      expect(FOUND?.equals(BANK)).toBe(true);
    });

    it("returns null when the bank does not exist", async () => {
      expect(await newBankRepository().findById(BANK_ID)).toBeNull();
    });
  });

  describe("findByCode", () => {
    it("returns the persisted bank", async () => {
      await seedBanks();

      const FOUND = await newBankRepository().findByCode(BANK.code);

      expect(FOUND?.equals(BANK)).toBe(true);
    });

    it("returns null when no bank has the code", async () => {
      expect(await newBankRepository().findByCode(BANK.code)).toBeNull();
    });
  });

  describe("findAllByIds", () => {
    it("returns all banks with the provided ids", async () => {
      await seedBanks();

      const FOUND = await newBankRepository().findAllByIds([
        BANK_ID,
        OTHER_BANK_ID,
      ]);

      expect(FOUND).toHaveLength(2);
      expect(FOUND.some((ROW) => ROW.equals(BANK))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(OTHER_BANK))).toBe(true);
    });

    it("returns an empty array when no ids are provided", async () => {
      expect(await newBankRepository().findAllByIds([])).toEqual([]);
    });
  });

  describe("save", () => {
    it("persists a new bank", async () => {
      const SAVED = await newBankRepository().save(FRESH_BANK);

      expect(SAVED.id).toBeDefined();
      expect(SAVED.code).toBe(FRESH_BANK.code);
      expect(
        (await newBankRepository().findById(SAVED.id as string))?.equals(SAVED),
      ).toBe(true);
    });

    it("updates an existing bank", async () => {
      await seedBanks();

      await newBankRepository().save(UPDATED_BANK);

      const FOUND = await newBankRepository().findById(BANK_ID);

      expect(FOUND?.name).toBe(UPDATED_BANK.name);
      expect(FOUND?.equals(UPDATED_BANK)).toBe(true);
    });
  });

  describe("delete", () => {
    it("removes the persisted bank", async () => {
      await seedBanks();

      await newBankRepository().delete(BANK_ID);

      expect(await newBankRepository().findById(BANK_ID)).toBeNull();
    });
  });
});
