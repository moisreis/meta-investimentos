import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { PORTFOLIO } from "@/__tests__/__helpers__/interfaces/_portfolio.test.helper";
import {
  EXTERNAL_PORTFOLIO_PERFORMANCE,
  PORTFOLIO_PERFORMANCE,
} from "@/__tests__/__helpers__/interfaces/_portfolio-performance.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { listPortfolioPerformances } from "@/business/use-cases/performance/list-portfolio-performances.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;

describe("listPortfolioPerformances", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("returns all performances of the portfolio", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        portfolioPerformances: [
          PORTFOLIO_PERFORMANCE,
          EXTERNAL_PORTFOLIO_PERFORMANCE,
        ],
      });

      const RESULT = await listPortfolioPerformances(unitOfWork as never, {
        actorId: ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
      });

      expect(RESULT).toHaveLength(2);
      expect(RESULT.map((ROW) => ROW.id)).toEqual(
        expect.arrayContaining([
          EntityId.create(ID.PORTFOLIO_PERFORMANCE.DEFAULT),
          EntityId.create(ID.PORTFOLIO_PERFORMANCE.EXTERNAL),
        ]),
      );
    });

    it("returns an empty list when the portfolio has no performances", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
      });

      const RESULT = await listPortfolioPerformances(unitOfWork as never, {
        actorId: ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
      });

      expect(RESULT).toHaveLength(0);
    });
  });

  describe("authorization", () => {
    it("throws NotFoundError when the actor has no access to the portfolio", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        portfolioPerformances: [PORTFOLIO_PERFORMANCE],
      });

      await expect(
        listPortfolioPerformances(unitOfWork as never, {
          actorId: ID.USER.OTHER,
          portfolioId: ID.PORTFOLIO.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the portfolio does not exist", async () => {
      await expect(
        listPortfolioPerformances(unitOfWork as never, {
          actorId: ACTOR_ID,
          portfolioId: ID.PORTFOLIO.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
