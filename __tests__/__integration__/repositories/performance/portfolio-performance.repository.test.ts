import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  EXTERNAL_PORTFOLIO_PERFORMANCE,
  FEBRUARY_PERFORMANCE_DATE,
  FRESH_PORTFOLIO_PERFORMANCE,
  newPortfolioPerformanceRepository,
  OTHER_PORTFOLIO_PERFORMANCE,
  PERFORMANCE_DATE,
  PERIOD_OUTSIDE_PORTFOLIO_PERFORMANCE,
  PORTFOLIO_PERFORMANCE,
  PORTFOLIO_PERFORMANCE_ID,
  seedAllPortfolioPerformances,
  seedPortfolioPerformances,
  UPDATED_PORTFOLIO_PERFORMANCE,
} from "@/__tests__/__helpers__/repositories/_performance.test.helper";
import {
  OTHER_PORTFOLIO_ID,
  PORTFOLIO_ID,
} from "@/__tests__/__seeds__/_portfolio.seed";
import {
  closeDatabase,
  resetDatabase,
} from "@/__tests__/__setup__/_database.setup";

describe("PortfolioPerformanceRepository", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe("findById", () => {
    it("returns the persisted performance", async () => {
      await seedPortfolioPerformances();

      const FOUND = await newPortfolioPerformanceRepository().findById(
        PORTFOLIO_PERFORMANCE_ID,
      );

      expect(FOUND?.equals(PORTFOLIO_PERFORMANCE)).toBe(true);
    });

    it("returns null when the performance does not exist", async () => {
      expect(
        await newPortfolioPerformanceRepository().findById(
          PORTFOLIO_PERFORMANCE_ID,
        ),
      ).toBeNull();
    });
  });

  describe("findAllByPortfolioId", () => {
    it("returns the whole performance series of the portfolio", async () => {
      await seedAllPortfolioPerformances();

      const FOUND =
        await newPortfolioPerformanceRepository().findAllByPortfolioId(
          PORTFOLIO_ID,
        );

      expect(FOUND).toHaveLength(3);
      expect(FOUND.some((ROW) => ROW.equals(PORTFOLIO_PERFORMANCE))).toBe(true);
      expect(
        FOUND.some((ROW) => ROW.equals(EXTERNAL_PORTFOLIO_PERFORMANCE)),
      ).toBe(true);
      expect(
        FOUND.some((ROW) => ROW.equals(PERIOD_OUTSIDE_PORTFOLIO_PERFORMANCE)),
      ).toBe(true);
    });

    it("returns an empty array when the portfolio has no performances", async () => {
      expect(
        await newPortfolioPerformanceRepository().findAllByPortfolioId(
          PORTFOLIO_ID,
        ),
      ).toEqual([]);
    });
  });

  describe("findAllByPortfolioIds", () => {
    it("returns the series of all the provided portfolios", async () => {
      await seedAllPortfolioPerformances();

      const FOUND =
        await newPortfolioPerformanceRepository().findAllByPortfolioIds([
          PORTFOLIO_ID,
          OTHER_PORTFOLIO_ID,
        ]);

      expect(FOUND).toHaveLength(4);
      expect(FOUND.some((ROW) => ROW.equals(PORTFOLIO_PERFORMANCE))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(OTHER_PORTFOLIO_PERFORMANCE))).toBe(
        true,
      );
    });

    it("returns an empty array when no ids are provided", async () => {
      expect(
        await newPortfolioPerformanceRepository().findAllByPortfolioIds([]),
      ).toEqual([]);
    });
  });

  describe("findByPortfolioIdAndDate", () => {
    it("returns the performance of the portfolio on the date", async () => {
      await seedPortfolioPerformances();

      const FOUND =
        await newPortfolioPerformanceRepository().findByPortfolioIdAndDate(
          PORTFOLIO_ID,
          PERFORMANCE_DATE,
        );

      expect(FOUND?.equals(PORTFOLIO_PERFORMANCE)).toBe(true);
    });

    it("returns null when the portfolio has no performance on the date", async () => {
      await seedPortfolioPerformances();

      const FOUND =
        await newPortfolioPerformanceRepository().findByPortfolioIdAndDate(
          PORTFOLIO_ID,
          FEBRUARY_PERFORMANCE_DATE,
        );

      expect(FOUND).toBeNull();
    });
  });

  describe("findLatestByPortfolioId", () => {
    it("returns the performance with the most recent date", async () => {
      await seedAllPortfolioPerformances();

      const FOUND =
        await newPortfolioPerformanceRepository().findLatestByPortfolioId(
          PORTFOLIO_ID,
        );

      expect(FOUND?.equals(PERIOD_OUTSIDE_PORTFOLIO_PERFORMANCE)).toBe(true);
    });

    it("returns null when the portfolio has no performances", async () => {
      expect(
        await newPortfolioPerformanceRepository().findLatestByPortfolioId(
          PORTFOLIO_ID,
        ),
      ).toBeNull();
    });
  });

  describe("findLatestByPortfolioIds", () => {
    it("returns the latest performance per provided portfolio", async () => {
      await seedAllPortfolioPerformances();

      const FOUND =
        await newPortfolioPerformanceRepository().findLatestByPortfolioIds([
          PORTFOLIO_ID,
          OTHER_PORTFOLIO_ID,
        ]);

      expect(FOUND).toHaveLength(2);
      expect(
        FOUND.some((ROW) => ROW.equals(PERIOD_OUTSIDE_PORTFOLIO_PERFORMANCE)),
      ).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(OTHER_PORTFOLIO_PERFORMANCE))).toBe(
        true,
      );
    });

    it("returns an empty array when no ids are provided", async () => {
      expect(
        await newPortfolioPerformanceRepository().findLatestByPortfolioIds([]),
      ).toEqual([]);
    });
  });

  describe("save", () => {
    it("persists a new performance", async () => {
      await seedPortfolioPerformances();

      const SAVED = await newPortfolioPerformanceRepository().save(
        FRESH_PORTFOLIO_PERFORMANCE,
      );

      expect(SAVED.id).toBeDefined();
      expect(SAVED.patrimony.value.toString()).toBe(
        FRESH_PORTFOLIO_PERFORMANCE.patrimony.value.toString(),
      );
      expect(
        (
          await newPortfolioPerformanceRepository().findById(SAVED.id as string)
        )?.equals(SAVED),
      ).toBe(true);
    });

    it("updates an existing performance", async () => {
      await seedPortfolioPerformances();

      await newPortfolioPerformanceRepository().save(
        UPDATED_PORTFOLIO_PERFORMANCE,
      );

      const FOUND = await newPortfolioPerformanceRepository().findById(
        PORTFOLIO_PERFORMANCE_ID,
      );

      expect(FOUND?.patrimony.value.toString()).toBe(
        UPDATED_PORTFOLIO_PERFORMANCE.patrimony.value.toString(),
      );
      expect(FOUND?.equals(UPDATED_PORTFOLIO_PERFORMANCE)).toBe(true);
    });
  });

  describe("delete", () => {
    it("removes the persisted performance", async () => {
      await seedPortfolioPerformances();

      await newPortfolioPerformanceRepository().delete(
        PORTFOLIO_PERFORMANCE_ID,
      );

      expect(
        await newPortfolioPerformanceRepository().findById(
          PORTFOLIO_PERFORMANCE_ID,
        ),
      ).toBeNull();
    });
  });
});
