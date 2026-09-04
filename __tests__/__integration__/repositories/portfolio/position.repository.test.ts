import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  newPositionRepository,
  seedPositionFixtureParents,
  seedPositions,
  UPDATED_POSITION,
} from "@/__tests__/__helpers__/repositories/_portfolio.test.helper";
import { FUND_ID, OTHER_FUND_ID } from "@/__tests__/__seeds__/_fund.seed";
import {
  OTHER_PORTFOLIO_ID,
  PORTFOLIO_ID,
} from "@/__tests__/__seeds__/_portfolio.seed";
import {
  FRESH_POSITION,
  OTHER_POSITION,
  POSITION,
  POSITION_ID,
  THIRD_POSITION,
} from "@/__tests__/__seeds__/_position.seed";
import {
  closeDatabase,
  resetDatabase,
} from "@/__tests__/__setup__/_database.setup";
import { EntityId } from "@/business/value-objects/entity-id.vo";

describe("PositionRepository", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe("findById", () => {
    it("returns the persisted position", async () => {
      await seedPositions();

      const FOUND = await newPositionRepository().findById(
        EntityId.create(POSITION_ID),
      );

      expect(FOUND?.equals(POSITION)).toBe(true);
    });

    it("returns null when the position does not exist", async () => {
      expect(
        await newPositionRepository().findById(EntityId.create(POSITION_ID)),
      ).toBeNull();
    });
  });

  describe("findAllByPortfolioId", () => {
    it("returns every position of the portfolio", async () => {
      await seedPositions();

      const FOUND = await newPositionRepository().findAllByPortfolioId(
        EntityId.create(PORTFOLIO_ID),
      );

      expect(FOUND).toHaveLength(2);
      expect(FOUND.some((ROW) => ROW.equals(POSITION))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(THIRD_POSITION))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(OTHER_POSITION))).toBe(false);
    });

    it("returns an empty array when the portfolio has no positions", async () => {
      expect(
        await newPositionRepository().findAllByPortfolioId(
          EntityId.create(PORTFOLIO_ID),
        ),
      ).toEqual([]);
    });
  });

  describe("findAllByPortfolioIds", () => {
    it("returns every position of the provided portfolios", async () => {
      await seedPositions();

      const FOUND = await newPositionRepository().findAllByPortfolioIds([
        EntityId.create(PORTFOLIO_ID),
        EntityId.create(OTHER_PORTFOLIO_ID),
      ]);

      expect(FOUND).toHaveLength(3);
      expect(FOUND.some((ROW) => ROW.equals(POSITION))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(OTHER_POSITION))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(THIRD_POSITION))).toBe(true);
    });

    it("returns an empty array when no ids are provided", async () => {
      expect(await newPositionRepository().findAllByPortfolioIds([])).toEqual(
        [],
      );
    });
  });

  describe("findAllByFundIds", () => {
    it("returns every position holding any of the provided funds", async () => {
      await seedPositions();

      const FOUND = await newPositionRepository().findAllByFundIds([
        FUND_ID,
        OTHER_FUND_ID,
      ]);

      expect(FOUND).toHaveLength(3);
      expect(FOUND.some((ROW) => ROW.equals(POSITION))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(OTHER_POSITION))).toBe(true);
      expect(FOUND.some((ROW) => ROW.equals(THIRD_POSITION))).toBe(true);
    });

    it("returns an empty array when no ids are provided", async () => {
      await seedPositions();

      expect(await newPositionRepository().findAllByFundIds([])).toEqual([]);
    });

    it("returns only the positions holding the matching funds", async () => {
      await seedPositions();

      const FOUND = await newPositionRepository().findAllByFundIds([FUND_ID]);

      expect(FOUND).toHaveLength(1);
      expect(FOUND.some((ROW) => ROW.equals(POSITION))).toBe(true);
    });
  });

  describe("findByPortfolioIdAndFundId", () => {
    it("returns the position holding the fund within the portfolio", async () => {
      await seedPositions();

      const FOUND = await newPositionRepository().findByPortfolioIdAndFundId(
        EntityId.create(PORTFOLIO_ID),
        EntityId.create(OTHER_FUND_ID),
      );

      expect(FOUND?.equals(THIRD_POSITION)).toBe(true);
    });

    it("returns null when the pair has no position", async () => {
      await seedPositions();

      const FOUND = await newPositionRepository().findByPortfolioIdAndFundId(
        EntityId.create(OTHER_PORTFOLIO_ID),
        EntityId.create(FUND_ID),
      );

      expect(FOUND).toBeNull();
    });
  });

  describe("save", () => {
    it("persists a new position", async () => {
      await seedPositionFixtureParents();

      const SAVED = await newPositionRepository().save(FRESH_POSITION);

      expect(SAVED.id).toBeDefined();
      expect(SAVED.portfolioId).toBe(FRESH_POSITION.portfolioId);
      expect(
        (
          await newPositionRepository().findById(
            EntityId.create(SAVED.id as string),
          )
        )?.equals(SAVED),
      ).toBe(true);
    });

    it("updates an existing position", async () => {
      await seedPositions();

      await newPositionRepository().save(UPDATED_POSITION);

      const FOUND = await newPositionRepository().findById(
        EntityId.create(POSITION_ID),
      );

      expect(FOUND?.initialBalance?.value.toString()).toBe(
        UPDATED_POSITION.initialBalance?.value.toString(),
      );
      expect(FOUND?.initialBalanceDate?.getTime()).toBe(
        UPDATED_POSITION.initialBalanceDate?.getTime(),
      );
      expect(FOUND?.equals(UPDATED_POSITION)).toBe(true);
    });
  });

  describe("delete", () => {
    it("removes the persisted position", async () => {
      await seedPositions();

      await newPositionRepository().delete(EntityId.create(POSITION_ID));

      expect(
        await newPositionRepository().findById(EntityId.create(POSITION_ID)),
      ).toBeNull();
    });
  });
});
