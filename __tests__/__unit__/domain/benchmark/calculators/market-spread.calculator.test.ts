import { describe, it, expect } from "vitest"

import { calculatePortfolioMarketSpread } from "@/domain/benchmark/calculators/market-spread.calculator"
import { SignedPercentage } from "@/value-objects"

describe("domain/benchmark/calculators/market-spread.calculator", () => {
  describe("calculatePortfolioMarketSpread", () => {
    it("should return a negative spread when the portfolio lags the market", () => {
      const portfolioReturn = SignedPercentage.create("1.04")
      const marketRate = SignedPercentage.create("1.20")

      const result = calculatePortfolioMarketSpread({
        portfolioReturn,
        marketRate,
      })

      expect(result).toBeInstanceOf(SignedPercentage)
      expect(result.value.toFixed(2)).toBe("-0.16")
      expect(result.isNegative).toBe(true)
    })

    it("should return a positive spread when the portfolio beats the market", () => {
      const portfolioReturn = SignedPercentage.create("2.50")
      const marketRate = SignedPercentage.create("1.20")

      const result = calculatePortfolioMarketSpread({
        portfolioReturn,
        marketRate,
      })

      expect(result.value.toFixed(2)).toBe("1.30")
      expect(result.isPositive).toBe(true)
    })

    it("should return zero when the portfolio matches the market exactly", () => {
      const portfolioReturn = SignedPercentage.create("1.04")
      const marketRate = SignedPercentage.create("1.04")

      const result = calculatePortfolioMarketSpread({
        portfolioReturn,
        marketRate,
      })

      expect(result.value.toString()).toBe("0")
      expect(result.isZero).toBe(true)
    })

    it("should return zero when both rates are zero", () => {
      const portfolioReturn = SignedPercentage.create("0")
      const marketRate = SignedPercentage.create("0")

      const result = calculatePortfolioMarketSpread({
        portfolioReturn,
        marketRate,
      })

      expect(result.value.toString()).toBe("0")
    })

    it("should return a negative spread when the portfolio lost and the market gained", () => {
      const portfolioReturn = SignedPercentage.create("-5")
      const marketRate = SignedPercentage.create("1.25")

      const result = calculatePortfolioMarketSpread({
        portfolioReturn,
        marketRate,
      })

      expect(result.value.toFixed(2)).toBe("-6.25")
    })

    it("should return a positive spread when the portfolio gained and the market fell", () => {
      const portfolioReturn = SignedPercentage.create("5")
      const marketRate = SignedPercentage.create("-1.25")

      const result = calculatePortfolioMarketSpread({
        portfolioReturn,
        marketRate,
      })

      expect(result.value.toFixed(2)).toBe("6.25")
    })

    it("should normalize both rates before subtracting them", () => {
      const portfolioReturn = SignedPercentage.create("10.005")
      const marketRate = SignedPercentage.create("0.005")

      const result = calculatePortfolioMarketSpread({
        portfolioReturn,
        marketRate,
      })

      // 10.005 becomes 10.01 and 0.005 becomes 0.01 before the subtraction.
      expect(portfolioReturn.value.toFixed(2)).toBe("10.01")
      expect(marketRate.value.toFixed(2)).toBe("0.01")
      expect(result.value.toFixed(2)).toBe("10.00")
    })

    it("should keep the whole portfolio return as spread when the market is zero", () => {
      const portfolioReturn = SignedPercentage.create("100")
      const marketRate = SignedPercentage.create("0")

      const result = calculatePortfolioMarketSpread({
        portfolioReturn,
        marketRate,
      })

      expect(result.value.toFixed(2)).toBe("100.00")
    })
  })
})
