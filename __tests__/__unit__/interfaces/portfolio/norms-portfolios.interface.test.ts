import { beforeEach, describe, expect, it } from "vitest";

import {
  createInMemoryNormsPortfoliosRepository,
  NORM_ID,
  OTHER_NORM_ID,
  OTHER_PORTFOLIO_ID,
  PORTFOLIO_ID,
  RELATION,
} from "@/__tests__/__helpers__/interfaces/_norms-portfolios.test.helper";

import { NormsPortfolios } from "@/business/entities/portfolio/norms-portfolios.entity";
import type { INormsPortfolios } from "@/business/interfaces/portfolio/norms-portfolios.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";

describe("INormsPortfolios", () => {
  let REPOSITORY: INormsPortfolios;

  beforeEach(() => {
    REPOSITORY = createInMemoryNormsPortfoliosRepository();
  });

  describe("findByNormIdAndPortfolioId", () => {
    it("returns the persisted relation", async () => {
      await REPOSITORY.save(RELATION);

      const FOUND = await REPOSITORY.findByNormIdAndPortfolioId(
        EntityId.create(NORM_ID),
        EntityId.create(PORTFOLIO_ID),
      );

      expect(FOUND?.normId).toBe(RELATION.normId);
      expect(FOUND?.portfolioId).toBe(RELATION.portfolioId);
    });

    it("returns null when the relation does not exist", async () => {
      expect(
        await REPOSITORY.findByNormIdAndPortfolioId(
          EntityId.create(NORM_ID),
          EntityId.create(PORTFOLIO_ID),
        ),
      ).toBeNull();
    });
  });

  describe("findAllByPortfolioId", () => {
    it("returns all persisted relations for the portfolio", async () => {
      const SECOND_RELATION = NormsPortfolios.create({
        normId: EntityId.create(OTHER_NORM_ID),
        portfolioId: EntityId.create(PORTFOLIO_ID),
        minAllocation: SignedPercentage.create("3"),
        maxAllocation: SignedPercentage.create("30"),
        targetAllocation: SignedPercentage.create("15"),
      });
      const OTHER_RELATION = NormsPortfolios.create({
        normId: EntityId.create(NORM_ID),
        portfolioId: EntityId.create(OTHER_PORTFOLIO_ID),
        minAllocation: SignedPercentage.create("8"),
        maxAllocation: SignedPercentage.create("25"),
        targetAllocation: SignedPercentage.create("18"),
      });

      await REPOSITORY.save(RELATION);
      await REPOSITORY.save(SECOND_RELATION);
      await REPOSITORY.save(OTHER_RELATION);

      const FOUND = await REPOSITORY.findAllByPortfolioId(
        EntityId.create(PORTFOLIO_ID),
      );

      expect(FOUND.length).toBe(2);
      expect(FOUND[0]?.normId).toBe(RELATION.normId);
      expect(FOUND[1]?.normId).toBe(SECOND_RELATION.normId);
    });

    it("returns an empty array when there are no matches", async () => {
      expect(
        await REPOSITORY.findAllByPortfolioId(EntityId.create(PORTFOLIO_ID)),
      ).toEqual([]);
    });
  });

  describe("findAllByNormId", () => {
    it("returns all persisted relations for the norm", async () => {
      const SECOND_RELATION = NormsPortfolios.create({
        normId: EntityId.create(NORM_ID),
        portfolioId: EntityId.create(OTHER_PORTFOLIO_ID),
        minAllocation: SignedPercentage.create("8"),
        maxAllocation: SignedPercentage.create("25"),
        targetAllocation: SignedPercentage.create("18"),
      });
      const OTHER_RELATION = NormsPortfolios.create({
        normId: EntityId.create(OTHER_NORM_ID),
        portfolioId: EntityId.create(PORTFOLIO_ID),
        minAllocation: SignedPercentage.create("3"),
        maxAllocation: SignedPercentage.create("30"),
        targetAllocation: SignedPercentage.create("15"),
      });

      await REPOSITORY.save(RELATION);
      await REPOSITORY.save(SECOND_RELATION);
      await REPOSITORY.save(OTHER_RELATION);

      const FOUND = await REPOSITORY.findAllByNormId(EntityId.create(NORM_ID));

      expect(FOUND.length).toBe(2);
      expect(FOUND[0]?.portfolioId).toBe(RELATION.portfolioId);
      expect(FOUND[1]?.portfolioId).toBe(SECOND_RELATION.portfolioId);
    });

    it("returns an empty array when there are no matches", async () => {
      expect(
        await REPOSITORY.findAllByNormId(EntityId.create(NORM_ID)),
      ).toEqual([]);
    });
  });

  describe("save", () => {
    it("persists a new relation", async () => {
      await REPOSITORY.save(RELATION);

      const FOUND = await REPOSITORY.findByNormIdAndPortfolioId(
        EntityId.create(NORM_ID),
        EntityId.create(PORTFOLIO_ID),
      );

      expect(FOUND?.targetAllocation.value.toString()).toBe("12");
    });

    it("updates an existing relation", async () => {
      await REPOSITORY.save(RELATION);

      const UPDATED = NormsPortfolios.create({
        normId: EntityId.create(NORM_ID),
        portfolioId: EntityId.create(PORTFOLIO_ID),
        minAllocation: SignedPercentage.create("5"),
        maxAllocation: SignedPercentage.create("25"),
        targetAllocation: SignedPercentage.create("16"),
      });

      await REPOSITORY.save(UPDATED);

      const FOUND = await REPOSITORY.findByNormIdAndPortfolioId(
        EntityId.create(NORM_ID),
        EntityId.create(PORTFOLIO_ID),
      );

      expect(FOUND?.targetAllocation.value.toString()).toBe("16");
    });
  });

  describe("delete", () => {
    it("removes the persisted relation", async () => {
      await REPOSITORY.save(RELATION);

      await REPOSITORY.delete(
        EntityId.create(NORM_ID),
        EntityId.create(PORTFOLIO_ID),
      );

      expect(
        await REPOSITORY.findByNormIdAndPortfolioId(
          EntityId.create(NORM_ID),
          EntityId.create(PORTFOLIO_ID),
        ),
      ).toBeNull();
    });
  });
});
