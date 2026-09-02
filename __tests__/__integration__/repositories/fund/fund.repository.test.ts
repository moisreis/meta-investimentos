import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  BANK_ID,
  BENCHMARK_ID,
  CATEGORY_ID,
  FRESH_FUND,
  FUND,
  FUND_ID,
  newFundRepository,
  OTHER_BANK_ID,
  OTHER_FUND,
  OTHER_FUND_ID,
  seedFundFixtureParents,
  seedFunds,
  UPDATED_FUND,
} from "@/__tests__/__helpers__/repositories/_fund.test.helper";
import {
  closeDatabase,
  resetDatabase,
} from "@/__tests__/__setup__/_database.setup";
import { EntityId } from "@/business/value-objects/entity-id.vo";

describe("FundRepository", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe("findById", () => {
    it("returns the persisted fund", async () => {
      await seedFunds();

      const FOUND = await newFundRepository().findById(
        EntityId.create(FUND_ID),
      );

      expect(FOUND?.equals(FUND)).toBe(true);
    });

    it("returns null when the fund does not exist", async () => {
      expect(
        await newFundRepository().findById(EntityId.create(FUND_ID)),
      ).toBeNull();
    });
  });

  describe("findAllByIds", () => {
    it("returns all funds with the provided ids", async () => {
      await seedFunds();

      const FOUND = await newFundRepository().findAllByIds([
        EntityId.create(FUND_ID),
        EntityId.create(OTHER_FUND_ID),
      ]);

      expect(FOUND).toHaveLength(2);
      expect(FOUND.some((ROW) => ROW.equals(FUND))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(OTHER_FUND))).toBe(true);
    });

    it("returns an empty array when no ids are provided", async () => {
      expect(await newFundRepository().findAllByIds([])).toEqual([]);
    });
  });

  describe("findByCnpj", () => {
    it("returns the fund with the cnpj", async () => {
      await seedFunds();

      const FOUND = await newFundRepository().findByCnpj(FUND.cnpj.value);

      expect(FOUND?.equals(FUND)).toBe(true);
    });

    it("returns null when no fund has the cnpj", async () => {
      expect(await newFundRepository().findByCnpj(FUND.cnpj.value)).toBeNull();
    });
  });

  describe("findAllByBankId", () => {
    it("returns the funds issued by the bank", async () => {
      await seedFunds();

      const FOUND = await newFundRepository().findAllByBankId(
        EntityId.create(BANK_ID),
      );

      expect(FOUND).toHaveLength(1);
      expect(FOUND[0]?.equals(FUND)).toBe(true);
    });

    it("returns only the funds of the second bank", async () => {
      await seedFunds();

      const FOUND = await newFundRepository().findAllByBankId(
        EntityId.create(OTHER_BANK_ID),
      );

      expect(FOUND).toHaveLength(1);
      expect(FOUND[0]?.equals(OTHER_FUND)).toBe(true);
    });
  });

  describe("findAllByBenchmarkId", () => {
    it("returns the funds benchmarked against the benchmark", async () => {
      await seedFunds();

      const FOUND = await newFundRepository().findAllByBenchmarkId(
        EntityId.create(BENCHMARK_ID),
      );

      expect(FOUND).toHaveLength(1);
      expect(FOUND[0]?.equals(FUND)).toBe(true);
    });
  });

  describe("findAllByCategoryId", () => {
    it("returns the funds tagged with the category", async () => {
      await seedFunds();

      const FOUND = await newFundRepository().findAllByCategoryId(
        EntityId.create(CATEGORY_ID),
      );

      expect(FOUND).toHaveLength(1);
      expect(FOUND[0]?.equals(FUND)).toBe(true);
    });
  });

  describe("save", () => {
    it("persists a new fund", async () => {
      await seedFundFixtureParents();

      const SAVED = await newFundRepository().save(FRESH_FUND);

      expect(SAVED.id).toBeDefined();
      expect(SAVED.name).toBe(FRESH_FUND.name);
      expect(
        (
          await newFundRepository().findById(
            EntityId.create(SAVED.id as string),
          )
        )?.equals(SAVED),
      ).toBe(true);
    });

    it("updates an existing fund", async () => {
      await seedFunds();

      await newFundRepository().save(UPDATED_FUND);

      const FOUND = await newFundRepository().findById(
        EntityId.create(FUND_ID),
      );

      expect(FOUND?.name).toBe(UPDATED_FUND.name);
      expect(FOUND?.administrationFee?.value.toString()).toBe(
        UPDATED_FUND.administrationFee?.value.toString(),
      );
      expect(FOUND?.equals(UPDATED_FUND)).toBe(true);
    });
  });

  describe("delete", () => {
    it("removes the persisted fund", async () => {
      await seedFunds();

      await newFundRepository().delete(EntityId.create(FUND_ID));

      expect(
        await newFundRepository().findById(EntityId.create(FUND_ID)),
      ).toBeNull();
    });
  });
});
