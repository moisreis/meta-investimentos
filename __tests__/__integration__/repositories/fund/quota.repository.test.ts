import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  EXTERNAL_QUOTA,
  FEBRUARY_QUOTA_DATE,
  FRESH_QUOTA,
  FUND_ID,
  newQuotaRepository,
  OTHER_FUND_ID,
  OTHER_QUOTA,
  PERIOD_OUTSIDE_QUOTA,
  QUOTA,
  QUOTA_DATE,
  QUOTA_DUPLICATE_DATE,
  QUOTA_ID,
  seedAllQuotas,
  seedQuotas,
  UPDATED_QUOTA,
} from "@/__tests__/__helpers__/repositories/_fund.test.helper";
import {
  closeDatabase,
  resetDatabase,
} from "@/__tests__/__setup__/_database.setup";
import { EntityId } from "@/business/value-objects/entity-id.vo";

describe("QuotaRepository", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe("findById", () => {
    it("returns the persisted quota", async () => {
      await seedQuotas();

      const FOUND = await newQuotaRepository().findById(
        EntityId.create(QUOTA_ID),
      );

      expect(FOUND?.equals(QUOTA)).toBe(true);
    });

    it("returns null when the quota does not exist", async () => {
      expect(
        await newQuotaRepository().findById(EntityId.create(QUOTA_ID)),
      ).toBeNull();
    });
  });

  describe("findAllByFundId", () => {
    it("returns the whole quota series of the fund", async () => {
      await seedAllQuotas();

      const FOUND = await newQuotaRepository().findAllByFundId(
        EntityId.create(FUND_ID),
      );

      expect(FOUND).toHaveLength(3);
      expect(FOUND.some((ROW) => ROW.equals(QUOTA))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(EXTERNAL_QUOTA))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(PERIOD_OUTSIDE_QUOTA))).toBe(true);
    });

    it("returns an empty array when no quotas exist", async () => {
      expect(
        await newQuotaRepository().findAllByFundId(EntityId.create(FUND_ID)),
      ).toEqual([]);
    });
  });

  describe("findAllByFundIds", () => {
    it("returns the series of all the provided funds", async () => {
      await seedAllQuotas();

      const FOUND = await newQuotaRepository().findAllByFundIds([
        EntityId.create(FUND_ID),
        EntityId.create(OTHER_FUND_ID),
      ]);

      expect(FOUND).toHaveLength(4);
      expect(FOUND.some((ROW) => ROW.equals(QUOTA))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(OTHER_QUOTA))).toBe(true);
    });

    it("returns an empty array when no ids are provided", async () => {
      expect(await newQuotaRepository().findAllByFundIds([])).toEqual([]);
    });
  });

  describe("findByFundIdAndDate", () => {
    it("returns the quota of the fund on the date", async () => {
      await seedQuotas();

      const FOUND = await newQuotaRepository().findByFundIdAndDate(
        EntityId.create(FUND_ID),
        QUOTA_DATE,
      );

      expect(FOUND?.equals(QUOTA)).toBe(true);
    });

    it("returns null when the fund has no quota on the date", async () => {
      await seedQuotas();

      const FOUND = await newQuotaRepository().findByFundIdAndDate(
        EntityId.create(FUND_ID),
        FEBRUARY_QUOTA_DATE,
      );

      expect(FOUND).toBeNull();
    });
  });

  describe("findAllByFundIdsInPeriod", () => {
    it("returns only the quotas within the period, inclusive", async () => {
      await seedAllQuotas();

      const FOUND = await newQuotaRepository().findAllByFundIdsInPeriod(
        [EntityId.create(FUND_ID), EntityId.create(OTHER_FUND_ID)],
        QUOTA_DATE,
        QUOTA_DUPLICATE_DATE,
      );

      expect(FOUND).toHaveLength(2);
      expect(FOUND.some((ROW) => ROW.equals(QUOTA))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(EXTERNAL_QUOTA))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(PERIOD_OUTSIDE_QUOTA))).toBe(false);
      expect(FOUND.some((ROW) => ROW.equals(OTHER_QUOTA))).toBe(false);
    });

    it("returns an empty array when no ids are provided", async () => {
      expect(
        await newQuotaRepository().findAllByFundIdsInPeriod(
          [],
          QUOTA_DATE,
          FEBRUARY_QUOTA_DATE,
        ),
      ).toEqual([]);
    });
  });

  describe("findLatestByFundId", () => {
    it("returns the quota with the most recent date", async () => {
      await seedAllQuotas();

      const FOUND = await newQuotaRepository().findLatestByFundId(
        EntityId.create(FUND_ID),
      );

      expect(FOUND?.equals(PERIOD_OUTSIDE_QUOTA)).toBe(true);
    });

    it("returns null when the fund has no quotas", async () => {
      expect(
        await newQuotaRepository().findLatestByFundId(EntityId.create(FUND_ID)),
      ).toBeNull();
    });
  });

  describe("findLatestByFundIds", () => {
    it("returns the latest quota per provided fund", async () => {
      await seedAllQuotas();

      const FOUND = await newQuotaRepository().findLatestByFundIds([
        EntityId.create(FUND_ID),
        EntityId.create(OTHER_FUND_ID),
      ]);

      expect(FOUND).toHaveLength(2);
      expect(FOUND.some((ROW) => ROW.equals(PERIOD_OUTSIDE_QUOTA))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(OTHER_QUOTA))).toBe(true);
    });

    it("returns an empty array when no ids are provided", async () => {
      expect(await newQuotaRepository().findLatestByFundIds([])).toEqual([]);
    });
  });

  describe("save", () => {
    it("persists a new quota", async () => {
      await seedQuotas();

      const SAVED = await newQuotaRepository().save(FRESH_QUOTA);

      expect(SAVED.id).toBeDefined();
      expect(SAVED.price.value.toString()).toBe(
        FRESH_QUOTA.price.value.toString(),
      );
      expect(
        (
          await newQuotaRepository().findById(
            EntityId.create(SAVED.id as string),
          )
        )?.equals(SAVED),
      ).toBe(true);
    });

    it("updates an existing quota", async () => {
      await seedQuotas();

      await newQuotaRepository().save(UPDATED_QUOTA);

      const FOUND = await newQuotaRepository().findById(
        EntityId.create(QUOTA_ID),
      );

      expect(FOUND?.price.value.toString()).toBe(
        UPDATED_QUOTA.price.value.toString(),
      );
      expect(FOUND?.equals(UPDATED_QUOTA)).toBe(true);
    });
  });

  describe("delete", () => {
    it("removes the persisted quota", async () => {
      await seedQuotas();

      await newQuotaRepository().delete(EntityId.create(QUOTA_ID));

      expect(
        await newQuotaRepository().findById(EntityId.create(QUOTA_ID)),
      ).toBeNull();
    });
  });
});
