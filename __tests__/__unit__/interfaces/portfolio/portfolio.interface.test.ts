import { beforeEach, describe, expect, it } from "vitest";

import {
  createInMemoryPortfolioRepository,
  OTHER_USER_ID,
  PORTFOLIO,
  PORTFOLIO_ID,
  USER_ID,
} from "@/__tests__/__helpers__/interfaces/_portfolio.test.helper";

import { Portfolio } from "@/business/entities/portfolio/portfolio.entity";
import type { IPortfolio } from "@/business/interfaces/portfolio/portfolio.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";

describe("IPortfolio", () => {
  let REPOSITORY: IPortfolio;

  beforeEach(() => {
    REPOSITORY = createInMemoryPortfolioRepository();
  });

  describe("findById", () => {
    it("returns the persisted portfolio", async () => {
      await REPOSITORY.save(PORTFOLIO);

      const FOUND = await REPOSITORY.findById(EntityId.create(PORTFOLIO_ID));

      expect(FOUND?.equals(PORTFOLIO)).toBe(true);
    });

    it("returns null when the portfolio does not exist", async () => {
      expect(
        await REPOSITORY.findById(EntityId.create(PORTFOLIO_ID)),
      ).toBeNull();
    });
  });

  describe("findAllByUserId", () => {
    it("returns all persisted portfolios for the user", async () => {
      const SECOND_PORTFOLIO = Portfolio.create(
        {
          acronym: "FIM",
          name: "Fundo Multimercado",
          userId: EntityId.create(USER_ID),
          annualInterestRate: SignedPercentage.create("12"),
          minAllocation: SignedPercentage.create("10"),
          maxAllocation: SignedPercentage.create("40"),
          targetAllocation: SignedPercentage.create("25"),
        },
        "6a1f2c3d-9e8b-4a21-b3d7-1c7e9f0a4b52",
      );
      const OTHER_PORTFOLIO = Portfolio.create(
        {
          acronym: "FIC",
          name: "Fundo de Crédito",
          userId: EntityId.create(OTHER_USER_ID),
          annualInterestRate: SignedPercentage.create("9"),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("30"),
          targetAllocation: SignedPercentage.create("18"),
        },
        "d5a3e7f1-6b90-4c12-8d47-2e8f0a1c3b64",
      );

      await REPOSITORY.save(PORTFOLIO);
      await REPOSITORY.save(SECOND_PORTFOLIO);
      await REPOSITORY.save(OTHER_PORTFOLIO);

      const FOUND = await REPOSITORY.findAllByUserId(EntityId.create(USER_ID));

      expect(FOUND.length).toBe(2);
      expect(FOUND[0]?.equals(PORTFOLIO)).toBe(true);
      expect(FOUND[1]?.equals(SECOND_PORTFOLIO)).toBe(true);
    });

    it("returns an empty array when there are no matches", async () => {
      expect(
        await REPOSITORY.findAllByUserId(EntityId.create(USER_ID)),
      ).toEqual([]);
    });
  });

  describe("save", () => {
    it("persists a new portfolio", async () => {
      await REPOSITORY.save(PORTFOLIO);

      const FOUND = await REPOSITORY.findById(EntityId.create(PORTFOLIO_ID));

      expect(FOUND?.equals(PORTFOLIO)).toBe(true);
    });

    it("updates an existing portfolio", async () => {
      await REPOSITORY.save(PORTFOLIO);

      const UPDATED = Portfolio.create(
        {
          acronym: "FIA",
          name: "Fundo de Investimento em Ações Revisado",
          userId: EntityId.create(USER_ID),
          annualInterestRate: SignedPercentage.create("11"),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("14"),
        },
        PORTFOLIO_ID,
      );

      await REPOSITORY.save(UPDATED);

      const FOUND = await REPOSITORY.findById(EntityId.create(PORTFOLIO_ID));

      expect(FOUND?.targetAllocation.value.toString()).toBe("14");
    });
  });

  describe("delete", () => {
    it("removes the persisted portfolio", async () => {
      await REPOSITORY.save(PORTFOLIO);

      await REPOSITORY.delete(EntityId.create(PORTFOLIO_ID));

      expect(
        await REPOSITORY.findById(EntityId.create(PORTFOLIO_ID)),
      ).toBeNull();
    });
  });
});
