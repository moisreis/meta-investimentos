import { describe, it, expect } from "vitest"
import { calculatePortfolioTarget } from "@/domain/portfolio/calculators/target.calculator"
import { ValidationError } from "@/errors"
import { SignedPercentage } from "@/value-objects"

describe("domain/portfolio/calculators/target.calculator", () => {
  describe("calculatePortfolioTarget", () => {
    it("should calculate monthly target correctly with positive rates", () => {
      const annualInterestRate = SignedPercentage.create("44.30")
      const inflationRate = SignedPercentage.create("0.45")

      const result = calculatePortfolioTarget({
        annualInterestRate,
        inflationRate,
      })

      // ( (1 + 0.443)^(1/12) ) * (1 + 0.0045) - 1
      // 1.443^(1/12) ≈ 1.031032, * 1.0045 ≈ 1.0356717, -1 = 0.0356717 = 3.56717%
      // Rounded to 2dp = 3.57
      expect(result.value.toFixed(2)).toBe("3.57")
    })

    it("should calculate monthly target with zero inflation", () => {
      const annualInterestRate = SignedPercentage.create("12.00")
      const inflationRate = SignedPercentage.create("0.00")

      const result = calculatePortfolioTarget({
        annualInterestRate,
        inflationRate,
      })

      // (1.12^(1/12)) - 1 ~ 0.0094888 = 0.94888% -> rounded to 2dp = 0.95
      expect(result.value.toFixed(2)).toBe("0.95")
    })

    it("should calculate monthly target with zero interest rate", () => {
      const annualInterestRate = SignedPercentage.create("0.00")
      const inflationRate = SignedPercentage.create("0.50")

      const result = calculatePortfolioTarget({
        annualInterestRate,
        inflationRate,
      })

      // 1 * (1.005) - 1 = 0.5%
      expect(result.value.toFixed(2)).toBe("0.50")
    })

    it("should calculate monthly target with negative interest rate above -100%", () => {
      const annualInterestRate =
        SignedPercentage.create("-12.00")
      const inflationRate = SignedPercentage.create("0.30")

      const result = calculatePortfolioTarget({
        annualInterestRate,
        inflationRate,
      })

      // ((1 - 0.12)^(1/12)) = (0.88^(1/12)) ~ 0.989404, *1.003 = ~0.992372, -1 = -0.7628%
      // Rounded to 2dp = -0.76
      expect(result.value.toFixed(2)).toBe("-0.76")
    })

    it("should handle very small positive rates", () => {
      const annualInterestRate = SignedPercentage.create("6.00")
      const inflationRate = SignedPercentage.create("0.10")

      const result = calculatePortfolioTarget({
        annualInterestRate,
        inflationRate,
      })

      // (1.06^(1/12))~1.0048675, *1.001=1.005872, -1=0.5872% -> rounded to 2dp = 0.59
      expect(result.value.toFixed(2)).toBe("0.59")
    })

    it("should throw ValidationError when annual interest rate is below -100%", () => {
      const annualInterestRate =
        SignedPercentage.create("-100.01")
      const inflationRate = SignedPercentage.create("0.50")

      expect(() =>
        calculatePortfolioTarget({
          annualInterestRate,
          inflationRate,
        })
      ).toThrow(ValidationError)
    })

    it("should allow annual interest rate exactly -100%", () => {
      const annualInterestRate =
        SignedPercentage.create("-100.00")
      const inflationRate = SignedPercentage.create("2.00")

      const result = calculatePortfolioTarget({
        annualInterestRate,
        inflationRate,
      })

      // MONTHLY_PORTFOLIO_BASE = 0, 0^(anything positive) is 0 - toPower(1/12) of 0 is 0
      // (0) * (1.02) - 1 = -1.00 = -100%
      expect(result.value.toFixed(2)).toBe("-100.00")
    })

    it("should throw ValidationError for invalid SignedPercentage", () => {
      expect(() =>
        SignedPercentage.create(
          null as unknown as Parameters<
            typeof SignedPercentage.create
          >[0]
        )
      ).toThrow(ValidationError)
      expect(() =>
        SignedPercentage.create(
          Infinity as unknown as Parameters<
            typeof SignedPercentage.create
          >[0]
        )
      ).toThrow(ValidationError)
    })
  })
})
