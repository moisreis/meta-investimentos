import { describe, it, expect } from "vitest";

import { calculateDailyFactor } from "@/business/calculators/position/daily-factor.calculator";
import { calculateReturn } from "@/business/calculators/position/return.calculator";
import GrowthFactor from "@/business/value-objects/growth-factor.vo";
import QuotaPrice from "@/business/value-objects/quota-price.vo";
import QuotaQuantity from "@/business/value-objects/quota-quantity.vo";
import SignedMoney from "@/business/value-objects/signed-money.vo";
import SignedPercentage from "@/business/value-objects/signed-percentage.vo";

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
    const PRE_APPLICATION_QUOTAS = QuotaQuantity.create("98279.556789");
    const POST_APPLICATION_QUOTAS = QuotaQuantity.create("136899.213035");
    const QUOTA_VALUES: [date: string, price: string][] = [
      ["2026-04-30", "1.032479"],
      ["2026-05-04", "1.033021"],
      ["2026-05-05", "1.033565"],
      ["2026-05-06", "1.034108"],
      ["2026-05-07", "1.034651"],
      ["2026-05-08", "1.035197"],
      ["2026-05-11", "1.035742"],
      ["2026-05-12", "1.036286"],
      ["2026-05-13", "1.036834"],
      ["2026-05-14", "1.037383"],
      ["2026-05-15", "1.037928"],
      ["2026-05-18", "1.038473"],
      ["2026-05-19", "1.039021"],
      ["2026-05-20", "1.039577"],
      ["2026-05-21", "1.040133"],
      ["2026-05-22", "1.040691"],
      ["2026-05-25", "1.041248"],
      ["2026-05-26", "1.041805"],
      ["2026-05-27", "1.042357"],
      ["2026-05-28", "1.042926"],
      ["2026-05-29", "1.043480"],
    ];

    const APPLICATION_DATE = "2026-05-11";

    const DAILY_GROWTH_FACTORS = QUOTA_VALUES.slice(1).map(
      ([date, currentQuotaValue], slicedIndex) => {
        const ORIGINAL_INDEX = slicedIndex + 1;
        const [, previousQuotaValue] = QUOTA_VALUES[ORIGINAL_INDEX - 1];
        const IS_APPLICATION_DAY = date === APPLICATION_DATE;

        const CURRENT_IS_ON_OR_AFTER_APPLICATION = ORIGINAL_INDEX >= 6;
        const PREVIOUS_IS_ON_OR_AFTER_APPLICATION = ORIGINAL_INDEX - 1 >= 6;

        return {
          value: calculateDailyFactor({
            currentDayQuotaValue: QuotaPrice.create(currentQuotaValue),
            currentDayQuotaQuantity: CURRENT_IS_ON_OR_AFTER_APPLICATION
              ? POST_APPLICATION_QUOTAS
              : PRE_APPLICATION_QUOTAS,
            currentDayCashFlow: IS_APPLICATION_DAY
              ? SignedMoney.create("40000")
              : SignedMoney.create("0"),
            previousDayQuotaValue: QuotaPrice.create(previousQuotaValue),
            previousDayQuotaQuantity: PREVIOUS_IS_ON_OR_AFTER_APPLICATION
              ? POST_APPLICATION_QUOTAS
              : PRE_APPLICATION_QUOTAS,
          }),
        };
      },
    );

    const RESULT = calculateReturn({
      dailyGrowthFactors: DAILY_GROWTH_FACTORS,
    });

    expect(RESULT).toEqual(SignedPercentage.create("1.07"));
  });
});
