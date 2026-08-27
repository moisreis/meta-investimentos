import { describe, expect, it } from "vitest";

import { BUSINESS_DAYS } from "@/__tests__/__datasets__/_business-days.dataset";
import { CASH_FLOWS } from "@/__tests__/__datasets__/_cash-flows.dataset";
import { QUOTA_BALANCES } from "@/__tests__/__datasets__/_quota-balances.dataset";
import { QUOTA_VALUES } from "@/__tests__/__datasets__/_quota-values.dataset";
import { buildPortfolioDailyGrowthFactors } from "@/__tests__/__helpers__/_portfolio.test.helper";
import { calculatePortfolioReturn } from "@/business/calculators/portfolio/return.calculator";
import GrowthFactor from "@/business/value-objects/growth-factor.vo";
import SignedPercentage from "@/business/value-objects/signed-percentage.vo";

describe("calculatePortfolioReturn", () => {
  it("returns zero when there are no daily growth factors", () => {
    const RESULT = calculatePortfolioReturn({ dailyGrowthFactors: [] });

    expect(RESULT).toEqual(SignedPercentage.create("0"));
  });

  it("returns the percentage growth for a single daily factor above 1", () => {
    const RESULT = calculatePortfolioReturn({
      dailyGrowthFactors: [{ value: GrowthFactor.create("1.05") }],
    });

    expect(RESULT).toEqual(SignedPercentage.create("5"));
  });

  it("returns a negative percentage when the daily factor is below 1", () => {
    const RESULT = calculatePortfolioReturn({
      dailyGrowthFactors: [{ value: GrowthFactor.create("0.98") }],
    });

    expect(RESULT).toEqual(SignedPercentage.create("-2"));
  });

  it("chains multiple daily factors before converting to percentage", () => {
    const RESULT = calculatePortfolioReturn({
      dailyGrowthFactors: [
        { value: GrowthFactor.create("1.01") },
        { value: GrowthFactor.create("1.02") },
      ],
    });

    expect(RESULT).toEqual(SignedPercentage.create("3.02"));
  });

  it("rounds the resulting percentage to two decimal places", () => {
    const RESULT = calculatePortfolioReturn({
      dailyGrowthFactors: [{ value: GrowthFactor.create("1.010559") }],
    });

    expect(RESULT.value.toString()).toBe("1.06");
  });

  it("calculates the monthly return for May 2026 for the `JACOPREV` portfolio using real quota data and cash flow history", () => {
    const RESULT = calculatePortfolioReturn({
      dailyGrowthFactors: buildPortfolioDailyGrowthFactors({
        businessDays: BUSINESS_DAYS,
        positions: QUOTA_BALANCES,
        quotaValues: QUOTA_VALUES,
        cashFlows: CASH_FLOWS,
      }),
    });

    expect(RESULT).toEqual(SignedPercentage.create("1.04"));
  });
});
