import { beforeEach, describe, expect, it } from "vitest";

import {
  createInMemoryPortfolioPerformanceRepository,
  PERFORMANCE,
  PERFORMANCE_DATE,
  PERFORMANCE_ID,
  PORTFOLIO_ID,
} from "@/__tests__/__helpers__/interfaces/_portfolio-performance.test.helper";

import { PortfolioPerformance } from "@/business/entities/performance/portfolio-performance.entity";
import type { IPortfolioPerformance } from "@/business/interfaces/performance/portfolio-performance.interface";
import PositiveMoney from "@/business/value-objects/positive-money.vo";
import QuotaQuantity from "@/business/value-objects/quota-quantity.vo";
import SignedMoney from "@/business/value-objects/signed-money.vo";
import SignedPercentage from "@/business/value-objects/signed-percentage.vo";

describe("IPortfolioPerformance", () => {
  let REPOSITORY: IPortfolioPerformance;

  beforeEach(() => {
    REPOSITORY = createInMemoryPortfolioPerformanceRepository();
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

  describe("findAllByPortfolioId", () => {
    it("returns all persisted performances for the portfolio", async () => {
      const SECOND_PERFORMANCE = PortfolioPerformance.create(
        {
          portfolioId: PORTFOLIO_ID,
          date: new Date("2026-08-02T00:00:00.000Z"),
          quotasHeld: QuotaQuantity.create("150"),
          patrimony: PositiveMoney.create("1500000"),
          applicationTotal: PositiveMoney.create("1500000"),
          redemptionTotal: PositiveMoney.create("0"),
          cashFlowNet: SignedMoney.create("1500000"),
          earnings: SignedMoney.create("0"),
          returnDaily: SignedPercentage.create("0"),
        },
        "6a1f2c3d-9e8b-4a21-b3d7-1c7e9f0a4b52",
      );

      await REPOSITORY.save(PERFORMANCE);
      await REPOSITORY.save(SECOND_PERFORMANCE);

      const FOUND = await REPOSITORY.findAllByPortfolioId(PORTFOLIO_ID);

      expect(FOUND.length).toBe(2);
      expect(FOUND[0]?.equals(PERFORMANCE)).toBe(true);
      expect(FOUND[1]?.equals(SECOND_PERFORMANCE)).toBe(true);
    });

    it("returns an empty array when there are no matches", async () => {
      expect(await REPOSITORY.findAllByPortfolioId(PORTFOLIO_ID)).toEqual([]);
    });
  });

  describe("findByPortfolioIdAndDate", () => {
    it("returns the persisted performance", async () => {
      await REPOSITORY.save(PERFORMANCE);

      const FOUND = await REPOSITORY.findByPortfolioIdAndDate(
        PORTFOLIO_ID,
        PERFORMANCE_DATE,
      );

      expect(FOUND?.equals(PERFORMANCE)).toBe(true);
    });

    it("returns null when the performance does not exist", async () => {
      expect(
        await REPOSITORY.findByPortfolioIdAndDate(
          PORTFOLIO_ID,
          PERFORMANCE_DATE,
        ),
      ).toBeNull();
    });
  });

  describe("findLatestByPortfolioId", () => {
    it("returns the performance with the latest date", async () => {
      const EARLIER = PortfolioPerformance.create(
        {
          portfolioId: PORTFOLIO_ID,
          date: new Date("2026-07-01T00:00:00.000Z"),
          quotasHeld: QuotaQuantity.create("80"),
          patrimony: PositiveMoney.create("800000"),
          applicationTotal: PositiveMoney.create("800000"),
          redemptionTotal: PositiveMoney.create("0"),
          cashFlowNet: SignedMoney.create("800000"),
          earnings: SignedMoney.create("0"),
          returnDaily: SignedPercentage.create("0"),
        },
        "6a1f2c3d-9e8b-4a21-b3d7-1c7e9f0a4b52",
      );
      const LATER = PortfolioPerformance.create(
        {
          portfolioId: PORTFOLIO_ID,
          date: new Date("2026-08-01T00:00:00.000Z"),
          quotasHeld: QuotaQuantity.create("100"),
          patrimony: PositiveMoney.create("1000000"),
          applicationTotal: PositiveMoney.create("1000000"),
          redemptionTotal: PositiveMoney.create("0"),
          cashFlowNet: SignedMoney.create("1000000"),
          earnings: SignedMoney.create("0"),
          returnDaily: SignedPercentage.create("0"),
        },
        PERFORMANCE_ID,
      );

      await REPOSITORY.save(EARLIER);
      await REPOSITORY.save(LATER);

      const FOUND = await REPOSITORY.findLatestByPortfolioId(PORTFOLIO_ID);

      expect(FOUND?.equals(LATER)).toBe(true);
    });

    it("returns null when there is no performance", async () => {
      expect(await REPOSITORY.findLatestByPortfolioId(PORTFOLIO_ID)).toBeNull();
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

      const UPDATED = PortfolioPerformance.create(
        {
          portfolioId: PORTFOLIO_ID,
          date: PERFORMANCE_DATE,
          quotasHeld: QuotaQuantity.create("100"),
          patrimony: PositiveMoney.create("1200000"),
          applicationTotal: PositiveMoney.create("1200000"),
          redemptionTotal: PositiveMoney.create("0"),
          cashFlowNet: SignedMoney.create("1200000"),
          earnings: SignedMoney.create("0"),
          returnDaily: SignedPercentage.create("0"),
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
