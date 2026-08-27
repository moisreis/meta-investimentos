import { describe, expect, it } from "vitest";

import { calculatePortfolioTarget } from "@/business/calculators/portfolio/target.calculator";
import SignedPercentage from "@/business/value-objects/signed-percentage.vo";

describe("calculatePortfolioTarget", () => {
  it("returns the monthly target return based on the annual interest rate and the inflation index", () => {
    const RESULT = calculatePortfolioTarget({
      annualInterestRate: SignedPercentage.create("44.30"),
      inflationRate: SignedPercentage.create("0.45"),
    });

    expect(RESULT).toEqual(SignedPercentage.create("3.57"));
  });

  it("returns the monthly portfolio rate when the inflation index is zero", () => {
    const RESULT = calculatePortfolioTarget({
      annualInterestRate: SignedPercentage.create("44.30"),
      inflationRate: SignedPercentage.create("0"),
    });

    expect(RESULT).toEqual(SignedPercentage.create("3.1"));
  });

  it("returns the inflation index when the annual interest rate is zero", () => {
    const RESULT = calculatePortfolioTarget({
      annualInterestRate: SignedPercentage.create("0"),
      inflationRate: SignedPercentage.create("0.45"),
    });

    expect(RESULT).toEqual(SignedPercentage.create("0.45"));
  });

  it("returns zero when both rates are zero", () => {
    const RESULT = calculatePortfolioTarget({
      annualInterestRate: SignedPercentage.create("0"),
      inflationRate: SignedPercentage.create("0"),
    });

    expect(RESULT).toEqual(SignedPercentage.create("0"));
  });

  it("preserves precision with a non-zero inflation index", () => {
    const RESULT = calculatePortfolioTarget({
      annualInterestRate: SignedPercentage.create("44.30"),
      inflationRate: SignedPercentage.create("0.38"),
    });

    expect(RESULT).toEqual(SignedPercentage.create("3.5"));
  });

  it("does not mutate its inputs", () => {
    const ANNUAL_INTEREST_RATE = SignedPercentage.create("44.30");
    const INFLATION_RATE = SignedPercentage.create("0.45");

    calculatePortfolioTarget({
      annualInterestRate: ANNUAL_INTEREST_RATE,
      inflationRate: INFLATION_RATE,
    });

    expect(ANNUAL_INTEREST_RATE).toEqual(SignedPercentage.create("44.30"));
    expect(INFLATION_RATE).toEqual(SignedPercentage.create("0.45"));
  });
});
