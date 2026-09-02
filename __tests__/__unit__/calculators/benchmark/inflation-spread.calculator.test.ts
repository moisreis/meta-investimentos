import { describe, expect, it } from "vitest";

import { calculatePortfolioInflationSpread } from "@/business/calculators/benchmark/inflation-spread.calculator";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";

describe("calculatePortfolioInflationSpread", () => {
  it("returns the difference between the portfolio return and the inflation index", () => {
    const RESULT = calculatePortfolioInflationSpread({
      portfolioReturn: SignedPercentage.create("1.04"),
      inflationRate: SignedPercentage.create("0.45"),
    });

    expect(RESULT).toEqual(SignedPercentage.create("0.59"));
  });

  it("returns a positive difference when the portfolio outperforms the inflation index", () => {
    const RESULT = calculatePortfolioInflationSpread({
      portfolioReturn: SignedPercentage.create("6.5"),
      inflationRate: SignedPercentage.create("0.45"),
    });

    expect(RESULT).toEqual(SignedPercentage.create("6.05"));
  });

  it("returns a negative difference when the portfolio underperforms the inflation index", () => {
    const RESULT = calculatePortfolioInflationSpread({
      portfolioReturn: SignedPercentage.create("0.3"),
      inflationRate: SignedPercentage.create("0.45"),
    });

    expect(RESULT).toEqual(SignedPercentage.create("-0.15"));
  });

  it("returns zero when the portfolio return equals the inflation index", () => {
    const RESULT = calculatePortfolioInflationSpread({
      portfolioReturn: SignedPercentage.create("0.45"),
      inflationRate: SignedPercentage.create("0.45"),
    });

    expect(RESULT).toEqual(SignedPercentage.create("0"));
  });

  it("does not mutate its inputs", () => {
    const PORTFOLIO_RETURN = SignedPercentage.create("1.04");
    const INFLATION_RATE = SignedPercentage.create("0.45");

    calculatePortfolioInflationSpread({
      portfolioReturn: PORTFOLIO_RETURN,
      inflationRate: INFLATION_RATE,
    });

    expect(PORTFOLIO_RETURN).toEqual(SignedPercentage.create("1.04"));
    expect(INFLATION_RATE).toEqual(SignedPercentage.create("0.45"));
  });
});
