import { describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { Quota } from "@/business/entities/fund/quota.entity";
import { Application } from "@/business/entities/portfolio/application.entity";
import { Portfolio } from "@/business/entities/portfolio/portfolio.entity";
import { Position } from "@/business/entities/portfolio/position.entity";
import { recalculatePerformanceForPeriod } from "@/business/use-cases/performance/recalculate-performance-for-period.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import { QuotaPrice } from "@/business/value-objects/quota-price.vo";
import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";

const PORTFOLIO = Portfolio.create(
  {
    acronym: "FIA",
    name: "Fundo de Investimento em Ações",
    userId: EntityId.create(ID.USER.DEFAULT),
    annualInterestRate: SignedPercentage.create("10"),
    minAllocation: SignedPercentage.create("5"),
    maxAllocation: SignedPercentage.create("20"),
    targetAllocation: SignedPercentage.create("12"),
  },
  ID.PORTFOLIO.DEFAULT,
);

const POSITION = Position.create(
  {
    portfolioId: PORTFOLIO.id as EntityId,
    fundId: EntityId.create(ID.FUND.DEFAULT),
  },
  ID.POSITION.DEFAULT,
);

const APPLICATION = Application.create(
  {
    positionId: POSITION.id as EntityId,
    date: new Date("2026-01-01T00:00:00.000Z"),
    amount: PositiveMoney.create("1000"),
    quotas: QuotaQuantity.create("10"),
  },
  ID.APPLICATION.DEFAULT,
);

const QUOTA_JAN_03 = Quota.create({
  fundId: EntityId.create(ID.FUND.DEFAULT),
  date: new Date("2026-01-03T00:00:00.000Z"),
  price: QuotaPrice.create("110"),
});

const QUOTA_JAN_05 = Quota.create({
  fundId: EntityId.create(ID.FUND.DEFAULT),
  date: new Date("2026-01-05T00:00:00.000Z"),
  price: QuotaPrice.create("121"),
});

function buildUnitOfWork(): FakeUnitOfWork {
  const UNIT = new FakeUnitOfWork();
  UNIT.seed({
    portfolios: [PORTFOLIO],
    positions: [POSITION],
    applications: [APPLICATION],
    quotas: [QUOTA_JAN_03, QUOTA_JAN_05],
  });
  return UNIT;
}

const BASE_INPUT = {
  portfolioId: ID.PORTFOLIO.DEFAULT,
  anchor: new Date("2026-01-05T00:00:00.000Z"),
};

describe("recalculatePerformanceForPeriod", () => {
  it("recalculates a date period using the anchor as the reference date", async () => {
    const UNIT = buildUnitOfWork();

    await recalculatePerformanceForPeriod(UNIT as never, {
      ...BASE_INPUT,
      period: "date",
    });

    const positionRows = await UNIT.positionPerformances.findAllByPositionId(
      POSITION.id as EntityId,
    );
    expect(positionRows.map((R) => R.date.toISOString().slice(0, 10))).toEqual([
      "2026-01-05",
    ]);
  });

  it("carries forward the last known quota on the anchor date", async () => {
    const UNIT = buildUnitOfWork();

    await recalculatePerformanceForPeriod(UNIT as never, {
      ...BASE_INPUT,
      period: "date",
      anchor: new Date("2026-01-06T00:00:00.000Z"),
    });

    const positionRows = await UNIT.positionPerformances.findAllByPositionId(
      POSITION.id as EntityId,
    );
    const LAST = positionRows[positionRows.length - 1];
    expect(LAST.date.toISOString().slice(0, 10)).toBe("2026-01-06");
    expect(LAST.patrimony.value.toString()).toBe("1210");
  });

  it("recalculates a trailing-12m period", async () => {
    const UNIT = buildUnitOfWork();

    await recalculatePerformanceForPeriod(UNIT as never, {
      ...BASE_INPUT,
      period: "trailing-12m",
    });

    const positionRows = await UNIT.positionPerformances.findAllByPositionId(
      POSITION.id as EntityId,
    );
    expect(positionRows.length).toBeGreaterThan(0);
  });

  it("throws when a range period is provided without an endDate", async () => {
    const UNIT = buildUnitOfWork();

    await expect(
      recalculatePerformanceForPeriod(UNIT as never, {
        ...BASE_INPUT,
        period: "range",
      }),
    ).rejects.toThrow(/requires endDate/);
  });
});
