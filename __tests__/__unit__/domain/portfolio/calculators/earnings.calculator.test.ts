import { describe, it, expect } from "vitest"
import { calculatePortfolioEarnings } from "@/domain/portfolio/calculators/earnings.calculator"
import { ValidationError } from "@/errors"
import { SignedMoney } from "@/value-objects"

describe("domain/portfolio/calculators/earnings.calculator", () => {
  describe("calculatePortfolioEarnings", () => {
    it("should calculate positive earnings correctly", () => {
      const sumOfPositionCurrentBalances =
        SignedMoney.create("7303437.91")
      const sumOfPositionInitialBalance =
        SignedMoney.create("6072272.64")
      const cashFlow = SignedMoney.create("1140000.00")

      const result = calculatePortfolioEarnings({
        sumOfPositionCurrentBalances,
        sumOfPositionInitialBalance,
        cashFlow,
      })

      // 7303437.91 - 6072272.64 - 1140000.00 = 91165.27
      expect(result.value.toString()).toBe("91165.27")
      expect(result).toBeInstanceOf(SignedMoney)
    })

    it("should calculate negative earnings (loss) when result is negative", () => {
      const sumOfPositionCurrentBalances =
        SignedMoney.create("7000000")
      const sumOfPositionInitialBalance =
        SignedMoney.create("6000000")
      const cashFlow = SignedMoney.create("1500000")

      const result = calculatePortfolioEarnings({
        sumOfPositionCurrentBalances,
        sumOfPositionInitialBalance,
        cashFlow,
      })

      // 7000000 - 6000000 - 1500000 = -500000
      expect(result.value.toString()).toBe("-500000")
    })

    it("should return zero earnings when inputs balance", () => {
      const sumOfPositionCurrentBalances =
        SignedMoney.create("7500000")
      const sumOfPositionInitialBalance =
        SignedMoney.create("6000000")
      const cashFlow = SignedMoney.create("1500000")

      const result = calculatePortfolioEarnings({
        sumOfPositionCurrentBalances,
        sumOfPositionInitialBalance,
        cashFlow,
      })

      // 7500000 - 6000000 - 1500000 = 0
      expect(result.value.toString()).toBe("0")
    })

    it("should handle decimal values correctly", () => {
      const sumOfPositionCurrentBalances =
        SignedMoney.create("5000.50")
      const sumOfPositionInitialBalance =
        SignedMoney.create("4000.00")
      const cashFlow = SignedMoney.create("800.25")

      const result = calculatePortfolioEarnings({
        sumOfPositionCurrentBalances,
        sumOfPositionInitialBalance,
        cashFlow,
      })

      // 5000.50 - 4000.00 - 800.25 = 200.25
      expect(result.value.toString()).toBe("200.25")
    })

    it("should handle when cash flow is zero", () => {
      const sumOfPositionCurrentBalances =
        SignedMoney.create("6500000")
      const sumOfPositionInitialBalance =
        SignedMoney.create("6000000")
      const cashFlow = SignedMoney.create("0")

      const result = calculatePortfolioEarnings({
        sumOfPositionCurrentBalances,
        sumOfPositionInitialBalance,
        cashFlow,
      })

      expect(result.value.toString()).toBe("500000")
    })

    it("should handle negative balances if signed money allows", () => {
      const sumOfPositionCurrentBalances =
        SignedMoney.create("500000")
      const sumOfPositionInitialBalance =
        SignedMoney.create("-1000000")
      const cashFlow = SignedMoney.create("0")

      const result = calculatePortfolioEarnings({
        sumOfPositionCurrentBalances,
        sumOfPositionInitialBalance,
        cashFlow,
      })

      // 500000 - (-1000000) = 1500000
      expect(result.value.toString()).toBe("1500000")
    })

    it("should throw ValidationError when SignedMoney is created with invalid input", () => {
      expect(() =>
        SignedMoney.create(
          "abc" as unknown as Parameters<
            typeof SignedMoney.create
          >[0]
        )
      ).toThrow(ValidationError)
      expect(() =>
        SignedMoney.create(
          null as unknown as Parameters<
            typeof SignedMoney.create
          >[0]
        )
      ).toThrow(ValidationError)
    })
  })
})
