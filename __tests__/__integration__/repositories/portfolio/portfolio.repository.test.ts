import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  newPortfolioRepository,
  seedPortfolioFixtureParents,
  seedPortfolios,
  UPDATED_PORTFOLIO,
} from "@/__tests__/__helpers__/repositories/_portfolio.test.helper";
import {
  FRESH_PORTFOLIO,
  OTHER_PORTFOLIO,
  OTHER_PORTFOLIO_ID,
  PORTFOLIO,
  PORTFOLIO_ID,
  THIRD_PORTFOLIO,
} from "@/__tests__/__seeds__/_portfolio.seed";
import { USER_ID } from "@/__tests__/__seeds__/_user.seed";
import {
  closeDatabase,
  resetDatabase,
} from "@/__tests__/__setup__/_database.setup";

describe("PortfolioRepository", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe("findById", () => {
    it("returns the persisted portfolio", async () => {
      await seedPortfolios();

      const FOUND = await newPortfolioRepository().findById(PORTFOLIO_ID);

      expect(FOUND?.equals(PORTFOLIO)).toBe(true);
    });

    it("returns null when the portfolio does not exist", async () => {
      expect(await newPortfolioRepository().findById(PORTFOLIO_ID)).toBeNull();
    });
  });

  describe("findAllByUserId", () => {
    it("returns every portfolio of the user", async () => {
      await seedPortfolios();

      const FOUND = await newPortfolioRepository().findAllByUserId(USER_ID);

      expect(FOUND).toHaveLength(2);
      expect(FOUND.some((ROW) => ROW.equals(PORTFOLIO))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(THIRD_PORTFOLIO))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(OTHER_PORTFOLIO))).toBe(false);
    });

    it("returns an empty array when the user has no portfolios", async () => {
      expect(await newPortfolioRepository().findAllByUserId(USER_ID)).toEqual(
        [],
      );
    });
  });

  describe("findAllByIds", () => {
    it("returns only the portfolios with the provided ids", async () => {
      await seedPortfolios();

      const FOUND = await newPortfolioRepository().findAllByIds([
        PORTFOLIO_ID,
        OTHER_PORTFOLIO_ID,
      ]);

      expect(FOUND).toHaveLength(2);
      expect(FOUND.some((ROW) => ROW.equals(PORTFOLIO))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(OTHER_PORTFOLIO))).toBe(true);
    });

    it("returns an empty array when no ids are provided", async () => {
      expect(await newPortfolioRepository().findAllByIds([])).toEqual([]);
    });
  });

  describe("save", () => {
    it("persists a new portfolio", async () => {
      await seedPortfolioFixtureParents();

      const SAVED = await newPortfolioRepository().save(FRESH_PORTFOLIO);

      expect(SAVED.id).toBeDefined();
      expect(SAVED.acronym).toBe(FRESH_PORTFOLIO.acronym);
      expect(
        (await newPortfolioRepository().findById(SAVED.id as string))?.equals(
          SAVED,
        ),
      ).toBe(true);
    });

    it("updates an existing portfolio", async () => {
      await seedPortfolios();

      await newPortfolioRepository().save(UPDATED_PORTFOLIO);

      const FOUND = await newPortfolioRepository().findById(PORTFOLIO_ID);

      expect(FOUND?.annualInterestRate.value.toString()).toBe(
        UPDATED_PORTFOLIO.annualInterestRate.value.toString(),
      );
      expect(FOUND?.targetAllocation.value.toString()).toBe(
        UPDATED_PORTFOLIO.targetAllocation.value.toString(),
      );
      expect(FOUND?.equals(UPDATED_PORTFOLIO)).toBe(true);
    });
  });

  describe("delete", () => {
    it("removes the persisted portfolio", async () => {
      await seedPortfolios();

      await newPortfolioRepository().delete(PORTFOLIO_ID);

      expect(await newPortfolioRepository().findById(PORTFOLIO_ID)).toBeNull();
    });
  });
});
