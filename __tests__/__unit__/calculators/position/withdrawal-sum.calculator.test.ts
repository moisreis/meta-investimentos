import { describe, expect, it } from "vitest";

import { calculateWithdrawalSum } from "@/business/calculators/position/withdrawal-sum.calculator";
import { PositiveMoney } from "@/business/value-objects/positive-money.vo";

describe("calculateWithdrawalSum", () => {
  it("returns the sum of multiple withdrawal amounts", () => {
    const RESULT = calculateWithdrawalSum({
      withdrawal: [
        { value: PositiveMoney.create("1000000") },
        { value: PositiveMoney.create("500000") },
      ],
    });

    expect(RESULT).toEqual(PositiveMoney.create("1500000"));
  });

  it("returns zero when the withdrawal list is empty", () => {
    const RESULT = calculateWithdrawalSum({
      withdrawal: [],
    });

    expect(RESULT).toEqual(PositiveMoney.create("0"));
  });

  it("returns the same withdrawal amount when only one value is provided", () => {
    const RESULT = calculateWithdrawalSum({
      withdrawal: [{ value: PositiveMoney.create("1000000") }],
    });

    expect(RESULT).toEqual(PositiveMoney.create("1000000"));
  });

  it("preserves precision when summing decimal withdrawal amounts", () => {
    const RESULT = calculateWithdrawalSum({
      withdrawal: [
        { value: PositiveMoney.create("0.33") },
        { value: PositiveMoney.create("0.33") },
        { value: PositiveMoney.create("0.34") },
      ],
    });

    expect(RESULT).toEqual(PositiveMoney.create("1"));
  });

  it("preserves precision with large withdrawal amounts", () => {
    const RESULT = calculateWithdrawalSum({
      withdrawal: [
        { value: PositiveMoney.create("999999999.999999") },
        { value: PositiveMoney.create("0.000001") },
      ],
    });

    expect(RESULT).toEqual(PositiveMoney.create("1000000000"));
  });

  it("does not mutate its inputs", () => {
    const WITHDRAWAL = [
      { value: PositiveMoney.create("1000000") },
      { value: PositiveMoney.create("500000") },
    ];

    calculateWithdrawalSum({
      withdrawal: WITHDRAWAL,
    });

    expect(WITHDRAWAL).toEqual([
      { value: PositiveMoney.create("1000000") },
      { value: PositiveMoney.create("500000") },
    ]);
  });
});
