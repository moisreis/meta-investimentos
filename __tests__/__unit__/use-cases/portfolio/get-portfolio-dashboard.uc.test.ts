import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { Quota } from "@/business/entities/fund/quota.entity";
import { Application } from "@/business/entities/portfolio/application.entity";
import { Portfolio } from "@/business/entities/portfolio/portfolio.entity";
import { Position } from "@/business/entities/portfolio/position.entity";
import { Withdrawal } from "@/business/entities/portfolio/withdrawal.entity";
import { getPortfolioDashboard } from "@/business/use-cases/portfolio/get-portfolio-dashboard.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import { QuotaPrice } from "@/business/value-objects/quota-price.vo";
import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";
import { NotFoundError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;
const OTHER_ACTOR_ID = ID.USER.OTHER;
const REFERENCE_DATE = new Date("2026-01-31T00:00:00.000Z");

const PORTFOLIO = Portfolio.create(
  {
    acronym: "FIA",
    name: "Fundo",
    userId: EntityId.create(ACTOR_ID),
    annualInterestRate: SignedPercentage.create("10"),
    minAllocation: SignedPercentage.create("5"),
    maxAllocation: SignedPercentage.create("20"),
    targetAllocation: SignedPercentage.create("12"),
  },
  ID.PORTFOLIO.DEFAULT,
);

describe("getPortfolioDashboard", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("returns the dashboard for a portfolio with positions", async () => {
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
          date: new Date("2026-01-10T00:00:00.000Z"),
          amount: PositiveMoney.create("1000"),
          quotas: QuotaQuantity.create("10"),
        },
        ID.APPLICATION.DEFAULT,
      );
      const withdrawal = Withdrawal.create(
        {
          positionId: EntityId.create(ID.POSITION.DEFAULT),
          date: new Date("2026-01-20T00:00:00.000Z"),
          amount: PositiveMoney.create("500"),
          quotas: QuotaQuantity.create("4"),
        },
        ID.WITHDRAWAL.DEFAULT,
      );
      const quota = Quota.create(
        {
          fundId: EntityId.create(ID.FUND.DEFAULT),
          date: new Date("2026-01-15T00:00:00.000Z"),
          price: QuotaPrice.create("10"),
        },
        ID.QUOTA.DEFAULT,
      );

      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [position],
        applications: [application],
        withdrawals: [withdrawal],
        quotas: [quota],
      });

      const RESULT = await getPortfolioDashboard(unitOfWork as never, {
        actorId: ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
        referenceDate: REFERENCE_DATE,
      });

      expect(RESULT.portfolioId).toBe(EntityId.create(ID.PORTFOLIO.DEFAULT));
      expect(RESULT.referenceDate).toBe(REFERENCE_DATE);
      expect(RESULT.totalPatrimony).toBe("60");
      expect(RESULT.recentApplications).toBe(1);
      expect(RESULT.recentWithdrawals).toBe(1);
      expect(RESULT.allocationSeries).toHaveLength(1);
      expect(RESULT.allocationSeries[0].positionId).toBe(
        EntityId.create(ID.POSITION.DEFAULT),
      );
      expect(RESULT.allocationSeries[0].allocation).toBe("60");
      expect(RESULT.totalEarnings).toBe("-440");
    });

    it("sums applications and withdrawals across positions", async () => {
      const posA = Position.create(
        {
          portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
          fundId: EntityId.create(ID.FUND.DEFAULT),
        },
        ID.POSITION.DEFAULT,
      );
      const posB = Position.create(
        {
          portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
          fundId: EntityId.create(ID.FUND.OTHER),
        },
        ID.POSITION.OTHER,
      );
      const appA = Application.create(
        {
          positionId: EntityId.create(ID.POSITION.DEFAULT),
          date: new Date("2026-01-10T00:00:00.000Z"),
          amount: PositiveMoney.create("1000"),
          quotas: QuotaQuantity.create("10"),
        },
        ID.APPLICATION.DEFAULT,
      );
      const appB = Application.create(
        {
          positionId: EntityId.create(ID.POSITION.OTHER),
          date: new Date("2026-01-11T00:00:00.000Z"),
          amount: PositiveMoney.create("400"),
          quotas: QuotaQuantity.create("4"),
        },
        ID.APPLICATION.OTHER,
      );
      const quotaA = Quota.create(
        {
          fundId: EntityId.create(ID.FUND.DEFAULT),
          date: new Date("2026-01-15T00:00:00.000Z"),
          price: QuotaPrice.create("10"),
        },
        ID.QUOTA.DEFAULT,
      );
      const quotaB = Quota.create(
        {
          fundId: EntityId.create(ID.FUND.OTHER),
          date: new Date("2026-01-15T00:00:00.000Z"),
          price: QuotaPrice.create("5"),
        },
        ID.QUOTA.OTHER,
      );

      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [posA, posB],
        applications: [appA, appB],
        quotas: [quotaA, quotaB],
      });

      const RESULT = await getPortfolioDashboard(unitOfWork as never, {
        actorId: ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
        referenceDate: REFERENCE_DATE,
      });

      expect(RESULT.totalPatrimony).toBe("120");
      expect(RESULT.recentApplications).toBe(2);
      expect(RESULT.allocationSeries).toHaveLength(2);
    });

    it("returns zeroes for a portfolio without positions", async () => {
      unitOfWork.seed({ portfolios: [PORTFOLIO] });

      const RESULT = await getPortfolioDashboard(unitOfWork as never, {
        actorId: ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
        referenceDate: REFERENCE_DATE,
      });

      expect(RESULT.totalPatrimony).toBe("0");
      expect(RESULT.recentApplications).toBe(0);
      expect(RESULT.recentWithdrawals).toBe(0);
      expect(RESULT.allocationSeries).toEqual([]);
      expect(RESULT.totalEarnings).toBe("0");
    });

    it("treats a position without a quota as zero patrimony", async () => {
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
          date: new Date("2026-01-10T00:00:00.000Z"),
          amount: PositiveMoney.create("1000"),
          quotas: QuotaQuantity.create("10"),
        },
        ID.APPLICATION.DEFAULT,
      );

      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [position],
        applications: [application],
      });

      const RESULT = await getPortfolioDashboard(unitOfWork as never, {
        actorId: ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
        referenceDate: REFERENCE_DATE,
      });

      expect(RESULT.totalPatrimony).toBe("0");
      expect(RESULT.allocationSeries[0].patrimony).toBe("0");
    });
  });

  describe("errors", () => {
    it("throws NotFoundError when the portfolio does not exist", async () => {
      await expect(
        getPortfolioDashboard(unitOfWork as never, {
          actorId: ACTOR_ID,
          portfolioId: ID.PORTFOLIO.DEFAULT,
          referenceDate: REFERENCE_DATE,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the actor has no access", async () => {
      unitOfWork.seed({ portfolios: [PORTFOLIO] });

      await expect(
        getPortfolioDashboard(unitOfWork as never, {
          actorId: OTHER_ACTOR_ID,
          portfolioId: ID.PORTFOLIO.DEFAULT,
          referenceDate: REFERENCE_DATE,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
