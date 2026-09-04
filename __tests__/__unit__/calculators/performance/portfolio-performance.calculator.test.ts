import Decimal from "decimal.js";
import { describe, expect, it } from "vitest";

import { calculatePortfolioPerformance } from "@/business/calculators";
import { GrowthFactor } from "@/business/value-objects/growth-factor.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";

const DATE = new Date("2026-01-05T00:00:00.000Z");

type PortfolioPerformanceInput = Parameters<
  typeof calculatePortfolioPerformance
>[0];

function buildInput(
  overrides: Partial<PortfolioPerformanceInput> = {},
): PortfolioPerformanceInput {
  return {
    portfolioId: "0e1f2a3b-4c5d-4e6f-9a7b-8c9d0e1f2a3b",
    date: DATE,
    portfolioValue: new Decimal("10000"),
    sumOfInitialBalances: new Decimal("5000"),
    applicationTotal: new Decimal("2000"),
    applicationQuotas: new Decimal("20"),
    withdrawalTotal: new Decimal("500"),
    withdrawalQuotas: new Decimal("5"),
    dailyGrowthFactor: null,
    trailingPeriods: {},
    monthlyTarget: null,
    cumulativeTargets: [],
    monthlyBenchmarkRates: [],
    trailingMonthlyReturn: null,
    inflationIndexReturn: null,
    riskFreeIndexReturn: null,
    marketIndexReturn: null,
    ...overrides,
  };
}

describe("calculatePortfolioPerformance", () => {
  it("computes the portfolio performance row from the provided inputs", () => {
    const RESULT = calculatePortfolioPerformance(
      buildInput({
        portfolioValue: new Decimal("10000"),
        sumOfInitialBalances: new Decimal("5000"),
        applicationTotal: new Decimal("2000"),
        applicationQuotas: new Decimal("20"),
        withdrawalTotal: new Decimal("500"),
        withdrawalQuotas: new Decimal("5"),
        dailyGrowthFactor: GrowthFactor.create("1.02"),
      }),
    );

    expect(RESULT.portfolioId).toBe("0e1f2a3b-4c5d-4e6f-9a7b-8c9d0e1f2a3b");
    expect(RESULT.date.getTime()).toBe(DATE.getTime());
    expect(RESULT.quotasHeld.value.toString()).toBe("15");
    expect(RESULT.patrimony.value.toString()).toBe("10000");
    expect(RESULT.applicationTotal.value.toString()).toBe("2000");
    expect(RESULT.redemptionTotal.value.toString()).toBe("500");
    expect(RESULT.cashFlowNet.value.toString()).toBe("1500");
    expect(RESULT.earnings.value.toString()).toBe("3500");
    expect(RESULT.returnDaily.value.toString()).toBe("2");
  });

  it("floors the quotas held at zero when withdrawals exceed applications", () => {
    const RESULT = calculatePortfolioPerformance(
      buildInput({
        applicationQuotas: new Decimal("3"),
        withdrawalQuotas: new Decimal("10"),
      }),
    );

    expect(RESULT.quotasHeld.value.toString()).toBe("0");
  });

  it("computes the trailing-period returns and cumulative target", () => {
    const RESULT = calculatePortfolioPerformance(
      buildInput({
        trailingPeriods: {
          monthly: [GrowthFactor.create("1.01"), GrowthFactor.create("1.02")],
          yearly: [GrowthFactor.create("1.05")],
          last12m: [GrowthFactor.create("1.10")],
        },
        cumulativeTargets: [
          SignedPercentage.create("1"),
          SignedPercentage.create("2"),
        ],
      }),
    );

    expect(RESULT.returnMonthly?.value.toString()).toBe("3.02");
    expect(RESULT.returnYearly?.value.toString()).toBe("5");
    expect(RESULT.returnLast12m?.value.toString()).toBe("10");
    expect(RESULT.cumulativeTarget?.value.toString()).toBe("3.02");
  });

  it("computes the benchmark spreads from the trailing return and index returns", () => {
    const RESULT = calculatePortfolioPerformance(
      buildInput({
        trailingMonthlyReturn: SignedPercentage.create("5"),
        inflationIndexReturn: SignedPercentage.create("2"),
        riskFreeIndexReturn: SignedPercentage.create("1"),
        marketIndexReturn: SignedPercentage.create("3"),
        monthlyTarget: SignedPercentage.create("0.5"),
      }),
    );

    expect(RESULT.inflationSpread?.value.toString()).toBe("3");
    expect(RESULT.riskFreeSpread?.value.toString()).toBe("4");
    expect(RESULT.marketSpread?.value.toString()).toBe("2");
    expect(RESULT.target?.value.toString()).toBe("0.5");
  });

  it("leaves spreads, target and returns null when the inputs are absent", () => {
    const RESULT = calculatePortfolioPerformance(buildInput());

    expect(RESULT.returnMonthly).toBeNull();
    expect(RESULT.returnYearly).toBeNull();
    expect(RESULT.returnLast12m).toBeNull();
    expect(RESULT.cumulativeTarget?.value.toString()).toBe("0");
    expect(RESULT.inflationSpread).toBeNull();
    expect(RESULT.riskFreeSpread).toBeNull();
    expect(RESULT.marketSpread).toBeNull();
    expect(RESULT.target).toBeNull();
    expect(RESULT.returnDaily.value.toString()).toBe("0");
  });
});
