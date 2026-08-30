import { beforeEach, describe, expect, it } from "vitest";

import {
  createInMemoryPositionPerformanceRepository,
  PERFORMANCE,
  PERFORMANCE_DATE,
  PERFORMANCE_ID,
  POSITION_ID,
} from "@/__tests__/__helpers__/interfaces/_position-performance.test.helper";

import { PositionPerformance } from "@/business/entities/performance/position-performance.entity";
import type { IPositionPerformance } from "@/business/interfaces/performance/position-performance.interface";
import PositiveMoney from "@/business/value-objects/positive-money.vo";
import QuotaQuantity from "@/business/value-objects/quota-quantity.vo";
import SignedMoney from "@/business/value-objects/signed-money.vo";
import SignedPercentage from "@/business/value-objects/signed-percentage.vo";

describe("IPositionPerformance", () => {
  let REPOSITORY: IPositionPerformance;

  beforeEach(() => {
    REPOSITORY = createInMemoryPositionPerformanceRepository();
  });

  describe("findById", () => {
    it("returns the persisted performance", async () => {
      await REPOSITORY.save(PERFORMANCE);

      const FOUND = await REPOSITORY.findById(PERFORMANCE_ID);

      expect(FOUND?.equals(PERFORMANCE)).toBe(true);
    });

    it("returns null when the performance does not exist", async () => {
      expect(await REPOSITORY.findById(PERFORMANCE_ID)).toBeNull();
    });
  });

  describe("findAllByPositionId", () => {
    it("returns all persisted performances for the position", async () => {
      const SECOND_PERFORMANCE = PositionPerformance.create(
        {
          positionId: POSITION_ID,
          date: new Date("2026-08-02T00:00:00.000Z"),
          quotasHeld: QuotaQuantity.create("150"),
          patrimony: PositiveMoney.create("1500000"),
          applicationTotal: PositiveMoney.create("1500000"),
          redemptionTotal: PositiveMoney.create("0"),
          cashFlowNet: SignedMoney.create("1500000"),
          earnings: SignedMoney.create("0"),
          returnDaily: SignedPercentage.create("0"),
          allocation: SignedPercentage.create("100"),
        },
        "6a1f2c3d-9e8b-4a21-b3d7-1c7e9f0a4b52",
      );

      await REPOSITORY.save(PERFORMANCE);
      await REPOSITORY.save(SECOND_PERFORMANCE);

      const FOUND = await REPOSITORY.findAllByPositionId(POSITION_ID);

      expect(FOUND.length).toBe(2);
      expect(FOUND[0]?.equals(PERFORMANCE)).toBe(true);
      expect(FOUND[1]?.equals(SECOND_PERFORMANCE)).toBe(true);
    });

    it("returns an empty array when there are no matches", async () => {
      expect(await REPOSITORY.findAllByPositionId(POSITION_ID)).toEqual([]);
    });
  });

  describe("findByPositionIdAndDate", () => {
    it("returns the persisted performance", async () => {
      await REPOSITORY.save(PERFORMANCE);

      const FOUND = await REPOSITORY.findByPositionIdAndDate(
        POSITION_ID,
        PERFORMANCE_DATE,
      );

      expect(FOUND?.equals(PERFORMANCE)).toBe(true);
    });

    it("returns null when the performance does not exist", async () => {
      expect(
        await REPOSITORY.findByPositionIdAndDate(POSITION_ID, PERFORMANCE_DATE),
      ).toBeNull();
    });
  });

  describe("findLatestByPositionId", () => {
    it("returns the performance with the latest date", async () => {
      const EARLIER = PositionPerformance.create(
        {
          positionId: POSITION_ID,
          date: new Date("2026-07-01T00:00:00.000Z"),
          quotasHeld: QuotaQuantity.create("80"),
          patrimony: PositiveMoney.create("800000"),
          applicationTotal: PositiveMoney.create("800000"),
          redemptionTotal: PositiveMoney.create("0"),
          cashFlowNet: SignedMoney.create("800000"),
          earnings: SignedMoney.create("0"),
          returnDaily: SignedPercentage.create("0"),
          allocation: SignedPercentage.create("100"),
        },
        "6a1f2c3d-9e8b-4a21-b3d7-1c7e9f0a4b52",
      );
      const LATER = PositionPerformance.create(
        {
          positionId: POSITION_ID,
          date: new Date("2026-08-01T00:00:00.000Z"),
          quotasHeld: QuotaQuantity.create("100"),
          patrimony: PositiveMoney.create("1000000"),
          applicationTotal: PositiveMoney.create("1000000"),
          redemptionTotal: PositiveMoney.create("0"),
          cashFlowNet: SignedMoney.create("1000000"),
          earnings: SignedMoney.create("0"),
          returnDaily: SignedPercentage.create("0"),
          allocation: SignedPercentage.create("100"),
        },
        PERFORMANCE_ID,
      );

      await REPOSITORY.save(EARLIER);
      await REPOSITORY.save(LATER);

      const FOUND = await REPOSITORY.findLatestByPositionId(POSITION_ID);

      expect(FOUND?.equals(LATER)).toBe(true);
    });

    it("returns null when there is no performance", async () => {
      expect(await REPOSITORY.findLatestByPositionId(POSITION_ID)).toBeNull();
    });
  });

  describe("save", () => {
    it("persists a new performance", async () => {
      await REPOSITORY.save(PERFORMANCE);

      const FOUND = await REPOSITORY.findById(PERFORMANCE_ID);

      expect(FOUND?.equals(PERFORMANCE)).toBe(true);
    });

    it("updates an existing performance", async () => {
      await REPOSITORY.save(PERFORMANCE);

      const UPDATED = PositionPerformance.create(
        {
          positionId: POSITION_ID,
          date: PERFORMANCE_DATE,
          quotasHeld: QuotaQuantity.create("100"),
          patrimony: PositiveMoney.create("1200000"),
          applicationTotal: PositiveMoney.create("1200000"),
          redemptionTotal: PositiveMoney.create("0"),
          cashFlowNet: SignedMoney.create("1200000"),
          earnings: SignedMoney.create("0"),
          returnDaily: SignedPercentage.create("0"),
          allocation: SignedPercentage.create("100"),
        },
        PERFORMANCE_ID,
      );

      await REPOSITORY.save(UPDATED);

      const FOUND = await REPOSITORY.findById(PERFORMANCE_ID);

      expect(FOUND?.patrimony.value.toString()).toBe("1200000");
    });
  });

  describe("delete", () => {
    it("removes the persisted performance", async () => {
      await REPOSITORY.save(PERFORMANCE);

      await REPOSITORY.delete(PERFORMANCE_ID);

      expect(await REPOSITORY.findById(PERFORMANCE_ID)).toBeNull();
    });
  });
});
