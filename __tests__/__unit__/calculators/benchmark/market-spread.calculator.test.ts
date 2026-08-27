import { describe, expect, it } from "vitest";

import { calculatePortfolioMarketSpread } from "@/business/calculators/benchmark/market-spread.calculator";
import SignedPercentage from "@/business/value-objects/signed-percentage.vo";

describe("calculatePortfolioMarketSpread", () => {
  it("returns the difference between the portfolio return and the market index", () => {
    const RESULT = calculatePortfolioMarketSpread({
      portfolioReturn: SignedPercentage.create("1.04"),
      marketRate: SignedPercentage.create("1.2"),
    });

    expect(RESULT).toEqual(SignedPercentage.create("-0.16"));
  });

  it("returns a positive difference when the portfolio outperforms the market index", () => {
    const RESULT = calculatePortfolioMarketSpread({
      portfolioReturn: SignedPercentage.create("6.5"),
      marketRate: SignedPercentage.create("1.2"),
    });

    expect(RESULT).toEqual(SignedPercentage.create("5.3"));
  });

  it("returns a negative difference when the portfolio underperforms the market index", () => {
    const RESULT = calculatePortfolioMarketSpread({
      portfolioReturn: SignedPercentage.create("1.04"),
      marketRate: SignedPercentage.create("1.8"),
    });

    expect(RESULT).toEqual(SignedPercentage.create("-0.76"));
  });

  it("returns zero when the portfolio return equals the market index", () => {
    const RESULT = calculatePortfolioMarketSpread({
      portfolioReturn: SignedPercentage.create("1.2"),
      marketRate: SignedPercentage.create("1.2"),
    });

    expect(RESULT).toEqual(SignedPercentage.create("0"));
  });

  it("does not mutate its inputs", () => {
    const PORTFOLIO_RETURN = SignedPercentage.create("1.04");
    const MARKET_RATE = SignedPercentage.create("1.2");

    calculatePortfolioMarketSpread({
      portfolioReturn: PORTFOLIO_RETURN,
      marketRate: MARKET_RATE,
    });

    expect(PORTFOLIO_RETURN).toEqual(SignedPercentage.create("1.04"));
    expect(MARKET_RATE).toEqual(SignedPercentage.create("1.2"));
  });
});
