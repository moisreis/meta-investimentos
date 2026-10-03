import { describe, it, expect } from "vitest"

import { calculatePortfolioInflationSpread } from "@/domain/benchmark/calculators/inflation-spread.calculator"
import { SignedPercentage } from "@/value-objects"

describe("domain/benchmark/calculators/inflation-spread.calculator", () => {
  describe("calculatePortfolioInflationSpread", () => {
    it("should return a positive spread when the portfolio beats the inflation", () => {
      const portfolioReturn = SignedPercentage.create("1.04")
      const inflationRate = SignedPercentage.create("0.45")

      const result = calculatePortfolioInflationSpread({
        portfolioReturn,
        inflationRate,
      })

      expect(result).toBeInstanceOf(SignedPercentage)
      expect(result.value.toFixed(2)).toBe("0.59")
      expect(result.isPositive).toBe(true)
    })

    it("should return a negative spread when the inflation beats the portfolio", () => {
      const portfolioReturn = SignedPercentage.create("0.45")
      const inflationRate = SignedPercentage.create("1.04")

      const result = calculatePortfolioInflationSpread({
        portfolioReturn,
        inflationRate,
      })

      expect(result.value.toFixed(2)).toBe("-0.59")
      expect(result.isNegative).toBe(true)
    })

    it("should return zero when the portfolio matches the inflation exactly", () => {
      const portfolioReturn = SignedPercentage.create("1.04")
      const inflationRate = SignedPercentage.create("1.04")

      const result = calculatePortfolioInflationSpread({
        portfolioReturn,
        inflationRate,
      })

      expect(result.value.toString()).toBe("0")
      expect(result.isZero).toBe(true)
    })

    it("should return zero when both rates are zero", () => {
      const portfolioReturn = SignedPercentage.create("0")
      const inflationRate = SignedPercentage.create("0")

      const result = calculatePortfolioInflationSpread({
        portfolioReturn,
        inflationRate,
      })

      expect(result.value.toString()).toBe("0")
    })

    it("should return a negative spread when the portfolio lost and the inflation gained", () => {
      const portfolioReturn = SignedPercentage.create("-2.50")
      const inflationRate = SignedPercentage.create("0.40")

      const result = calculatePortfolioInflationSpread({
        portfolioReturn,
        inflationRate,
      })

      expect(result.value.toFixed(2)).toBe("-2.90")
    })

    it("should return a positive spread when the inflation itself was deflationary", () => {
      const portfolioReturn = SignedPercentage.create("0.30")
      const inflationRate = SignedPercentage.create("-0.20")

      const result = calculatePortfolioInflationSpread({
        portfolioReturn,
        inflationRate,
      })

      expect(result.value.toFixed(2)).toBe("0.50")
    })

    it("should normalize both rates before subtracting them", () => {
      const portfolioReturn = SignedPercentage.create("12.345")
      const inflationRate = SignedPercentage.create("0.005")

      const result = calculatePortfolioInflationSpread({
        portfolioReturn,
        inflationRate,
      })

      // 12.345 becomes 12.35 and 0.005 becomes 0.01 before the subtraction.
      expect(portfolioReturn.value.toFixed(2)).toBe("12.35")
      expect(inflationRate.value.toFixed(2)).toBe("0.01")
      expect(result.value.toFixed(2)).toBe("12.34")
    })

    it("should keep the whole portfolio return as spread when the inflation is zero", () => {
      const portfolioReturn = SignedPercentage.create("100")
      const inflationRate = SignedPercentage.create("0")

      const result = calculatePortfolioInflationSpread({
        portfolioReturn,
        inflationRate,
      })

      expect(result.value.toFixed(2)).toBe("100.00")
    })
  })
})
