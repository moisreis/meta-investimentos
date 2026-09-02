import { beforeEach, describe, expect, it } from "vitest";

import {
  BANK_ACCOUNT,
  BANK_ACCOUNT_ID,
  BANK_ID,
  createInMemoryBankAccountRepository,
  PORTFOLIO_ID,
  PROPS,
  UPDATED_BANK_ACCOUNT,
} from "@/__tests__/__helpers__/interfaces/_bank-account.test.helper";

import { BankAccount } from "@/business/entities/bank/bank-account.entity";
import type { IBankAccount } from "@/business/interfaces/bank/bank-account.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";

describe("IBankAccount", () => {
  let REPOSITORY: IBankAccount;

  beforeEach(() => {
    REPOSITORY = createInMemoryBankAccountRepository();
  });

  describe("findById", () => {
    it("returns the persisted bank account", async () => {
      await REPOSITORY.save(BANK_ACCOUNT);

      const FOUND = await REPOSITORY.findById(EntityId.create(BANK_ACCOUNT_ID));

      expect(FOUND?.equals(BANK_ACCOUNT)).toBe(true);
    });

    it("returns null when the bank account does not exist", async () => {
      expect(
        await REPOSITORY.findById(EntityId.create(BANK_ACCOUNT_ID)),
      ).toBeNull();
    });
  });

  describe("findAllByPortfolioId", () => {
    it("returns all bank accounts matching the portfolio id", async () => {
      const OTHER = BankAccount.create(
        { ...PROPS, accountNumber: "99999-0" },
        "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d",
      );

      await REPOSITORY.save(BANK_ACCOUNT);
      await REPOSITORY.save(OTHER);

      const FOUND = await REPOSITORY.findAllByPortfolioId(
        EntityId.create(PORTFOLIO_ID),
      );

      expect(FOUND).toHaveLength(2);
      expect(FOUND[0]?.equals(BANK_ACCOUNT)).toBe(true);
      expect(FOUND[1]?.equals(OTHER)).toBe(true);
    });

    it("returns an empty array when there are no matches", async () => {
      expect(
        await REPOSITORY.findAllByPortfolioId(EntityId.create(PORTFOLIO_ID)),
      ).toEqual([]);
    });
  });

  describe("findAllByBankId", () => {
    it("returns all bank accounts matching the bank id", async () => {
      const OTHER = BankAccount.create(
        { ...PROPS, accountNumber: "99999-0" },
        "f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d",
      );

      await REPOSITORY.save(BANK_ACCOUNT);
      await REPOSITORY.save(OTHER);

      const FOUND = await REPOSITORY.findAllByBankId(EntityId.create(BANK_ID));

      expect(FOUND).toHaveLength(2);
      expect(FOUND[0]?.equals(BANK_ACCOUNT)).toBe(true);
      expect(FOUND[1]?.equals(OTHER)).toBe(true);
    });

    it("returns an empty array when there are no matches", async () => {
      expect(
        await REPOSITORY.findAllByBankId(EntityId.create(BANK_ID)),
      ).toEqual([]);
    });
  });

  describe("save", () => {
    it("persists a new bank account", async () => {
      await REPOSITORY.save(BANK_ACCOUNT);

      const FOUND = await REPOSITORY.findById(EntityId.create(BANK_ACCOUNT_ID));

      expect(FOUND?.equals(BANK_ACCOUNT)).toBe(true);
    });

    it("updates an existing bank account", async () => {
      await REPOSITORY.save(BANK_ACCOUNT);

      await REPOSITORY.save(UPDATED_BANK_ACCOUNT);

      const FOUND = await REPOSITORY.findById(EntityId.create(BANK_ACCOUNT_ID));

      expect(FOUND?.equals(BANK_ACCOUNT)).toBe(true);
      expect(FOUND?.accountNumber).toBe("54321-0");
    });
  });

  describe("delete", () => {
    it("removes the persisted bank account", async () => {
      await REPOSITORY.save(BANK_ACCOUNT);

      await REPOSITORY.delete(EntityId.create(BANK_ACCOUNT_ID));

      expect(
        await REPOSITORY.findById(EntityId.create(BANK_ACCOUNT_ID)),
      ).toBeNull();
    });
  });
});
