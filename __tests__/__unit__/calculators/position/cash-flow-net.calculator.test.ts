import { describe, it, expect } from "vitest";

import { calculateCashFlowNet } from "@/business/calculators/position/cash-flow-net.calculator";
import PositiveMoney from "@/business/value-objects/positive-money.vo";
import SignedMoney from "@/business/value-objects/signed-money.vo";

describe("calculateCashFlowNet", () => {
  it("returns the difference between applications and withdrawals", () => {
    const RESULT = calculateCashFlowNet({
      applications: PositiveMoney.create("1000000"),
      withdrawals: PositiveMoney.create("250000"),
    });

    expect(RESULT).toEqual(SignedMoney.create("750000"));
  });

  it("returns zero when applications and withdrawals are equal", () => {
    const RESULT = calculateCashFlowNet({
      applications: PositiveMoney.create("500000"),
      withdrawals: PositiveMoney.create("500000"),
    });

    expect(RESULT).toEqual(SignedMoney.create("0"));
  });

  it("returns a negative value when withdrawals exceed applications", () => {
    const RESULT = calculateCashFlowNet({
      applications: PositiveMoney.create("250000"),
      withdrawals: PositiveMoney.create("500000"),
    });

    expect(RESULT).toEqual(SignedMoney.create("-250000"));
  });

  it("preserves precision with decimal amounts", () => {
    const RESULT = calculateCashFlowNet({
      applications: PositiveMoney.create("1000.50"),
      withdrawals: PositiveMoney.create("250.25"),
    });

    expect(RESULT).toEqual(SignedMoney.create("750.25"));
  });

  it("preserves precision with large amounts", () => {
    const RESULT = calculateCashFlowNet({
      applications: PositiveMoney.create("999999999.99"),
      withdrawals: PositiveMoney.create("0.01"),
    });

    expect(RESULT).toEqual(SignedMoney.create("999999999.98"));
  });

  it("does not mutate its inputs", () => {
    const APPLICATIONS = PositiveMoney.create("1000000");
    const WITHDRAWALS = PositiveMoney.create("250000");

    calculateCashFlowNet({
      applications: APPLICATIONS,
      withdrawals: WITHDRAWALS,
    });

    expect(APPLICATIONS).toEqual(PositiveMoney.create("1000000"));
    expect(WITHDRAWALS).toEqual(PositiveMoney.create("250000"));
  });
});
