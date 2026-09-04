import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { PORTFOLIO } from "@/__tests__/__helpers__/interfaces/_portfolio.test.helper";
import {
  QUOTA,
  QUOTA_DATE,
} from "@/__tests__/__helpers__/interfaces/_quota.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { Application } from "@/business/entities/portfolio/application.entity";
import { Position } from "@/business/entities/portfolio/position.entity";
import { Withdrawal } from "@/business/entities/portfolio/withdrawal.entity";
import { calculatePositionMarketValue } from "@/business/use-cases/position/calculate-position-market-value.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";
import { NotFoundError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;

describe("calculatePositionMarketValue", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("computes market value with a quota, applications, and withdrawals", async () => {
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
        portfolios: [PORTFOLIO],
        positions: [position],
        quotas: [QUOTA],
        applications: [application],
        withdrawals: [withdrawal],
      });

      const RESULT = await calculatePositionMarketValue(unitOfWork as never, {
        actorId: ACTOR_ID,
        positionId: ID.POSITION.DEFAULT,
        referenceDate: QUOTA_DATE,
      });

      expect(RESULT.positionId).toBe(ID.POSITION.DEFAULT);
      expect(RESULT.fundId).toBe(ID.FUND.DEFAULT);
      expect(RESULT.quotasHeld).toBe("8");
      expect(RESULT.quotaPrice).toBe("1000");
      expect(RESULT.marketValue).toBe("8000.00");
    });

    it("returns market value 0.00 when no quota exists", async () => {
      const position = Position.create(
        {
          portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
          fundId: EntityId.create(ID.FUND.DEFAULT),
        },
        ID.POSITION.DEFAULT,
      );

      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [position],
      });

      const RESULT = await calculatePositionMarketValue(unitOfWork as never, {
        actorId: ACTOR_ID,
        positionId: ID.POSITION.DEFAULT,
        referenceDate: QUOTA_DATE,
      });

      expect(RESULT.quotasHeld).toBe("0");
      expect(RESULT.quotaPrice).toBeNull();
      expect(RESULT.marketValue).toBe("0.00");
    });

    it("computes market value with no applications or withdrawals", async () => {
      const position = Position.create(
        {
          portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
          fundId: EntityId.create(ID.FUND.DEFAULT),
        },
        ID.POSITION.DEFAULT,
      );

      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [position],
        quotas: [QUOTA],
      });

      const RESULT = await calculatePositionMarketValue(unitOfWork as never, {
        actorId: ACTOR_ID,
        positionId: ID.POSITION.DEFAULT,
        referenceDate: QUOTA_DATE,
      });

      expect(RESULT.quotasHeld).toBe("0");
      expect(RESULT.marketValue).toBe("0.00");
    });

    it("computes market value with applications only", async () => {
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
          date: new Date("2026-01-02T00:00:00.000Z"),
          amount: PositiveMoney.create("5000.00"),
          quotas: QuotaQuantity.create("5.0"),
        },
        ID.APPLICATION.DEFAULT,
      );

      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [position],
        quotas: [QUOTA],
        applications: [application],
      });

      const RESULT = await calculatePositionMarketValue(unitOfWork as never, {
        actorId: ACTOR_ID,
        positionId: ID.POSITION.DEFAULT,
        referenceDate: QUOTA_DATE,
      });

      expect(RESULT.quotasHeld).toBe("5");
      expect(RESULT.marketValue).toBe("5000.00");
    });
  });

  describe("not found", () => {
    it("throws NotFoundError when the position does not exist", async () => {
      unitOfWork.seed({ portfolios: [PORTFOLIO] });

      await expect(
        calculatePositionMarketValue(unitOfWork as never, {
          actorId: ACTOR_ID,
          positionId: ID.POSITION.DEFAULT,
          referenceDate: QUOTA_DATE,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the portfolio does not exist", async () => {
      const position = Position.create(
        {
          portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
          fundId: EntityId.create(ID.FUND.DEFAULT),
        },
        ID.POSITION.DEFAULT,
      );

      unitOfWork.seed({ positions: [position] });

      await expect(
        calculatePositionMarketValue(unitOfWork as never, {
          actorId: ACTOR_ID,
          positionId: ID.POSITION.DEFAULT,
          referenceDate: QUOTA_DATE,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("access denied", () => {
    it("throws NotFoundError when the user has no access", async () => {
      const position = Position.create(
        {
          portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
          fundId: EntityId.create(ID.FUND.DEFAULT),
        },
        ID.POSITION.DEFAULT,
      );

      unitOfWork.seed({
        portfolios: [PORTFOLIO],
        positions: [position],
      });

      await expect(
        calculatePositionMarketValue(unitOfWork as never, {
          actorId: ID.USER.OTHER,
          positionId: ID.POSITION.DEFAULT,
          referenceDate: QUOTA_DATE,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
