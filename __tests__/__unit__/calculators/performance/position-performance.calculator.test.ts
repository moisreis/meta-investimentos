import Decimal from "decimal.js";
import { describe, expect, it } from "vitest";

import { calculatePositionPerformance } from "@/business/calculators";
import type { PositionFlowTotals } from "@/business/calculators/performance/position-performance.calculator";
import { GrowthFactor } from "@/business/value-objects/growth-factor.vo";
import { QuotaPrice } from "@/business/value-objects/quota-price.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";

const DATE = new Date("2026-01-05T00:00:00.000Z");

const FLOW_TOTALS: PositionFlowTotals = {
  applicationAmount: new Decimal("1000"),
  applicationQuotas: new Decimal("10"),
  withdrawalAmount: new Decimal("200"),
  withdrawalQuotas: new Decimal("2"),
};

function buildInput(
  overrides: Partial<Parameters<typeof calculatePositionPerformance>[0]> = {},
) {
  return {
    positionId: "2a3b4c5d-6e7f-4a8b-9c0d-1e2f3a4b5c6d",
    date: DATE,
    flowTotals: FLOW_TOTALS,
    dailyGrowthFactor: null,
    trailingPeriods: {},
    quotaPrice: QuotaPrice.create("100"),
    allocation: new Decimal("40"),
    initialBalance: new Decimal("0"),
    ...overrides,
  };
}

describe("calculatePositionPerformance", () => {
  it("computes the position performance row from the provided inputs", () => {
    const RESULT = calculatePositionPerformance(
      buildInput({
        flowTotals: {
          applicationAmount: new Decimal("1000"),
          applicationQuotas: new Decimal("10"),
          withdrawalAmount: new Decimal("200"),
          withdrawalQuotas: new Decimal("2"),
        },
        quotaPrice: QuotaPrice.create("100"),
        dailyGrowthFactor: GrowthFactor.create("1.01"),
        initialBalance: new Decimal("500"),
      }),
    );

    expect(RESULT.positionId).toBe("2a3b4c5d-6e7f-4a8b-9c0d-1e2f3a4b5c6d");
    expect(RESULT.date.getTime()).toBe(DATE.getTime());
    expect(RESULT.quotasHeld.value.toString()).toBe("8");
    expect(RESULT.patrimony.value.toString()).toBe("800");
    expect(RESULT.applicationTotal.value.toString()).toBe("1000");
    expect(RESULT.redemptionTotal.value.toString()).toBe("200");
    expect(RESULT.cashFlowNet.value.toString()).toBe("800");
    expect(RESULT.earnings.value.toString()).toBe("-500");
    expect(RESULT.returnDaily.value.toString()).toBe("1");
    expect(RESULT.allocation.value.toString()).toBe("40");
  });

  it("floors the quotas held at zero when withdrawals exceed applications", () => {
    const RESULT = calculatePositionPerformance(
      buildInput({
        flowTotals: {
          applicationAmount: new Decimal("100"),
          applicationQuotas: new Decimal("2"),
          withdrawalAmount: new Decimal("500"),
          withdrawalQuotas: new Decimal("10"),
        },
        quotaPrice: QuotaPrice.create("50"),
      }),
    );

    expect(RESULT.quotasHeld.value.toString()).toBe("0");
    expect(RESULT.patrimony.value.toString()).toBe("0");
  });

  it("computes the trailing-period returns from the growth factors", () => {
    const RESULT = calculatePositionPerformance(
      buildInput({
        dailyGrowthFactor: GrowthFactor.create("1.02"),
        trailingPeriods: {
          monthly: [GrowthFactor.create("1.01"), GrowthFactor.create("1.02")],
          yearly: [GrowthFactor.create("1.05")],
          last12m: [GrowthFactor.create("1.10")],
        },
      }),
    );

    expect(RESULT.returnMonthly?.value.toString()).toBe("3.02");
    expect(RESULT.returnYearly?.value.toString()).toBe("5");
    expect(RESULT.returnLast12m?.value.toString()).toBe("10");
  });

  it("returns null for trailing returns when no factors are provided", () => {
    const RESULT = calculatePositionPerformance(buildInput());

    expect(RESULT.returnMonthly).toBeNull();
    expect(RESULT.returnYearly).toBeNull();
    expect(RESULT.returnLast12m).toBeNull();
  });

  it("returns a flat daily return when no daily growth factor is provided", () => {
    const RESULT = calculatePositionPerformance(buildInput());

    expect(RESULT.returnDaily.value.toString()).toBe("0");
    expect(
      SignedPercentage.equals(RESULT.returnDaily, SignedPercentage.create("0")),
    ).toBe(true);
  });
});
