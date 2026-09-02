import { describe, expect, it } from "vitest";

import { calculatePortfolioRiskFreeSpread } from "@/business/calculators/benchmark/risk-free-spread.calculator";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";

describe("calculatePortfolioRiskFreeSpread", () => {
  it("returns the difference between the portfolio return and the risk-free index", () => {
    const RESULT = calculatePortfolioRiskFreeSpread({
      portfolioReturn: SignedPercentage.create("1.04"),
      riskFreeRate: SignedPercentage.create("0.95"),
    });

    expect(RESULT).toEqual(SignedPercentage.create("0.09"));
  });

  it("returns a positive difference when the portfolio outperforms the risk-free index", () => {
    const RESULT = calculatePortfolioRiskFreeSpread({
      portfolioReturn: SignedPercentage.create("6.5"),
      riskFreeRate: SignedPercentage.create("0.95"),
    });

    expect(RESULT).toEqual(SignedPercentage.create("5.55"));
  });

  it("returns a negative difference when the portfolio underperforms the risk-free index", () => {
    const RESULT = calculatePortfolioRiskFreeSpread({
      portfolioReturn: SignedPercentage.create("0.8"),
      riskFreeRate: SignedPercentage.create("0.95"),
    });

    expect(RESULT).toEqual(SignedPercentage.create("-0.15"));
  });

  it("returns zero when the portfolio return equals the risk-free index", () => {
    const RESULT = calculatePortfolioRiskFreeSpread({
      portfolioReturn: SignedPercentage.create("0.95"),
      riskFreeRate: SignedPercentage.create("0.95"),
    });

    expect(RESULT).toEqual(SignedPercentage.create("0"));
  });

  it("does not mutate its inputs", () => {
    const PORTFOLIO_RETURN = SignedPercentage.create("1.04");
    const RISK_FREE_RATE = SignedPercentage.create("0.95");

    calculatePortfolioRiskFreeSpread({
      portfolioReturn: PORTFOLIO_RETURN,
      riskFreeRate: RISK_FREE_RATE,
    });

    expect(PORTFOLIO_RETURN).toEqual(SignedPercentage.create("1.04"));
    expect(RISK_FREE_RATE).toEqual(SignedPercentage.create("0.95"));
  });
});
