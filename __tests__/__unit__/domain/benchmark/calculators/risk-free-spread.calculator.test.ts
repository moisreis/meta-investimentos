import { describe, it, expect } from "vitest"

import { calculatePortfolioRiskFreeSpread } from "@/domain/benchmark/calculators/risk-free-spread.calculator"
import { SignedPercentage } from "@/value-objects"

describe("domain/benchmark/calculators/risk-free-spread.calculator", () => {
  describe("calculatePortfolioRiskFreeSpread", () => {
    it("should return a positive spread when the portfolio beats the risk free rate", () => {
      const portfolioReturn = SignedPercentage.create("1.04")
      const riskFreeRate = SignedPercentage.create("0.95")

      const result = calculatePortfolioRiskFreeSpread({
        portfolioReturn,
        riskFreeRate,
      })

      expect(result).toBeInstanceOf(SignedPercentage)
      expect(result.value.toFixed(2)).toBe("0.09")
      expect(result.isPositive).toBe(true)
    })

    it("should return a negative spread when the risk free rate beats the portfolio", () => {
      const portfolioReturn = SignedPercentage.create("0.95")
      const riskFreeRate = SignedPercentage.create("1.04")

      const result = calculatePortfolioRiskFreeSpread({
        portfolioReturn,
        riskFreeRate,
      })

      expect(result.value.toFixed(2)).toBe("-0.09")
      expect(result.isNegative).toBe(true)
    })

    it("should return zero when the portfolio matches the risk free rate exactly", () => {
      const portfolioReturn = SignedPercentage.create("1.04")
      const riskFreeRate = SignedPercentage.create("1.04")

      const result = calculatePortfolioRiskFreeSpread({
        portfolioReturn,
        riskFreeRate,
      })

      expect(result.value.toString()).toBe("0")
      expect(result.isZero).toBe(true)
    })

    it("should return zero when both rates are zero", () => {
      const portfolioReturn = SignedPercentage.create("0")
      const riskFreeRate = SignedPercentage.create("0")

      const result = calculatePortfolioRiskFreeSpread({
        portfolioReturn,
        riskFreeRate,
      })

      expect(result.value.toString()).toBe("0")
    })

    it("should return a negative spread when the portfolio lost and the risk free rate gained", () => {
      const portfolioReturn = SignedPercentage.create("-3.50")
      const riskFreeRate = SignedPercentage.create("0.95")

      const result = calculatePortfolioRiskFreeSpread({
        portfolioReturn,
        riskFreeRate,
      })

      expect(result.value.toFixed(2)).toBe("-4.45")
    })

    it("should return a positive spread when the portfolio gained and the risk free rate fell", () => {
      const portfolioReturn = SignedPercentage.create("3.50")
      const riskFreeRate = SignedPercentage.create("-0.95")

      const result = calculatePortfolioRiskFreeSpread({
        portfolioReturn,
        riskFreeRate,
      })

      expect(result.value.toFixed(2)).toBe("4.45")
    })

    it("should normalize both rates before subtracting them", () => {
      const portfolioReturn = SignedPercentage.create("10.005")
      const riskFreeRate = SignedPercentage.create("0.005")

      const result = calculatePortfolioRiskFreeSpread({
        portfolioReturn,
        riskFreeRate,
      })

      // 10.005 becomes 10.01 and 0.005 becomes 0.01 before the subtraction.
      expect(portfolioReturn.value.toFixed(2)).toBe("10.01")
      expect(riskFreeRate.value.toFixed(2)).toBe("0.01")
      expect(result.value.toFixed(2)).toBe("10.00")
    })

    it("should keep the whole portfolio return as spread when the risk free rate is zero", () => {
      const portfolioReturn = SignedPercentage.create("100")
      const riskFreeRate = SignedPercentage.create("0")

      const result = calculatePortfolioRiskFreeSpread({
        portfolioReturn,
        riskFreeRate,
      })

      expect(result.value.toFixed(2)).toBe("100.00")
    })
  })
})
