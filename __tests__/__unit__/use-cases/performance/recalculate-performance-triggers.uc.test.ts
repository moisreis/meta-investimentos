import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import {
  OTHER_PORTFOLIO,
  PORTFOLIO,
} from "@/__tests__/__helpers__/interfaces/_portfolio.test.helper";
import {
  OTHER_POSITION,
  POSITION,
} from "@/__tests__/__helpers__/interfaces/_position.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { Quota } from "@/business/entities/fund/quota.entity";
import {
  recalculatePerformanceForAllPortfolios,
  recalculatePerformanceForFunds,
  recalculatePerformanceForPortfolios,
} from "@/business/use-cases/performance/recalculate-performance-triggers";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { QuotaPrice } from "@/business/value-objects/quota-price.vo";

const ACTOR_ID = ID.USER.DEFAULT;

const FIRST_DATE = new Date("2026-02-02T00:00:00.000Z");
const SECOND_DATE = new Date("2026-02-20T00:00:00.000Z");

function quota(fundId: EntityId, date: Date, price: string): Quota {
  return Quota.create({ fundId, date, price: QuotaPrice.create(price) });
}

function hasPortfolioPerformance(
  unitOfWork: FakeUnitOfWork,
  portfolioId: string,
  date: Date,
): Promise<boolean> {
  return unitOfWork.portfolioPerformances
    .findAllByPortfolioId(EntityId.create(portfolioId))
    .then((rows) =>
      rows.some((performance) => performance.date.getTime() === date.getTime()),
    );
}

describe("recalculate-performance-triggers", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("recalculatePerformanceForFunds", () => {
    it("recalculates only the portfolios holding the affected fund", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO, OTHER_PORTFOLIO],
        positions: [POSITION, OTHER_POSITION],
        quotas: [
          quota(POSITION.fundId, FIRST_DATE, "100"),
          quota(OTHER_POSITION.fundId, FIRST_DATE, "50"),
        ],
      });

      await recalculatePerformanceForFunds(unitOfWork as never, {
        fundIds: [ID.FUND.DEFAULT],
        startDate: FIRST_DATE,
        endDate: FIRST_DATE,
        actorId: ACTOR_ID,
      });

      expect(
        await hasPortfolioPerformance(
          unitOfWork,
          ID.PORTFOLIO.DEFAULT,
          FIRST_DATE,
        ),
      ).toBe(true);
      expect(
        await hasPortfolioPerformance(
          unitOfWork,
          ID.PORTFOLIO.OTHER,
          FIRST_DATE,
        ),
      ).toBe(false);
    });

    it("propagates a correction to every date from the corrected date forward", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        quotas: [
          quota(POSITION.fundId, FIRST_DATE, "100"),
          quota(POSITION.fundId, SECOND_DATE, "110"),
        ],
      });

      await recalculatePerformanceForFunds(unitOfWork as never, {
        fundIds: [ID.FUND.DEFAULT],
        startDate: FIRST_DATE,
        endDate: SECOND_DATE,
        actorId: ACTOR_ID,
      });

      expect(
        await hasPortfolioPerformance(
          unitOfWork,
          ID.PORTFOLIO.DEFAULT,
          FIRST_DATE,
        ),
      ).toBe(true);
      expect(
        await hasPortfolioPerformance(
          unitOfWork,
          ID.PORTFOLIO.DEFAULT,
          SECOND_DATE,
        ),
      ).toBe(true);
    });

    it("does not write performance rows when no portfolio holds the fund", async () => {
      unitOfWork.seed({
        portfolios: [OTHER_PORTFOLIO],
        positions: [OTHER_POSITION],
        quotas: [quota(OTHER_POSITION.fundId, FIRST_DATE, "50")],
      });

      await recalculatePerformanceForFunds(unitOfWork as never, {
        fundIds: [ID.FUND.DEFAULT],
        startDate: FIRST_DATE,
        endDate: FIRST_DATE,
        actorId: ACTOR_ID,
      });

      const rows = await unitOfWork.portfolioPerformances.findAllByPortfolioId(
        EntityId.create(ID.PORTFOLIO.OTHER),
      );
      expect(rows).toHaveLength(0);
    });

    it("attributes the recalculation to the triggering actor", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [POSITION],
        quotas: [quota(POSITION.fundId, FIRST_DATE, "100")],
      });

      await recalculatePerformanceForFunds(unitOfWork as never, {
        fundIds: [ID.FUND.DEFAULT],
        startDate: FIRST_DATE,
        endDate: FIRST_DATE,
        actorId: ACTOR_ID,
      });

      expect(unitOfWork.ranAsActors).toHaveLength(1);
      expect(unitOfWork.lastActor?.userId).toBe(EntityId.create(ACTOR_ID));
    });

    it("no-ops for an empty fund list", async () => {
      await expect(
        recalculatePerformanceForFunds(unitOfWork as never, {
          fundIds: [],
          startDate: FIRST_DATE,
          endDate: FIRST_DATE,
          actorId: ACTOR_ID,
        }),
      ).resolves.toBeUndefined();
    });
  });

  describe("recalculatePerformanceForAllPortfolios", () => {
    it("recalculates every portfolio", async () => {
      unitOfWork.seed({
        portfolios: [PORTFOLIO, OTHER_PORTFOLIO],
        positions: [POSITION, OTHER_POSITION],
        quotas: [
          quota(POSITION.fundId, FIRST_DATE, "100"),
          quota(OTHER_POSITION.fundId, FIRST_DATE, "50"),
        ],
      });

      await recalculatePerformanceForAllPortfolios(unitOfWork as never, {
        startDate: FIRST_DATE,
        endDate: FIRST_DATE,
        actorId: ACTOR_ID,
      });

      expect(
        await hasPortfolioPerformance(
          unitOfWork,
          ID.PORTFOLIO.DEFAULT,
          FIRST_DATE,
        ),
      ).toBe(true);
      expect(
        await hasPortfolioPerformance(
          unitOfWork,
          ID.PORTFOLIO.OTHER,
          FIRST_DATE,
        ),
      ).toBe(true);
    });

    it("no-ops when no portfolio exists", async () => {
      await expect(
        recalculatePerformanceForAllPortfolios(unitOfWork as never, {
          startDate: FIRST_DATE,
          endDate: FIRST_DATE,
          actorId: ACTOR_ID,
        }),
      ).resolves.toBeUndefined();
    });
  });

  describe("recalculatePerformanceForPortfolios", () => {
    it("no-ops for a missing portfolio and still records the actor", async () => {
      await expect(
        recalculatePerformanceForPortfolios(unitOfWork as never, {
          portfolioIds: [ID.PORTFOLIO.DEFAULT],
          startDate: FIRST_DATE,
          endDate: FIRST_DATE,
          actorId: ACTOR_ID,
        }),
      ).resolves.toBeUndefined();

      expect(unitOfWork.lastActor?.userId).toBe(EntityId.create(ACTOR_ID));
    });

    it("no-ops for an empty portfolio list", async () => {
      await expect(
        recalculatePerformanceForPortfolios(unitOfWork as never, {
          portfolioIds: [],
          startDate: FIRST_DATE,
          endDate: FIRST_DATE,
          actorId: ACTOR_ID,
        }),
      ).resolves.toBeUndefined();
    });
  });
});
