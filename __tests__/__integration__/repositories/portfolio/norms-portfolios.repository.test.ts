import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  ADDITIONAL_NORM_PORTFOLIOS,
  NORM_PORTFOLIOS,
  newNormsPortfoliosRepository,
  OTHER_NORM_PORTFOLIOS,
  seedAllNormRelations,
  seedNormRelations,
  UPDATED_NORM_PORTFOLIOS,
} from "@/__tests__/__helpers__/repositories/_portfolio.test.helper";
import {
  closeDatabase,
  resetDatabase,
} from "@/__tests__/__setup__/_database.setup";

describe("NormsPortfoliosRepository", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe("findByNormIdAndPortfolioId", () => {
    it("returns the relation of the norm and portfolio", async () => {
      await seedNormRelations();

      const FOUND =
        await newNormsPortfoliosRepository().findByNormIdAndPortfolioId(
          NORM_PORTFOLIOS.normId,
          NORM_PORTFOLIOS.portfolioId,
        );

      expect(FOUND?.normId).toBe(NORM_PORTFOLIOS.normId);
      expect(FOUND?.portfolioId).toBe(NORM_PORTFOLIOS.portfolioId);
      expect(FOUND?.minAllocation.value.toString()).toBe(
        NORM_PORTFOLIOS.minAllocation.value.toString(),
      );
      expect(FOUND?.maxAllocation.value.toString()).toBe(
        NORM_PORTFOLIOS.maxAllocation.value.toString(),
      );
      expect(FOUND?.targetAllocation.value.toString()).toBe(
        NORM_PORTFOLIOS.targetAllocation.value.toString(),
      );
    });

    it("returns null when the pair has no relation", async () => {
      expect(
        await newNormsPortfoliosRepository().findByNormIdAndPortfolioId(
          NORM_PORTFOLIOS.normId,
          NORM_PORTFOLIOS.portfolioId,
        ),
      ).toBeNull();
    });
  });

  describe("findAllByPortfolioId", () => {
    it("returns every relation of the portfolio", async () => {
      await seedAllNormRelations();

      const FOUND = await newNormsPortfoliosRepository().findAllByPortfolioId(
        NORM_PORTFOLIOS.portfolioId,
      );

      expect(FOUND).toHaveLength(2);
      expect(
        FOUND.some(
          (ROW) =>
            ROW.normId === NORM_PORTFOLIOS.normId &&
            ROW.portfolioId === NORM_PORTFOLIOS.portfolioId,
        ),
      ).toBe(true);
      expect(
        FOUND.some(
          (ROW) =>
            ROW.normId === ADDITIONAL_NORM_PORTFOLIOS.normId &&
            ROW.portfolioId === ADDITIONAL_NORM_PORTFOLIOS.portfolioId,
        ),
      ).toBe(true);
    });

    it("returns an empty array when the portfolio has no relations", async () => {
      expect(
        await newNormsPortfoliosRepository().findAllByPortfolioId(
          NORM_PORTFOLIOS.portfolioId,
        ),
      ).toEqual([]);
    });
  });

  describe("findAllByPortfolioIds", () => {
    it("returns every relation of the provided portfolios", async () => {
      await seedAllNormRelations();

      const FOUND = await newNormsPortfoliosRepository().findAllByPortfolioIds([
        NORM_PORTFOLIOS.portfolioId,
        OTHER_NORM_PORTFOLIOS.portfolioId,
      ]);

      expect(FOUND).toHaveLength(3);
    });

    it("returns an empty array when no ids are provided", async () => {
      expect(
        await newNormsPortfoliosRepository().findAllByPortfolioIds([]),
      ).toEqual([]);
    });
  });

  describe("findAllByNormId", () => {
    it("returns every relation of the norm", async () => {
      await seedAllNormRelations();

      const FOUND = await newNormsPortfoliosRepository().findAllByNormId(
        OTHER_NORM_PORTFOLIOS.normId,
      );

      expect(FOUND).toHaveLength(2);
    });

    it("returns an empty array when the norm has no relations", async () => {
      expect(
        await newNormsPortfoliosRepository().findAllByNormId(
          OTHER_NORM_PORTFOLIOS.normId,
        ),
      ).toEqual([]);
    });
  });

  describe("save", () => {
    it("persists a new relation", async () => {
      await seedNormRelations();

      await newNormsPortfoliosRepository().save(ADDITIONAL_NORM_PORTFOLIOS);

      const FOUND =
        await newNormsPortfoliosRepository().findByNormIdAndPortfolioId(
          ADDITIONAL_NORM_PORTFOLIOS.normId,
          ADDITIONAL_NORM_PORTFOLIOS.portfolioId,
        );

      expect(FOUND?.maxAllocation.value.toString()).toBe(
        ADDITIONAL_NORM_PORTFOLIOS.maxAllocation.value.toString(),
      );
    });

    it("overwrites the allocations of an existing relation", async () => {
      await seedNormRelations();

      await newNormsPortfoliosRepository().save(UPDATED_NORM_PORTFOLIOS);

      const FOUND =
        await newNormsPortfoliosRepository().findByNormIdAndPortfolioId(
          NORM_PORTFOLIOS.normId,
          NORM_PORTFOLIOS.portfolioId,
        );

      expect(FOUND?.maxAllocation.value.toString()).toBe(
        UPDATED_NORM_PORTFOLIOS.maxAllocation.value.toString(),
      );
      expect(FOUND?.targetAllocation.value.toString()).toBe(
        UPDATED_NORM_PORTFOLIOS.targetAllocation.value.toString(),
      );
    });
  });

  describe("delete", () => {
    it("removes the persisted relation", async () => {
      await seedNormRelations();

      await newNormsPortfoliosRepository().delete(
        NORM_PORTFOLIOS.normId,
        NORM_PORTFOLIOS.portfolioId,
      );

      expect(
        await newNormsPortfoliosRepository().findByNormIdAndPortfolioId(
          NORM_PORTFOLIOS.normId,
          NORM_PORTFOLIOS.portfolioId,
        ),
      ).toBeNull();
    });
  });
});
