import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { PORTFOLIO } from "@/__tests__/__helpers__/interfaces/_portfolio.test.helper";
import {
  EXTERNAL_PORTFOLIO_PERFORMANCE,
  PORTFOLIO_PERFORMANCE,
} from "@/__tests__/__helpers__/interfaces/_portfolio-performance.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { getLatestPortfolioPerformance } from "@/business/use-cases/performance/get-latest-portfolio-performance.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;

describe("getLatestPortfolioPerformance", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("returns the performance with the most recent date", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        portfolioPerformances: [
          PORTFOLIO_PERFORMANCE,
          EXTERNAL_PORTFOLIO_PERFORMANCE,
        ],
      });

      const RESULT = await getLatestPortfolioPerformance(unitOfWork as never, {
        actorId: ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
      });

      expect(RESULT.id).toBe(
        EntityId.create(ID.PORTFOLIO_PERFORMANCE.EXTERNAL),
      );
    });

    it("returns the only performance when a single record exists", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        portfolioPerformances: [PORTFOLIO_PERFORMANCE],
      });

      const RESULT = await getLatestPortfolioPerformance(unitOfWork as never, {
        actorId: ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
      });

      expect(RESULT.id).toBe(EntityId.create(ID.PORTFOLIO_PERFORMANCE.DEFAULT));
    });
  });

  describe("not found", () => {
    it("throws NotFoundError when the portfolio has no performance", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
      });

      await expect(
        getLatestPortfolioPerformance(unitOfWork as never, {
          actorId: ACTOR_ID,
          portfolioId: ID.PORTFOLIO.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("authorization", () => {
    it("throws NotFoundError when the actor has no access to the portfolio", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        portfolioPerformances: [PORTFOLIO_PERFORMANCE],
      });

      await expect(
        getLatestPortfolioPerformance(unitOfWork as never, {
          actorId: ID.USER.OTHER,
          portfolioId: ID.PORTFOLIO.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the portfolio does not exist", async () => {
      await expect(
        getLatestPortfolioPerformance(unitOfWork as never, {
          actorId: ACTOR_ID,
          portfolioId: ID.PORTFOLIO.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
