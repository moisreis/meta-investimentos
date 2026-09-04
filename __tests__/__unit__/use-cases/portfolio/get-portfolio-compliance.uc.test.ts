import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { Quota } from "@/business/entities/fund/quota.entity";
import { Application } from "@/business/entities/portfolio/application.entity";
import { Portfolio } from "@/business/entities/portfolio/portfolio.entity";
import { Position } from "@/business/entities/portfolio/position.entity";
import { Withdrawal } from "@/business/entities/portfolio/withdrawal.entity";
import { getPortfolioCompliance } from "@/business/use-cases/portfolio/get-portfolio-compliance.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import { QuotaPrice } from "@/business/value-objects/quota-price.vo";
import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";
import { NotFoundError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;
const OTHER_ACTOR_ID = ID.USER.OTHER;
const REFERENCE_DATE = new Date("2026-01-31T00:00:00.000Z");
const PERIOD_START = new Date("2026-01-01T00:00:00.000Z");

function portfolio(
  id: string,
  minAllocation: string,
  maxAllocation: string,
): Portfolio {
  return Portfolio.create(
    {
      acronym: "FIA",
      name: "Fundo",
      userId: EntityId.create(ACTOR_ID),
      annualInterestRate: SignedPercentage.create("10"),
      minAllocation: SignedPercentage.create(minAllocation),
      maxAllocation: SignedPercentage.create(maxAllocation),
      targetAllocation: SignedPercentage.create("12"),
    },
    id,
  );
}

function position(portfolioId: string, fundId: string, id: string): Position {
  return Position.create(
    {
      portfolioId: EntityId.create(portfolioId),
      fundId: EntityId.create(fundId),
    },
    id,
  );
}

function quota(
  fundId: string,
  price: string,
  id: string = ID.QUOTA.DEFAULT,
): Quota {
  return Quota.create(
    {
      fundId: EntityId.create(fundId),
      date: new Date("2026-01-15T00:00:00.000Z"),
      price: QuotaPrice.create(price),
    },
    id,
  );
}

function application(
  positionId: string,
  amount: string,
  quotas: string,
  id: string = ID.APPLICATION.DEFAULT,
): Application {
  return Application.create(
    {
      positionId: EntityId.create(positionId),
      date: new Date("2026-01-10T00:00:00.000Z"),
      amount: PositiveMoney.create(amount),
      quotas: QuotaQuantity.create(quotas),
    },
    id,
  );
}

function withdrawal(
  positionId: string,
  amount: string,
  quotas: string,
  id: string = ID.WITHDRAWAL.DEFAULT,
): Withdrawal {
  return Withdrawal.create(
    {
      positionId: EntityId.create(positionId),
      date: new Date("2026-01-20T00:00:00.000Z"),
      amount: PositiveMoney.create(amount),
      quotas: QuotaQuantity.create(quotas),
    },
    id,
  );
}

describe("getPortfolioCompliance", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("reports a compliant portfolio when all positions are within bounds", async () => {
      const p = portfolio(ID.PORTFOLIO.DEFAULT, "0", "100");
      const posA = position(
        ID.PORTFOLIO.DEFAULT,
        ID.FUND.DEFAULT,
        ID.POSITION.DEFAULT,
      );

      unitOfWork.seed({
        portfolios: [p],
        positions: [posA],
        applications: [application(ID.POSITION.DEFAULT, "1000", "10")],
        quotas: [quota(ID.FUND.DEFAULT, "10")],
      });

      const RESULT = await getPortfolioCompliance(unitOfWork as never, {
        actorId: ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
        referenceDate: REFERENCE_DATE,
      });

      expect(RESULT.portfolioId).toBe(EntityId.create(ID.PORTFOLIO.DEFAULT));
      expect(RESULT.positions).toHaveLength(1);
      expect(RESULT.positions[0].compliant).toBe(true);
      expect(RESULT.overallCompliant).toBe(true);
      expect(RESULT.violations).toEqual([]);
    });

    it("flags a position whose allocation is below the portfolio minimum", async () => {
      const p = portfolio(ID.PORTFOLIO.DEFAULT, "5", "100");
      const posA = position(
        ID.PORTFOLIO.DEFAULT,
        ID.FUND.DEFAULT,
        ID.POSITION.DEFAULT,
      );
      const posB = position(
        ID.PORTFOLIO.DEFAULT,
        ID.FUND.OTHER,
        ID.POSITION.OTHER,
      );

      unitOfWork.seed({
        portfolios: [p],
        positions: [posA, posB],
        applications: [
          application(ID.POSITION.DEFAULT, "100", "1", ID.APPLICATION.DEFAULT),
          application(ID.POSITION.OTHER, "19000", "190", ID.APPLICATION.OTHER),
        ],
        quotas: [
          quota(ID.FUND.DEFAULT, "10"),
          quota(ID.FUND.OTHER, "10", ID.QUOTA.OTHER),
        ],
      });

      const RESULT = await getPortfolioCompliance(unitOfWork as never, {
        actorId: ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
        referenceDate: REFERENCE_DATE,
      });

      expect(RESULT.overallCompliant).toBe(false);
      const belowMin = RESULT.positions.find(
        (x) => x.positionId === ID.POSITION.DEFAULT,
      );
      expect(belowMin?.compliant).toBe(false);
      expect(RESULT.violations).toContainEqual({
        positionId: EntityId.create(ID.POSITION.DEFAULT),
        reason: "allocation below portfolio minimum",
      });
    });

    it("flags a position whose allocation is above the portfolio maximum", async () => {
      const p = portfolio(ID.PORTFOLIO.DEFAULT, "0", "20");
      const posA = position(
        ID.PORTFOLIO.DEFAULT,
        ID.FUND.DEFAULT,
        ID.POSITION.DEFAULT,
      );
      const posB = position(
        ID.PORTFOLIO.DEFAULT,
        ID.FUND.OTHER,
        ID.POSITION.OTHER,
      );

      unitOfWork.seed({
        portfolios: [p],
        positions: [posA, posB],
        applications: [
          application(
            ID.POSITION.DEFAULT,
            "15000",
            "150",
            ID.APPLICATION.DEFAULT,
          ),
          application(ID.POSITION.OTHER, "500", "5", ID.APPLICATION.OTHER),
        ],
        quotas: [
          quota(ID.FUND.DEFAULT, "10"),
          quota(ID.FUND.OTHER, "10", ID.QUOTA.OTHER),
        ],
      });

      const RESULT = await getPortfolioCompliance(unitOfWork as never, {
        actorId: ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
        referenceDate: REFERENCE_DATE,
      });

      expect(RESULT.overallCompliant).toBe(false);
      const aboveMax = RESULT.positions.find(
        (x) => x.positionId === ID.POSITION.DEFAULT,
      );
      expect(aboveMax?.compliant).toBe(false);
      expect(RESULT.violations).toContainEqual({
        positionId: EntityId.create(ID.POSITION.DEFAULT),
        reason: "allocation above portfolio maximum",
      });
    });

    it("returns zero allocation when the position has no quota", async () => {
      const p = portfolio(ID.PORTFOLIO.DEFAULT, "0", "100");
      const posA = position(
        ID.PORTFOLIO.DEFAULT,
        ID.FUND.DEFAULT,
        ID.POSITION.DEFAULT,
      );

      unitOfWork.seed({
        portfolios: [p],
        positions: [posA],
        applications: [application(ID.POSITION.DEFAULT, "1000", "10")],
      });

      const RESULT = await getPortfolioCompliance(unitOfWork as never, {
        actorId: ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
        referenceDate: REFERENCE_DATE,
      });

      expect(RESULT.positions[0].currentAllocation).toBe("0.0000");
      expect(RESULT.positions[0].compliant).toBe(true);
    });

    it("returns an overall compliant result for a portfolio without positions", async () => {
      const p = portfolio(ID.PORTFOLIO.DEFAULT, "5", "20");

      unitOfWork.seed({ portfolios: [p] });

      const RESULT = await getPortfolioCompliance(unitOfWork as never, {
        actorId: ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
        referenceDate: REFERENCE_DATE,
      });

      expect(RESULT.positions).toEqual([]);
      expect(RESULT.overallCompliant).toBe(true);
      expect(RESULT.violations).toEqual([]);
    });
  });

  describe("errors", () => {
    it("throws NotFoundError when the portfolio does not exist", async () => {
      await expect(
        getPortfolioCompliance(unitOfWork as never, {
          actorId: ACTOR_ID,
          portfolioId: ID.PORTFOLIO.DEFAULT,
          referenceDate: REFERENCE_DATE,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the actor has no access", async () => {
      const p = portfolio(ID.PORTFOLIO.DEFAULT, "5", "20");

      unitOfWork.seed({ portfolios: [p] });

      await expect(
        getPortfolioCompliance(unitOfWork as never, {
          actorId: OTHER_ACTOR_ID,
          portfolioId: ID.PORTFOLIO.DEFAULT,
          referenceDate: REFERENCE_DATE,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("period filtering", () => {
    it("ignores applications and withdrawals outside the reference period", async () => {
      const p = portfolio(ID.PORTFOLIO.DEFAULT, "0", "100");
      const posA = position(
        ID.PORTFOLIO.DEFAULT,
        ID.FUND.DEFAULT,
        ID.POSITION.DEFAULT,
      );

      unitOfWork.seed({
        portfolios: [p],
        positions: [posA],
        applications: [application(ID.POSITION.DEFAULT, "1000", "10")],
        withdrawals: [withdrawal(ID.POSITION.DEFAULT, "2000", "20")],
        quotas: [quota(ID.FUND.DEFAULT, "10")],
      });

      const RESULT = await getPortfolioCompliance(unitOfWork as never, {
        actorId: ACTOR_ID,
        portfolioId: ID.PORTFOLIO.DEFAULT,
        referenceDate: PERIOD_START,
      });

      expect(RESULT.positions[0].currentAllocation).toBe("0.0000");
    });
  });
});
