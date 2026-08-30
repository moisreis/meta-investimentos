import { beforeEach, describe, expect, it } from "vitest";

import {
  createInMemoryPositionRepository,
  FUND_ID,
  OTHER_FUND_ID,
  OTHER_PORTFOLIO_ID,
  PORTFOLIO_ID,
  POSITION,
  POSITION_ID,
} from "@/__tests__/__helpers__/interfaces/_position.test.helper";

import { Position } from "@/business/entities/portfolio/position.entity";
import type { IPosition } from "@/business/interfaces/portfolio/position.interface";

describe("IPosition", () => {
  let REPOSITORY: IPosition;

  beforeEach(() => {
    REPOSITORY = createInMemoryPositionRepository();
  });

  describe("findById", () => {
    it("returns the persisted position", async () => {
      await REPOSITORY.save(POSITION);

      const FOUND = await REPOSITORY.findById(POSITION_ID);

      expect(FOUND?.equals(POSITION)).toBe(true);
    });

    it("returns null when the position does not exist", async () => {
      expect(await REPOSITORY.findById(POSITION_ID)).toBeNull();
    });
  });

  describe("findAllByPortfolioId", () => {
    it("returns all persisted positions for the portfolio", async () => {
      const SECOND_POSITION = Position.create(
        {
          portfolioId: PORTFOLIO_ID,
          fundId: OTHER_FUND_ID,
        },
        "6a1f2c3d-9e8b-4a21-b3d7-1c7e9f0a4b52",
      );
      const OTHER_POSITION = Position.create(
        {
          portfolioId: OTHER_PORTFOLIO_ID,
          fundId: FUND_ID,
        },
        "d5a3e7f1-6b90-4c12-8d47-2e8f0a1c3b64",
      );

      await REPOSITORY.save(POSITION);
      await REPOSITORY.save(SECOND_POSITION);
      await REPOSITORY.save(OTHER_POSITION);

      const FOUND = await REPOSITORY.findAllByPortfolioId(PORTFOLIO_ID);

      expect(FOUND.length).toBe(2);
      expect(FOUND[0]?.equals(POSITION)).toBe(true);
      expect(FOUND[1]?.equals(SECOND_POSITION)).toBe(true);
    });

    it("returns an empty array when there are no matches", async () => {
      expect(await REPOSITORY.findAllByPortfolioId(PORTFOLIO_ID)).toEqual([]);
    });
  });

  describe("findByPortfolioIdAndFundId", () => {
    it("returns the persisted position", async () => {
      await REPOSITORY.save(POSITION);

      const FOUND = await REPOSITORY.findByPortfolioIdAndFundId(
        PORTFOLIO_ID,
        FUND_ID,
      );

      expect(FOUND?.equals(POSITION)).toBe(true);
    });

    it("returns null when the position does not exist", async () => {
      expect(
        await REPOSITORY.findByPortfolioIdAndFundId(PORTFOLIO_ID, FUND_ID),
      ).toBeNull();
    });
  });

  describe("save", () => {
    it("persists a new position", async () => {
      await REPOSITORY.save(POSITION);

      const FOUND = await REPOSITORY.findById(POSITION_ID);

      expect(FOUND?.equals(POSITION)).toBe(true);
    });

    it("updates an existing position", async () => {
      await REPOSITORY.save(POSITION);

      const UPDATED = Position.create(
        {
          portfolioId: PORTFOLIO_ID,
          fundId: OTHER_FUND_ID,
        },
        POSITION_ID,
      );

      await REPOSITORY.save(UPDATED);

      const FOUND = await REPOSITORY.findById(POSITION_ID);

      expect(FOUND?.fundId).toBe(OTHER_FUND_ID);
    });
  });

  describe("delete", () => {
    it("removes the persisted position", async () => {
      await REPOSITORY.save(POSITION);

      await REPOSITORY.delete(POSITION_ID);

      expect(await REPOSITORY.findById(POSITION_ID)).toBeNull();
    });
  });
});
