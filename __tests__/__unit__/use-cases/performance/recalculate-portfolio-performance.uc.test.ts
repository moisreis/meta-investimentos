import { describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { Benchmark } from "@/business/entities/benchmark/benchmark.entity";
import { BenchmarkHistory } from "@/business/entities/benchmark/benchmark-history.entity";
import { Quota } from "@/business/entities/fund/quota.entity";
import { Application } from "@/business/entities/portfolio/application.entity";
import { Portfolio } from "@/business/entities/portfolio/portfolio.entity";
import { Position } from "@/business/entities/portfolio/position.entity";
import { recalculatePortfolioPerformance } from "@/business/use-cases/performance/recalculate-portfolio-performance.uc";
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

const QUOTA_JAN_04 = Quota.create({
  fundId: EntityId.create(ID.FUND.DEFAULT),
  date: new Date("2026-01-04T00:00:00.000Z"),
  price: QuotaPrice.create("121"),
});

const BENCHMARK_IPCA = Benchmark.create(
  {
    acronym: "IPCA",
    name: "IPCA",
  },
  ID.BENCHMARK.DEFAULT,
);

const BENCHMARK_CDI = Benchmark.create(
  {
    acronym: "CDI",
    name: "CDI",
  },
  ID.BENCHMARK.OTHER,
);

const BENCHMARK_IBOV = Benchmark.create(
  {
    acronym: "IBOV",
    name: "Ibovespa",
  },
  "6a7b8c9d-0e1f-4a2b-9c3d-4e5f6a7b8c9f",
);

function monthlyHistory(
  benchmark: Benchmark,
  month: string,
  rate: string,
): BenchmarkHistory {
  return BenchmarkHistory.create({
    benchmarkId: benchmark.id as EntityId,
    date: new Date(`${month}-05T00:00:00.000Z`),
    rate: SignedPercentage.create(rate),
  });
}

function buildUnitOfWork(): FakeUnitOfWork {
  const UNIT = new FakeUnitOfWork();
  UNIT.seed({
    portfolios: [PORTFOLIO],
    positions: [POSITION],
    applications: [APPLICATION],
    quotas: [QUOTA_JAN_03, QUOTA_JAN_04],
  });
  return UNIT;
}

describe("recalculatePortfolioPerformance", () => {
  it("writes position and portfolio performance rows for each quota date", async () => {
    const UNIT = buildUnitOfWork();

    await recalculatePortfolioPerformance(UNIT as never, {
      portfolioIds: [ID.PORTFOLIO.DEFAULT],
      startDate: START,
      endDate: END,
    });

    const positionRows = await UNIT.positionPerformances.findAllByPositionId(
      POSITION.id as EntityId,
    );
    const portfolioRows = await UNIT.portfolioPerformances.findAllByPortfolioId(
      PORTFOLIO.id as EntityId,
    );

    expect(positionRows).toHaveLength(2);
    expect(portfolioRows).toHaveLength(2);

    const LAST = positionRows[positionRows.length - 1];
    expect(LAST.quotasHeld.value.toString()).toBe("10");
    expect(LAST.patrimony.value.toString()).toBe("1210");
    expect(LAST.returnMonthly).not.toBeNull();

    const PORTFOLIO_LAST = portfolioRows[portfolioRows.length - 1];
    expect(PORTFOLIO_LAST.patrimony.value.toString()).toBe("1210");
  });

  it("is idempotent when re-run over the same range", async () => {
    const UNIT = buildUnitOfWork();
    const INPUT = {
      portfolioIds: [ID.PORTFOLIO.DEFAULT],
      startDate: START,
      endDate: END,
    };

    await recalculatePortfolioPerformance(UNIT as never, INPUT);
    await recalculatePortfolioPerformance(UNIT as never, INPUT);

    const positionRows = await UNIT.positionPerformances.findAllByPositionId(
      POSITION.id as EntityId,
    );
    const portfolioRows = await UNIT.portfolioPerformances.findAllByPortfolioId(
      PORTFOLIO.id as EntityId,
    );

    expect(positionRows).toHaveLength(2);
    expect(portfolioRows).toHaveLength(2);
  });

  it("does not write rows when the fund has no quota data in the period", async () => {
    const UNIT = new FakeUnitOfWork();
    UNIT.seed({
      portfolios: [PORTFOLIO],
      positions: [POSITION],
      applications: [APPLICATION],
    });

    await recalculatePortfolioPerformance(UNIT as never, {
      portfolioIds: [ID.PORTFOLIO.DEFAULT],
      startDate: START,
      endDate: END,
    });

    const positionRows = await UNIT.positionPerformances.findAllByPositionId(
      POSITION.id as EntityId,
    );
    const portfolioRows = await UNIT.portfolioPerformances.findAllByPortfolioId(
      PORTFOLIO.id as EntityId,
    );

    expect(positionRows).toHaveLength(0);
    expect(portfolioRows).toHaveLength(0);
  });

  it("ignores a portfolio id that does not exist", async () => {
    const UNIT = buildUnitOfWork();

    await expect(
      recalculatePortfolioPerformance(UNIT as never, {
        portfolioIds: [ID.PORTFOLIO.THIRD],
        startDate: START,
        endDate: END,
      }),
    ).resolves.toBeUndefined();

    const portfolioRows = await UNIT.portfolioPerformances.findAllByPortfolioId(
      PORTFOLIO.id as EntityId,
    );
    expect(portfolioRows).toHaveLength(0);
  });

  it("wires the benchmark spreads (IPCA/CDI/IBOV) into portfolio rows", async () => {
    const UNIT = buildUnitOfWork();
    UNIT.seed({
      benchmarks: [BENCHMARK_IPCA, BENCHMARK_CDI, BENCHMARK_IBOV],
      benchmarkHistories: [
        monthlyHistory(BENCHMARK_IPCA, "2026-01", "1.25"),
        monthlyHistory(BENCHMARK_CDI, "2026-01", "0.9"),
        monthlyHistory(BENCHMARK_IBOV, "2026-01", "2.5"),
      ],
    });

    await recalculatePortfolioPerformance(UNIT as never, {
      portfolioIds: [ID.PORTFOLIO.DEFAULT],
      startDate: START,
      endDate: END,
    });

    const portfolioRows = await UNIT.portfolioPerformances.findAllByPortfolioId(
      PORTFOLIO.id as EntityId,
    );
    const LAST = portfolioRows[portfolioRows.length - 1];

    expect(LAST.inflationSpread?.value.toString()).toBe("8.75");
    expect(LAST.riskFreeSpread?.value.toString()).toBe("9.1");
    expect(LAST.marketSpread?.value.toString()).toBe("7.5");
    expect(LAST.target?.value.toString()).toBe("2.06");
    expect(LAST.cumulativeTarget?.value.toString()).toBe("2.06");
  });
});
