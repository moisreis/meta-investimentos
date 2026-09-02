import { describe, expect, it } from "vitest";

import { calculateDailyFactor } from "@/business/calculators/position/daily-factor.calculator";
import { GrowthFactor } from "@/business/value-objects/growth-factor.vo";
import { QuotaPrice } from "@/business/value-objects/quota-price.vo";
import { QuotaQuantity } from "@/business/value-objects/quota-quantity.vo";
import { SignedMoney } from "@/business/value-objects/signed-money.vo";

describe("calculateDailyFactor", () => {
  it("returns the daily growth factor based on quota values and quantities from `CAIXA BRASIL IRF-M 1 TÃTULOS PÃšBLICOS FI RENDA FIXA`", () => {
    const RESULT = calculateDailyFactor({
      currentDayQuotaValue: QuotaPrice.create("4.424818"),
      currentDayQuotaQuantity: QuotaQuantity.create("342021.111191"),
      currentDayCashFlow: SignedMoney.create("0"),
      previousDayQuotaValue: QuotaPrice.create("4.423720"),
      previousDayQuotaQuantity: QuotaQuantity.create("342021.111191"),
    });

    expect(RESULT).toEqual(GrowthFactor.create("1.00024821"));
  });

  it("returns a flat growth factor when the calculated value equals 1", () => {
    const RESULT = calculateDailyFactor({
      currentDayQuotaValue: QuotaPrice.create("2"),
      currentDayQuotaQuantity: QuotaQuantity.create("100"),
      currentDayCashFlow: SignedMoney.create("100"),
      previousDayQuotaValue: QuotaPrice.create("1"),
      previousDayQuotaQuantity: QuotaQuantity.create("100"),
    });

    expect(RESULT).toEqual(GrowthFactor.create("1"));
  });

  it("returns a growth factor below 1 when the current day value is lower", () => {
    const RESULT = calculateDailyFactor({
      currentDayQuotaValue: QuotaPrice.create("1.5"),
      currentDayQuotaQuantity: QuotaQuantity.create("100"),
      currentDayCashFlow: SignedMoney.create("0"),
      previousDayQuotaValue: QuotaPrice.create("1"),
      previousDayQuotaQuantity: QuotaQuantity.create("100"),
    });

    expect(RESULT).toEqual(GrowthFactor.create("1.5"));
  });

  it("accounts for a positive cash flow", () => {
    const RESULT = calculateDailyFactor({
      currentDayQuotaValue: QuotaPrice.create("2"),
      currentDayQuotaQuantity: QuotaQuantity.create("100"),
      currentDayCashFlow: SignedMoney.create("50"),
      previousDayQuotaValue: QuotaPrice.create("1"),
      previousDayQuotaQuantity: QuotaQuantity.create("100"),
    });

    expect(RESULT).toEqual(GrowthFactor.create("1.5"));
  });

  it("accounts for a negative cash flow", () => {
    const RESULT = calculateDailyFactor({
      currentDayQuotaValue: QuotaPrice.create("2"),
      currentDayQuotaQuantity: QuotaQuantity.create("100"),
      currentDayCashFlow: SignedMoney.create("-50"),
      previousDayQuotaValue: QuotaPrice.create("1"),
      previousDayQuotaQuantity: QuotaQuantity.create("100"),
    });

    expect(RESULT).toEqual(GrowthFactor.create("2.5"));
  });

  it("throws when the previous day quota value is zero", () => {
    expect(() =>
      calculateDailyFactor({
        currentDayQuotaValue: QuotaPrice.create("2"),
        currentDayQuotaQuantity: QuotaQuantity.create("100"),
        currentDayCashFlow: SignedMoney.create("0"),
        previousDayQuotaValue: QuotaPrice.create("0"),
        previousDayQuotaQuantity: QuotaQuantity.create("100"),
      }),
    ).toThrow(
      "Daily factor cannot be calculated with a zero previous day quota value.",
    );
  });

  it("throws when the previous day quota quantity is zero", () => {
    expect(() =>
      calculateDailyFactor({
        currentDayQuotaValue: QuotaPrice.create("2"),
        currentDayQuotaQuantity: QuotaQuantity.create("100"),
        currentDayCashFlow: SignedMoney.create("0"),
        previousDayQuotaValue: QuotaPrice.create("1"),
        previousDayQuotaQuantity: QuotaQuantity.create("0"),
      }),
    ).toThrow(
      "Daily factor cannot be calculated with a zero previous day quota value.",
    );
  });

  it("preserves precision with decimal values", () => {
    const RESULT = calculateDailyFactor({
      currentDayQuotaValue: QuotaPrice.create("4.424818"),
      currentDayQuotaQuantity: QuotaQuantity.create("342021.111191"),
      currentDayCashFlow: SignedMoney.create("0"),
      previousDayQuotaValue: QuotaPrice.create("4.423720"),
      previousDayQuotaQuantity: QuotaQuantity.create("342021.111191"),
    });

    expect(RESULT.value.toString()).toBe("1.00024821");
  });

  it("does not mutate its inputs", () => {
    const CURRENT_DAY_QUOTA_VALUE = QuotaPrice.create("2");
    const CURRENT_DAY_QUOTA_QUANTITY = QuotaQuantity.create("100");
    const CURRENT_DAY_CASH_FLOW = SignedMoney.create("50");
    const PREVIOUS_DAY_QUOTA_VALUE = QuotaPrice.create("1");
    const PREVIOUS_DAY_QUOTA_QUANTITY = QuotaQuantity.create("100");

    calculateDailyFactor({
      currentDayQuotaValue: CURRENT_DAY_QUOTA_VALUE,
      currentDayQuotaQuantity: CURRENT_DAY_QUOTA_QUANTITY,
      currentDayCashFlow: CURRENT_DAY_CASH_FLOW,
      previousDayQuotaValue: PREVIOUS_DAY_QUOTA_VALUE,
      previousDayQuotaQuantity: PREVIOUS_DAY_QUOTA_QUANTITY,
    });

    expect(CURRENT_DAY_QUOTA_VALUE).toEqual(QuotaPrice.create("2"));
    expect(CURRENT_DAY_QUOTA_QUANTITY).toEqual(QuotaQuantity.create("100"));
    expect(CURRENT_DAY_CASH_FLOW).toEqual(SignedMoney.create("50"));
    expect(PREVIOUS_DAY_QUOTA_VALUE).toEqual(QuotaPrice.create("1"));
    expect(PREVIOUS_DAY_QUOTA_QUANTITY).toEqual(QuotaQuantity.create("100"));
  });
});
