import { describe, expect, it } from "vitest";

import { calculatePortfolioApplicationSum } from "@/business/calculators/portfolio/application-sum.calculator";
import PositiveMoney from "@/business/value-objects/positive-money.vo";

describe("calculatePortfolioApplicationSum", () => {
  it("returns the sum of multiple application amounts for `JACOPREV`", () => {
    const RESULT = calculatePortfolioApplicationSum({
      application: [
        { value: PositiveMoney.create("1000000") },
        { value: PositiveMoney.create("1100000") },
        { value: PositiveMoney.create("0") },
        { value: PositiveMoney.create("1000000") },
        { value: PositiveMoney.create("1000000") },
        { value: PositiveMoney.create("1000000") },
        { value: PositiveMoney.create("40000") },
      ],
    });

    expect(RESULT).toEqual(PositiveMoney.create("5140000"));
  });

  it("returns zero when the application list is empty", () => {
    const RESULT = calculatePortfolioApplicationSum({
      application: [],
    });

    expect(RESULT).toEqual(PositiveMoney.create("0"));
  });

  it("returns the same application amount when only one value is provided", () => {
    const RESULT = calculatePortfolioApplicationSum({
      application: [{ value: PositiveMoney.create("1000000") }],
    });

    expect(RESULT).toEqual(PositiveMoney.create("1000000"));
  });

  it("preserves precision when summing decimal application amounts", () => {
    const RESULT = calculatePortfolioApplicationSum({
      application: [
        { value: PositiveMoney.create("0.33") },
        { value: PositiveMoney.create("0.33") },
        { value: PositiveMoney.create("0.34") },
      ],
    });

    expect(RESULT).toEqual(PositiveMoney.create("1"));
  });

  it("preserves precision with large application amounts", () => {
    const RESULT = calculatePortfolioApplicationSum({
      application: [
        { value: PositiveMoney.create("999999999.999999") },
        { value: PositiveMoney.create("0.000001") },
      ],
    });

    expect(RESULT).toEqual(PositiveMoney.create("1000000000"));
  });

  it("does not mutate its inputs", () => {
    const APPLICATION = [
      { value: PositiveMoney.create("1000000") },
      { value: PositiveMoney.create("1100000") },
    ];

    calculatePortfolioApplicationSum({
      application: APPLICATION,
    });

    expect(APPLICATION).toEqual([
      { value: PositiveMoney.create("1000000") },
      { value: PositiveMoney.create("1100000") },
    ]);
  });
});
