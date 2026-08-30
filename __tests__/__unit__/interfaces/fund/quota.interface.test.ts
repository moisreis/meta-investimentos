import { beforeEach, describe, expect, it } from "vitest";

import {
  createInMemoryQuotaRepository,
  EARLIER_QUOTA,
  FUND_ID,
  LATEST_QUOTA,
  QUOTA,
  QUOTA_ID,
} from "@/__tests__/__helpers__/interfaces/_quota.test.helper";

import { Quota } from "@/business/entities/fund/quota.entity";
import type { IQuota } from "@/business/interfaces/fund/quota.interface";
import QuotaPrice from "@/business/value-objects/quota-price.vo";

describe("IQuota", () => {
  let REPOSITORY: IQuota;

  beforeEach(() => {
    REPOSITORY = createInMemoryQuotaRepository();
  });

  describe("findById", () => {
    it("returns the persisted quota", async () => {
      await REPOSITORY.save(QUOTA);

      const FOUND = await REPOSITORY.findById(QUOTA_ID);

      expect(FOUND?.equals(QUOTA)).toBe(true);
    });

    it("returns null when the quota does not exist", async () => {
      expect(await REPOSITORY.findById(QUOTA_ID)).toBeNull();
    });
  });

  describe("findAllByFundId", () => {
    it("returns all quotas for the fund", async () => {
      await REPOSITORY.save(QUOTA);
      await REPOSITORY.save(EARLIER_QUOTA);
      await REPOSITORY.save(LATEST_QUOTA);

      const FOUND = await REPOSITORY.findAllByFundId(FUND_ID);

      expect(FOUND).toHaveLength(3);
      expect(FOUND.some((QUOTA_ROW) => QUOTA_ROW.equals(QUOTA))).toBe(true);
      expect(FOUND.some((QUOTA_ROW) => QUOTA_ROW.equals(EARLIER_QUOTA))).toBe(
        true,
      );
      expect(FOUND.some((QUOTA_ROW) => QUOTA_ROW.equals(LATEST_QUOTA))).toBe(
        true,
      );
    });

    it("returns an empty array when there are no matches", async () => {
      expect(await REPOSITORY.findAllByFundId(FUND_ID)).toEqual([]);
    });
  });

  describe("findByFundIdAndDate", () => {
    it("returns the persisted quota matching the fund and date", async () => {
      await REPOSITORY.save(QUOTA);

      const FOUND = await REPOSITORY.findByFundIdAndDate(
        FUND_ID,
        new Date("2024-01-15T12:00:00.000Z"),
      );

      expect(FOUND?.equals(QUOTA)).toBe(true);
    });

    it("returns null when the quota does not exist", async () => {
      expect(
        await REPOSITORY.findByFundIdAndDate(
          FUND_ID,
          new Date("2024-01-15T12:00:00.000Z"),
        ),
      ).toBeNull();
    });
  });

  describe("findLatestByFundId", () => {
    it("returns the quota with the most recent date", async () => {
      await REPOSITORY.save(QUOTA);
      await REPOSITORY.save(EARLIER_QUOTA);
      await REPOSITORY.save(LATEST_QUOTA);

      const FOUND = await REPOSITORY.findLatestByFundId(FUND_ID);

      expect(FOUND?.equals(LATEST_QUOTA)).toBe(true);
    });

    it("returns null when there are no quotas for the fund", async () => {
      expect(await REPOSITORY.findLatestByFundId(FUND_ID)).toBeNull();
    });
  });

  describe("save", () => {
    it("persists a new quota", async () => {
      await REPOSITORY.save(QUOTA);

      const FOUND = await REPOSITORY.findById(QUOTA_ID);

      expect(FOUND?.equals(QUOTA)).toBe(true);
    });

    it("updates an existing quota", async () => {
      await REPOSITORY.save(QUOTA);

      const UPDATED_QUOTA = Quota.create(
        {
          fundId: FUND_ID,
          date: new Date("2024-01-15T12:00:00.000Z"),
          price: QuotaPrice.create("12.75"),
        },
        QUOTA_ID,
      );

      await REPOSITORY.save(UPDATED_QUOTA);

      const FOUND = await REPOSITORY.findById(QUOTA_ID);

      expect(FOUND?.equals(QUOTA)).toBe(true);
      expect(FOUND?.price.value.toString()).toBe("12.75");
    });
  });

  describe("delete", () => {
    it("removes the persisted quota", async () => {
      await REPOSITORY.save(QUOTA);

      await REPOSITORY.delete(QUOTA_ID);

      expect(await REPOSITORY.findById(QUOTA_ID)).toBeNull();
    });
  });
});
