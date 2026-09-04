import { describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { Quota } from "@/business/entities/fund/quota.entity";
import { Application } from "@/business/entities/portfolio/application.entity";
import { Portfolio } from "@/business/entities/portfolio/portfolio.entity";
import { Position } from "@/business/entities/portfolio/position.entity";
import { recalculateAffectedPortfolios } from "@/business/use-cases/cvm/recalculate-affected-portfolios.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { PositiveMoney } from "@/business/value-objects/positive-money.vo";
import { QuotaPrice } from "@/business/value-objects/quota-price.vo";
import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";

const START = new Date("2026-01-01T00:00:00.000Z");
const END = new Date("2026-01-05T00:00:00.000Z");

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

const AFFECTED_POSITION = Position.create(
  {
    portfolioId: PORTFOLIO.id as EntityId,
    fundId: EntityId.create(ID.FUND.DEFAULT),
  },
  ID.POSITION.DEFAULT,
);

const OTHER_PORTFOLIO = Portfolio.create(
  {
    acronym: "RF",
    name: "Renda Fixa",
    userId: EntityId.create(ID.USER.OTHER),
    annualInterestRate: SignedPercentage.create("8"),
    minAllocation: SignedPercentage.create("10"),
    maxAllocation: SignedPercentage.create("30"),
    targetAllocation: SignedPercentage.create("18"),
  },
  ID.PORTFOLIO.OTHER,
);

const UNRELATED_POSITION = Position.create(
  {
    portfolioId: OTHER_PORTFOLIO.id as EntityId,
    fundId: EntityId.create(ID.FUND.OTHER),
  },
  ID.POSITION.OTHER,
);

const APPLICATION = Application.create(
  {
    positionId: AFFECTED_POSITION.id as EntityId,
    date: new Date("2026-01-01T00:00:00.000Z"),
    amount: PositiveMoney.create("1000"),
    quotas: QuotaQuantity.create("10"),
  },
  ID.APPLICATION.DEFAULT,
);

const QUOTA = Quota.create({
  fundId: EntityId.create(ID.FUND.DEFAULT),
  date: new Date("2026-01-03T00:00:00.000Z"),
  price: QuotaPrice.create("110"),
});

describe("recalculateAffectedPortfolios", () => {
  it("recalculates only the portfolios holding the imported funds", async () => {
    const UNIT = new FakeUnitOfWork();
    UNIT.seed({
      portfolios: [PORTFOLIO, OTHER_PORTFOLIO],
      positions: [AFFECTED_POSITION, UNRELATED_POSITION],
      applications: [APPLICATION],
      quotas: [QUOTA],
    });

    await recalculateAffectedPortfolios(UNIT as never, {
      importId: "cvm-import-1",
      fundIds: [ID.FUND.DEFAULT],
      startDate: START,
      endDate: END,
    });

    const affectedRows = await UNIT.positionPerformances.findAllByPositionId(
      AFFECTED_POSITION.id as EntityId,
    );
    const unrelatedRows = await UNIT.positionPerformances.findAllByPositionId(
      UNRELATED_POSITION.id as EntityId,
    );

    expect(affectedRows).toHaveLength(1);
    expect(unrelatedRows).toHaveLength(0);
  });

  it("does nothing when no position holds any of the imported funds", async () => {
    const UNIT = new FakeUnitOfWork();
    UNIT.seed({
      portfolios: [PORTFOLIO],
      positions: [AFFECTED_POSITION],
    });

    await expect(
      recalculateAffectedPortfolios(UNIT as never, {
        importId: "cvm-import-2",
        fundIds: [ID.FUND.OTHER],
        startDate: START,
        endDate: END,
      }),
    ).resolves.toBeUndefined();

    const rows = await UNIT.positionPerformances.findAllByPositionId(
      AFFECTED_POSITION.id as EntityId,
    );
    expect(rows).toHaveLength(0);
  });
});
