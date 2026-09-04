import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { PORTFOLIO } from "@/__tests__/__helpers__/interfaces/_portfolio.test.helper";
import { PORTFOLIO_PERFORMANCE } from "@/__tests__/__helpers__/interfaces/_portfolio-performance.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { getPortfolioPerformance } from "@/business/use-cases/performance/get-portfolio-performance.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;

describe("getPortfolioPerformance", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("returns the performance for a portfolio owned by the actor", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        portfolioPerformances: [PORTFOLIO_PERFORMANCE],
      });

      const RESULT = await getPortfolioPerformance(unitOfWork as never, {
        actorId: ACTOR_ID,
        performanceId: ID.PORTFOLIO_PERFORMANCE.DEFAULT,
      });

      expect(RESULT.id).toBe(EntityId.create(ID.PORTFOLIO_PERFORMANCE.DEFAULT));
      expect(RESULT.portfolioId).toBe(EntityId.create(ID.PORTFOLIO.DEFAULT));
      expect(RESULT.patrimony).toBe(
        PORTFOLIO_PERFORMANCE.patrimony.value.toString(),
      );
    });

    it("returns the performance for a shared portfolio granted by permission", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        portfolioPerformances: [PORTFOLIO_PERFORMANCE],
        portfolioPermissions: [
          {
            id: EntityId.create("7a7b7c7d-7e7f-4a8b-9c0d-1e2f3a4b5c6d"),
            userId: EntityId.create(ID.USER.OTHER),
            portfolioId: PORTFOLIO.id as EntityId,
            role: "VIEWER" as const,
            grantedByUserId: PORTFOLIO.userId,
            createdAt: new Date(),
            updatedAt: new Date(),
          } as never,
        ],
      });

      const RESULT = await getPortfolioPerformance(unitOfWork as never, {
        actorId: ID.USER.OTHER,
        performanceId: ID.PORTFOLIO_PERFORMANCE.DEFAULT,
      });

      expect(RESULT.id).toBe(EntityId.create(ID.PORTFOLIO_PERFORMANCE.DEFAULT));
    });
  });

  describe("authorization", () => {
    it("throws NotFoundError when the actor has no access to the portfolio", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        portfolioPerformances: [PORTFOLIO_PERFORMANCE],
      });

      await expect(
        getPortfolioPerformance(unitOfWork as never, {
          actorId: ID.USER.OTHER,
          performanceId: ID.PORTFOLIO_PERFORMANCE.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the performance portfolio does not exist", async () => {
      unitOfWork.seed({
        portfolioPerformances: [PORTFOLIO_PERFORMANCE],
      });

      await expect(
        getPortfolioPerformance(unitOfWork as never, {
          actorId: ACTOR_ID,
          performanceId: ID.PORTFOLIO_PERFORMANCE.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("not found", () => {
    it("throws NotFoundError when the performance does not exist", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
      });

      await expect(
        getPortfolioPerformance(unitOfWork as never, {
          actorId: ACTOR_ID,
          performanceId: ID.PORTFOLIO_PERFORMANCE.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
