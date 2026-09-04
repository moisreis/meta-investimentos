import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import {
  OTHER_PORTFOLIO,
  PORTFOLIO,
} from "@/__tests__/__helpers__/interfaces/_portfolio.test.helper";
import {
  QUOTA,
  QUOTA_DATE,
} from "@/__tests__/__helpers__/interfaces/_quota.test.helper";
import { USER } from "@/__tests__/__helpers__/interfaces/_user.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { Application } from "@/business/entities/portfolio/application.entity";
import { Position } from "@/business/entities/portfolio/position.entity";
import { Withdrawal } from "@/business/entities/portfolio/withdrawal.entity";
import { getPortfolioMarketValue } from "@/business/use-cases/portfolio/get-portfolio-market-value.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";
import { NotFoundError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;

describe("getPortfolioMarketValue", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("computes total market value with applications and withdrawals", async () => {
      const position = Position.create(
        {
          portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
          fundId: EntityId.create(ID.FUND.DEFAULT),
        },
        ID.POSITION.DEFAULT,
      );

      const application = Application.create(
        {
          positionId: EntityId.create(ID.POSITION.DEFAULT),
          date: new Date("2026-01-01T00:00:00.000Z"),
          amount: PositiveMoney.create("10000.00"),
          quotas: QuotaQuantity.create("10.0"),
        },
        ID.APPLICATION.DEFAULT,
      );

      const withdrawal = Withdrawal.create(
        {
          positionId: EntityId.create(ID.POSITION.DEFAULT),
          date: new Date("2026-01-03T00:00:00.000Z"),
          amount: PositiveMoney.create("2000.00"),
          quotas: QuotaQuantity.create("2.0"),
        },
        ID.WITHDRAWAL.DEFAULT,
      );

      unitOfWork.seed({
        users: [USER],
        portfolios: [PORTFOLIO],
        positions: [position],
        quotas: [QUOTA],
        applications: [application],
        withdrawals: [withdrawal],
      });

      const RESULT = await getPortfolioMarketValue(unitOfWork as never, {
        actorId: ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
        referenceDate: QUOTA_DATE,
      });

      expect(RESULT.portfolioId.toString()).toBe(ID.PORTFOLIO.DEFAULT);
      expect(RESULT.positionCount).toBe(1);
      expect(RESULT.totalMarketValue).toBe("8000.00");

      const pos = RESULT.positions[0];
      expect(pos.quotasHeld).toBe("8");
      expect(pos.quotaPrice).toBe("1000");
      expect(pos.marketValue).toBe("8000.00");
    });

    it("returns 0.00 when no quota exists for the reference date", async () => {
      const position = Position.create(
        {
          portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
          fundId: EntityId.create(ID.FUND.DEFAULT),
        },
        ID.POSITION.DEFAULT,
      );

      unitOfWork.seed({
        users: [USER],
        portfolios: [PORTFOLIO],
        positions: [position],
      });

      const RESULT = await getPortfolioMarketValue(unitOfWork as never, {
        actorId: ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
        referenceDate: QUOTA_DATE,
      });

      expect(RESULT.totalMarketValue).toBe("0.00");
      expect(RESULT.positions[0].quotaPrice).toBeNull();
    });

    it("returns empty result when portfolio has no positions", async () => {
      unitOfWork.seed({
        users: [USER],
        portfolios: [PORTFOLIO],
      });

      const RESULT = await getPortfolioMarketValue(unitOfWork as never, {
        actorId: ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
        referenceDate: QUOTA_DATE,
      });

      expect(RESULT.positionCount).toBe(0);
      expect(RESULT.totalMarketValue).toBe("0.00");
      expect(RESULT.positions).toHaveLength(0);
    });
  });

  describe("authorization", () => {
    it("throws NotFoundError when the portfolio is not accessible", async () => {
      unitOfWork.seed({
        users: [USER],
        portfolios: [OTHER_PORTFOLIO],
      });

      await expect(
        getPortfolioMarketValue(unitOfWork as never, {
          actorId: ACTOR_ID,
          portfolioId: ID.PORTFOLIO.DEFAULT,
          referenceDate: QUOTA_DATE,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
