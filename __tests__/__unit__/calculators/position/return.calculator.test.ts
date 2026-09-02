import { describe, expect, it } from "vitest";

import { INVESTMENT_FUND_IDS } from "@/__tests__/__datasets__/_investment-funds.dataset";
import { QUOTA_VALUES } from "@/__tests__/__datasets__/_quota-values.dataset";
import { buildPositionDailyGrowthFactors } from "@/__tests__/__helpers__/calculators/_position.test.helper";
import { calculateReturn } from "@/business/calculators/position/return.calculator";
import { GrowthFactor } from "@/business/value-objects/growth-factor.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";

describe("calculateReturn", () => {
  it("returns zero when there are no daily growth factors", () => {
    const RESULT = calculateReturn({ dailyGrowthFactors: [] });

    expect(RESULT).toEqual(SignedPercentage.create("0"));
  });

  it("returns the percentage growth for a single daily factor above 1", () => {
    const RESULT = calculateReturn({
      dailyGrowthFactors: [{ value: GrowthFactor.create("1.05") }],
    });

    expect(RESULT).toEqual(SignedPercentage.create("5"));
  });

  it("returns a negative percentage when the daily factor is below 1", () => {
    const RESULT = calculateReturn({
      dailyGrowthFactors: [{ value: GrowthFactor.create("0.98") }],
    });

    expect(RESULT).toEqual(SignedPercentage.create("-2"));
  });

  it("chains multiple daily factors before converting to percentage", () => {
    const RESULT = calculateReturn({
      dailyGrowthFactors: [
        { value: GrowthFactor.create("1.01") },
        { value: GrowthFactor.create("1.02") },
      ],
    });

    expect(RESULT).toEqual(SignedPercentage.create("3.02"));
  });

  it("rounds the resulting percentage to two decimal places", () => {
    const RESULT = calculateReturn({
      dailyGrowthFactors: [{ value: GrowthFactor.create("1.010559") }],
    });

    expect(RESULT.value.toString()).toBe("1.06");
  });

  it("calculates the monthly Time-Weighted Return for May 2026 for the `BB PREVID. RENDA FIXA REF. DI LP PERFIL SOBERANO FIC FIF` position using real CVM quota data and application history", () => {
    const RESULT = calculateReturn({
      dailyGrowthFactors: buildPositionDailyGrowthFactors({
        quotaValues:
          QUOTA_VALUES[
            INVESTMENT_FUND_IDS
              .BB_PREVID_RENDA_FIXA_REF_DI_LP_PERFIL_SOBERANO_FIC_FIF
          ],
        preApplicationQuotas: "98279.556789",
        postApplicationQuotas: "136899.213035",
        applicationDate: "2026-05-11",
        applicationValue: "40000",
      }),
    });

    expect(RESULT).toEqual(SignedPercentage.create("1.07"));
  });
});
