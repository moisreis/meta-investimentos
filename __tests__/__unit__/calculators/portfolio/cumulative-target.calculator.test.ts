import { describe, expect, it } from "vitest";

import { calculatePortfolioCumulativeTarget } from "@/business/calculators/portfolio/cumulative-target.calculator";
import SignedPercentage from "@/business/value-objects/signed-percentage.vo";

describe("calculatePortfolioCumulativeTarget", () => {
  it("returns zero when there are no monthly targets", () => {
    const RESULT = calculatePortfolioCumulativeTarget({ monthlyTargets: [] });

    expect(RESULT).toEqual(SignedPercentage.create("0"));
  });

  it("returns the monthly target when there is a single monthly target", () => {
    const RESULT = calculatePortfolioCumulativeTarget({
      monthlyTargets: [{ value: SignedPercentage.create("3.57") }],
    });

    expect(RESULT).toEqual(SignedPercentage.create("3.57"));
  });

  it("chains multiple monthly targets before converting to percentage", () => {
    const RESULT = calculatePortfolioCumulativeTarget({
      monthlyTargets: [
        { value: SignedPercentage.create("3.57") },
        { value: SignedPercentage.create("2.91") },
        { value: SignedPercentage.create("3.44") },
      ],
    });

    expect(RESULT).toEqual(SignedPercentage.create("10.25"));
  });

  it("includes negative monthly targets in the chain", () => {
    const RESULT = calculatePortfolioCumulativeTarget({
      monthlyTargets: [
        { value: SignedPercentage.create("-1") },
        { value: SignedPercentage.create("1") },
      ],
    });

    expect(RESULT).toEqual(SignedPercentage.create("-0.01"));
  });

  it("does not mutate its inputs", () => {
    const MONTHLY_TARGETS = [
      { value: SignedPercentage.create("3.57") },
      { value: SignedPercentage.create("2.91") },
      { value: SignedPercentage.create("3.44") },
    ];

    calculatePortfolioCumulativeTarget({ monthlyTargets: MONTHLY_TARGETS });

    expect(MONTHLY_TARGETS).toEqual([
      { value: SignedPercentage.create("3.57") },
      { value: SignedPercentage.create("2.91") },
      { value: SignedPercentage.create("3.44") },
    ]);
  });
});
