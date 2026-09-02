import { describe, expect, it } from "vitest";

import { calculatePortfolioCumulativeBenchmark } from "@/business/calculators/benchmark/cumulative-benchmark.calculator";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";

describe("calculatePortfolioCumulativeBenchmark", () => {
  it("returns zero when there are no monthly index values", () => {
    const RESULT = calculatePortfolioCumulativeBenchmark({
      monthlyIndexValues: [],
    });

    expect(RESULT).toEqual(SignedPercentage.create("0"));
  });

  it("returns the monthly index value when there is a single monthly index value", () => {
    const RESULT = calculatePortfolioCumulativeBenchmark({
      monthlyIndexValues: [{ value: SignedPercentage.create("1.04") }],
    });

    expect(RESULT).toEqual(SignedPercentage.create("1.04"));
  });

  it("chains multiple monthly index values before converting to percentage", () => {
    const RESULT = calculatePortfolioCumulativeBenchmark({
      monthlyIndexValues: [
        { value: SignedPercentage.create("0.45") },
        { value: SignedPercentage.create("0.42") },
        { value: SignedPercentage.create("0.51") },
      ],
    });

    expect(RESULT).toEqual(SignedPercentage.create("1.39"));
  });

  it("returns a negative result when the index declines", () => {
    const RESULT = calculatePortfolioCumulativeBenchmark({
      monthlyIndexValues: [{ value: SignedPercentage.create("-1") }],
    });

    expect(RESULT).toEqual(SignedPercentage.create("-1"));
  });

  it("does not mutate its inputs", () => {
    const MONTHLY_INDEX_VALUES = [
      { value: SignedPercentage.create("0.45") },
      { value: SignedPercentage.create("0.42") },
      { value: SignedPercentage.create("0.51") },
    ];

    calculatePortfolioCumulativeBenchmark({
      monthlyIndexValues: MONTHLY_INDEX_VALUES,
    });

    expect(MONTHLY_INDEX_VALUES).toEqual([
      { value: SignedPercentage.create("0.45") },
      { value: SignedPercentage.create("0.42") },
      { value: SignedPercentage.create("0.51") },
    ]);
  });
});
