import { describe, expect, it } from "vitest";

import { calculatePortfolioDailyFactor } from "@/business/calculators/portfolio/daily-factor.calculator";
import { GrowthFactor } from "@/business/value-objects/growth-factor.vo";
import { SignedMoney } from "@/business/value-objects/signed-money.vo";

describe("calculatePortfolioDailyFactor", () => {
  it("returns the daily growth factor based on the current and previous portfolio values", () => {
    const RESULT = calculatePortfolioDailyFactor({
      currentDayPortfolioValue: SignedMoney.create("6072211.64"),
      currentDayCashFlow: SignedMoney.create("0"),
      previousDayPortfolioValue: SignedMoney.create("6072272.68"),
    });

    expect(RESULT).toEqual(GrowthFactor.create("0.99998995"));
  });

  it("returns a flat growth factor when the calculated value equals 1", () => {
    const RESULT = calculatePortfolioDailyFactor({
      currentDayPortfolioValue: SignedMoney.create("200"),
      currentDayCashFlow: SignedMoney.create("100"),
      previousDayPortfolioValue: SignedMoney.create("100"),
    });

    expect(RESULT).toEqual(GrowthFactor.create("1"));
  });

  it("returns a growth factor below 1 when the current day portfolio value is lower", () => {
    const RESULT = calculatePortfolioDailyFactor({
      currentDayPortfolioValue: SignedMoney.create("100"),
      currentDayCashFlow: SignedMoney.create("0"),
      previousDayPortfolioValue: SignedMoney.create("110"),
    });

    expect(RESULT).toEqual(GrowthFactor.create("0.90909091"));
  });

  it("accounts for a positive cash flow", () => {
    const RESULT = calculatePortfolioDailyFactor({
      currentDayPortfolioValue: SignedMoney.create("200"),
      currentDayCashFlow: SignedMoney.create("50"),
      previousDayPortfolioValue: SignedMoney.create("100"),
    });

    expect(RESULT).toEqual(GrowthFactor.create("1.5"));
  });

  it("accounts for a negative cash flow", () => {
    const RESULT = calculatePortfolioDailyFactor({
      currentDayPortfolioValue: SignedMoney.create("200"),
      currentDayCashFlow: SignedMoney.create("-50"),
      previousDayPortfolioValue: SignedMoney.create("100"),
    });

    expect(RESULT).toEqual(GrowthFactor.create("2.5"));
  });

  it("throws when the previous day portfolio value is zero", () => {
    expect(() =>
      calculatePortfolioDailyFactor({
        currentDayPortfolioValue: SignedMoney.create("200"),
        currentDayCashFlow: SignedMoney.create("50"),
        previousDayPortfolioValue: SignedMoney.create("0"),
      }),
    ).toThrow(
      "Portfolio daily factor cannot be calculated with a zero previous day value.",
    );
  });

  it("preserves precision with decimal values", () => {
    const RESULT = calculatePortfolioDailyFactor({
      currentDayPortfolioValue: SignedMoney.create("11177402.62"),
      currentDayCashFlow: SignedMoney.create("5100000"),
      previousDayPortfolioValue: SignedMoney.create("6072211.64"),
    });

    expect(RESULT.value.toString()).toBe("1.00085487");
  });

  it("does not mutate its inputs", () => {
    const CURRENT_DAY_PORTFOLIO_VALUE = SignedMoney.create("200");
    const CURRENT_DAY_CASH_FLOW = SignedMoney.create("50");
    const PREVIOUS_DAY_PORTFOLIO_VALUE = SignedMoney.create("100");

    calculatePortfolioDailyFactor({
      currentDayPortfolioValue: CURRENT_DAY_PORTFOLIO_VALUE,
      currentDayCashFlow: CURRENT_DAY_CASH_FLOW,
      previousDayPortfolioValue: PREVIOUS_DAY_PORTFOLIO_VALUE,
    });

    expect(CURRENT_DAY_PORTFOLIO_VALUE).toEqual(SignedMoney.create("200"));
    expect(CURRENT_DAY_CASH_FLOW).toEqual(SignedMoney.create("50"));
    expect(PREVIOUS_DAY_PORTFOLIO_VALUE).toEqual(SignedMoney.create("100"));
  });
});
