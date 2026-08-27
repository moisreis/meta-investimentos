import { describe, expect, it } from "vitest";

import { calculateEarnings } from "@/business/calculators/position/earnings.calculator";
import SignedMoney from "@/business/value-objects/signed-money.vo";

describe("calculateEarnings", () => {
  it("returns the proved earnings value for the period for `CAIXA BRASIL IRF-M 1 TÍTULOS PÚBLICOS FI RENDA FIXA`", () => {
    const RESULT = calculateEarnings({
      currentBalance: SignedMoney.create("1534123.40"),
      initialBalance: SignedMoney.create("1513005.63"),
      cashFlow: SignedMoney.create("0.00"),
    });

    expect(RESULT).toEqual(SignedMoney.create("21117.77"));
  });

  it("subtracts the net cash flow from the balance variation", () => {
    const RESULT = calculateEarnings({
      currentBalance: SignedMoney.create("1250000"),
      initialBalance: SignedMoney.create("1000000"),
      cashFlow: SignedMoney.create("100000"),
    });

    expect(RESULT).toEqual(SignedMoney.create("150000"));
  });

  it("returns zero when the balance variation equals the cash flow", () => {
    const RESULT = calculateEarnings({
      currentBalance: SignedMoney.create("1100000"),
      initialBalance: SignedMoney.create("1000000"),
      cashFlow: SignedMoney.create("100000"),
    });

    expect(RESULT).toEqual(SignedMoney.create("0"));
  });

  it("returns negative earnings when the balance variation is lower than the cash flow", () => {
    const RESULT = calculateEarnings({
      currentBalance: SignedMoney.create("1050000"),
      initialBalance: SignedMoney.create("1000000"),
      cashFlow: SignedMoney.create("100000"),
    });

    expect(RESULT).toEqual(SignedMoney.create("-50000"));
  });

  it("handles negative cash flow correctly", () => {
    const RESULT = calculateEarnings({
      currentBalance: SignedMoney.create("1050000"),
      initialBalance: SignedMoney.create("1000000"),
      cashFlow: SignedMoney.create("-25000"),
    });

    expect(RESULT).toEqual(SignedMoney.create("75000"));
  });

  it("does not mutate its inputs", () => {
    const CURRENT_BALANCE = SignedMoney.create("1534123.40");
    const INITIAL_BALANCE = SignedMoney.create("1513005.63");
    const CASH_FLOW = SignedMoney.create("0.00");

    calculateEarnings({
      currentBalance: CURRENT_BALANCE,
      initialBalance: INITIAL_BALANCE,
      cashFlow: CASH_FLOW,
    });

    expect(CURRENT_BALANCE).toEqual(SignedMoney.create("1534123.40"));
    expect(INITIAL_BALANCE).toEqual(SignedMoney.create("1513005.63"));
    expect(CASH_FLOW).toEqual(SignedMoney.create("0.00"));
  });
});
