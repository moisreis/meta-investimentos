import { describe, expect, it } from "vitest";

import { calculateApplicationSum } from "@/business/calculators/position/application-sum.calculator";
import PositiveMoney from "@/business/value-objects/positive-money.vo";

describe("calculateApplicationSum", () => {
  it("returns the sum of multiple application amounts", () => {
    const RESULT = calculateApplicationSum({
      application: [
        { value: PositiveMoney.create("1000000") },
        { value: PositiveMoney.create("500000") },
      ],
    });

    expect(RESULT).toEqual(PositiveMoney.create("1500000"));
  });

  it("returns zero when the application list is empty", () => {
    const RESULT = calculateApplicationSum({
      application: [],
    });

    expect(RESULT).toEqual(PositiveMoney.create("0"));
  });

  it("returns the same application amount when only one value is provided", () => {
    const RESULT = calculateApplicationSum({
      application: [{ value: PositiveMoney.create("1000000") }],
    });

    expect(RESULT).toEqual(PositiveMoney.create("1000000"));
  });

  it("preserves precision when summing decimal application amounts", () => {
    const RESULT = calculateApplicationSum({
      application: [
        { value: PositiveMoney.create("0.33") },
        { value: PositiveMoney.create("0.33") },
        { value: PositiveMoney.create("0.34") },
      ],
    });

    expect(RESULT).toEqual(PositiveMoney.create("1"));
  });

  it("preserves precision with large application amounts", () => {
    const RESULT = calculateApplicationSum({
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
      { value: PositiveMoney.create("500000") },
    ];

    calculateApplicationSum({
      application: APPLICATION,
    });

    expect(APPLICATION).toEqual([
      { value: PositiveMoney.create("1000000") },
      { value: PositiveMoney.create("500000") },
    ]);
  });
});
