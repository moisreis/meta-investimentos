import { beforeEach, describe, expect, it } from "vitest";

import {
  BANK,
  BANK_ID,
  createInMemoryBankRepository,
  UPDATED_BANK,
} from "@/__tests__/__helpers__/interfaces/_bank.test.helper";

import type { IBank } from "@/business/interfaces/bank/bank.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";

describe("IBank", () => {
  let REPOSITORY: IBank;

  beforeEach(() => {
    REPOSITORY = createInMemoryBankRepository();
  });

  describe("findById", () => {
    it("returns the persisted bank", async () => {
      await REPOSITORY.save(BANK);

      const FOUND = await REPOSITORY.findById(EntityId.create(BANK_ID));

      expect(FOUND?.equals(BANK)).toBe(true);
    });

    it("returns null when the bank does not exist", async () => {
      expect(await REPOSITORY.findById(EntityId.create(BANK_ID))).toBeNull();
    });
  });

  describe("findByCode", () => {
    it("returns the persisted bank matching the code", async () => {
      await REPOSITORY.save(BANK);

      const FOUND = await REPOSITORY.findByCode("001");

      expect(FOUND?.equals(BANK)).toBe(true);
    });

    it("returns null when the bank does not exist", async () => {
      expect(await REPOSITORY.findByCode("001")).toBeNull();
    });
  });

  describe("save", () => {
    it("persists a new bank", async () => {
      await REPOSITORY.save(BANK);

      const FOUND = await REPOSITORY.findById(EntityId.create(BANK_ID));

      expect(FOUND?.equals(BANK)).toBe(true);
    });

    it("updates an existing bank", async () => {
      await REPOSITORY.save(BANK);

      await REPOSITORY.save(UPDATED_BANK);

      const FOUND = await REPOSITORY.findById(EntityId.create(BANK_ID));

      expect(FOUND?.equals(BANK)).toBe(true);
      expect(FOUND?.name).toBe("Banco do Brasil S.A.");
    });
  });

  describe("delete", () => {
    it("removes the persisted bank", async () => {
      await REPOSITORY.save(BANK);

      await REPOSITORY.delete(EntityId.create(BANK_ID));

      expect(await REPOSITORY.findById(EntityId.create(BANK_ID))).toBeNull();
    });
  });
});
