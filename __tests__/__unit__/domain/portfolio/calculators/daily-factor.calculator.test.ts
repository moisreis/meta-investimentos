import { describe, it, expect } from "vitest"
import { calculatePortfolioDailyFactor } from "@/domain/portfolio/calculators/daily-factor.calculator"
import { ValidationError } from "@/errors"
import { SignedMoney, GrowthFactor } from "@/value-objects"

describe("domain/portfolio/calculators/daily-factor.calculator", () => {
  describe("calculatePortfolioDailyFactor", () => {
    it("should calculate daily factor correctly for positive scenario", () => {
      const currentDayPortfolioValue =
        SignedMoney.create("11177402.62")
      const currentDayCashFlow = SignedMoney.create("5100000")
      const previousDayPortfolioValue =
        SignedMoney.create("6072211.64")

      const result = calculatePortfolioDailyFactor({
        currentDayPortfolioValue,
        currentDayCashFlow,
        previousDayPortfolioValue,
      })

      // (11177402.62 - 5100000) / 6072211.64 = 6077402.62 / 6072211.64 = 1.000854869...
      expect(result.value.toFixed(8)).toBe("1.00085487")
      expect(result).toBeInstanceOf(GrowthFactor)
    })

    it("should calculate daily factor when no cash flow", () => {
      const currentDayPortfolioValue =
        SignedMoney.create("11000000")
      const currentDayCashFlow = SignedMoney.create("0")
      const previousDayPortfolioValue =
        SignedMoney.create("10000000")

      const result = calculatePortfolioDailyFactor({
        currentDayPortfolioValue,
        currentDayCashFlow,
        previousDayPortfolioValue,
      })

      expect(result.value.toFixed(8)).toBe("1.10000000")
    })

    it("should calculate daily factor for negative portfolio value change", () => {
      const currentDayPortfolioValue =
        SignedMoney.create("9000000")
      const currentDayCashFlow = SignedMoney.create("0")
      const previousDayPortfolioValue =
        SignedMoney.create("10000000")

      const result = calculatePortfolioDailyFactor({
        currentDayPortfolioValue,
        currentDayCashFlow,
        previousDayPortfolioValue,
      })

      expect(result.value.toFixed(8)).toBe("0.90000000")
    })

    it("should calculate daily factor when cash flow is large", () => {
      const currentDayPortfolioValue =
        SignedMoney.create("10000000")
      const currentDayCashFlow = SignedMoney.create("2000000")
      const previousDayPortfolioValue =
        SignedMoney.create("9000000")

      const result = calculatePortfolioDailyFactor({
        currentDayPortfolioValue,
        currentDayCashFlow,
        previousDayPortfolioValue,
      })

      // (10000000 - 2000000) / 9000000 = 8000000/9000000 = 0.888888...
      expect(result.value.toFixed(8)).toBe("0.88888889")
    })

    it("should calculate daily factor with decimal values", () => {
      const currentDayPortfolioValue =
        SignedMoney.create("5000.75")
      const currentDayCashFlow = SignedMoney.create("1000.00")
      const previousDayPortfolioValue =
        SignedMoney.create("4000.00")

      const result = calculatePortfolioDailyFactor({
        currentDayPortfolioValue,
        currentDayCashFlow,
        previousDayPortfolioValue,
      })

      // (5000.75 - 1000.00)/4000.00 = 4000.75/4000.00 = 1.0001875
      expect(result.value.toFixed(8)).toBe("1.00018750")
    })

    it("should throw ValidationError when previous day portfolio value is zero", () => {
      const currentDayPortfolioValue =
        SignedMoney.create("10000000")
      const currentDayCashFlow = SignedMoney.create("1000000")
      const previousDayPortfolioValue = SignedMoney.create("0")

      expect(() =>
        calculatePortfolioDailyFactor({
          currentDayPortfolioValue,
          currentDayCashFlow,
          previousDayPortfolioValue,
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when previous day portfolio value is negative", () => {
      const currentDayPortfolioValue =
        SignedMoney.create("10000000")
      const currentDayCashFlow = SignedMoney.create("0")
      const previousDayPortfolioValue =
        SignedMoney.create("-500000")

      // Previous day negative makes (current - cashFlow) / previous negative
      // GrowthFactor.create throws on negative factor
      expect(() =>
        calculatePortfolioDailyFactor({
          currentDayPortfolioValue,
          currentDayCashFlow,
          previousDayPortfolioValue,
        })
      ).toThrow(ValidationError)
    })
  })
})
