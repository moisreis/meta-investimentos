import { describe, expect, it } from "vitest";

import { calculatePortfolioEarnings } from "@/business/calculators/portfolio/earnings.calculator";
import { SignedMoney } from "@/business/value-objects/signed-money.vo";

describe("calculatePortfolioEarnings", () => {
  it("returns the proved earnings value for the period for `JACOPREV`", () => {
    const RESULT = calculatePortfolioEarnings({
      sumOfPositionCurrentBalances: SignedMoney.create("7303437.91"),
      sumOfPositionInitialBalance: SignedMoney.create("6072272.64"),
      cashFlow: SignedMoney.create("1140000.00"),
    });

    expect(RESULT).toEqual(SignedMoney.create("91165.27"));
  });

  it("subtracts the net cash flow from the balance variation", () => {
    const RESULT = calculatePortfolioEarnings({
      sumOfPositionCurrentBalances: SignedMoney.create("1250000"),
      sumOfPositionInitialBalance: SignedMoney.create("1000000"),
      cashFlow: SignedMoney.create("100000"),
    });

    expect(RESULT).toEqual(SignedMoney.create("150000"));
  });

  it("returns zero when the balance variation equals the cash flow", () => {
    const RESULT = calculatePortfolioEarnings({
      sumOfPositionCurrentBalances: SignedMoney.create("1100000"),
      sumOfPositionInitialBalance: SignedMoney.create("1000000"),
      cashFlow: SignedMoney.create("100000"),
    });

    expect(RESULT).toEqual(SignedMoney.create("0"));
  });

  it("returns negative earnings when the balance variation is lower than the cash flow", () => {
    const RESULT = calculatePortfolioEarnings({
      sumOfPositionCurrentBalances: SignedMoney.create("1050000"),
      sumOfPositionInitialBalance: SignedMoney.create("1000000"),
      cashFlow: SignedMoney.create("100000"),
    });

    expect(RESULT).toEqual(SignedMoney.create("-50000"));
  });

  it("handles negative cash flow correctly", () => {
    const RESULT = calculatePortfolioEarnings({
      sumOfPositionCurrentBalances: SignedMoney.create("1050000"),
      sumOfPositionInitialBalance: SignedMoney.create("1000000"),
      cashFlow: SignedMoney.create("-25000"),
    });

    expect(RESULT).toEqual(SignedMoney.create("75000"));
  });

  it("does not mutate its inputs", () => {
    const CURRENT_BALANCES = SignedMoney.create("7303437.91");
    const INITIAL_BALANCES = SignedMoney.create("6072272.64");
    const CASH_FLOW = SignedMoney.create("1140000.00");

    calculatePortfolioEarnings({
      sumOfPositionCurrentBalances: CURRENT_BALANCES,
      sumOfPositionInitialBalance: INITIAL_BALANCES,
      cashFlow: CASH_FLOW,
    });

    expect(CURRENT_BALANCES).toEqual(SignedMoney.create("7303437.91"));
    expect(INITIAL_BALANCES).toEqual(SignedMoney.create("6072272.64"));
    expect(CASH_FLOW).toEqual(SignedMoney.create("1140000.00"));
  });
});
