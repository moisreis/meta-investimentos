import { describe, it, expect } from "vitest"
import { calculatePortfolioReturn } from "@/domain/portfolio/calculators/return.calculator"
import { ValidationError } from "@/errors"
import { GrowthFactor, SignedPercentage } from "@/value-objects"

describe("domain/portfolio/calculators/return.calculator", () => {
  describe("calculatePortfolioReturn", () => {
    it("should return zero return when daily growth factors list is empty", () => {
      const dailyGrowthFactors: { value: GrowthFactor }[] = []

      const result = calculatePortfolioReturn({
        dailyGrowthFactors,
      })

      expect(result.value.toFixed(2)).toBe("0.00")
    })

    it("should return return for single growth factor", () => {
      const dailyGrowthFactors: { value: GrowthFactor }[] = [
        { value: GrowthFactor.create("1.00024821") },
      ]

      const result = calculatePortfolioReturn({
        dailyGrowthFactors,
      })

      // (1.00024821 - 1) * 100 = 0.024821 -> rounded to 2dp = 0.02
      expect(result.value.toFixed(2)).toBe("0.02")
    })

    it("should compound multiple daily growth factors correctly", () => {
      const dailyGrowthFactors: { value: GrowthFactor }[] = [
        { value: GrowthFactor.create("1.00024821") },
        { value: GrowthFactor.create("1.00076410") },
        { value: GrowthFactor.create("1.00040729") },
      ]

      const result = calculatePortfolioReturn({
        dailyGrowthFactors,
      })

      // 1.00024821 * 1.00076410 * 1.00040729 = 1.001420...
      // (1.001420 - 1) * 100 = 0.1420... -> rounded to 2dp = 0.14
      expect(result.value.toFixed(2)).toBe("0.14")
    })

    it("should calculate negative return for loss factors", () => {
      const dailyGrowthFactors: { value: GrowthFactor }[] = [
        { value: GrowthFactor.create("0.99") },
        { value: GrowthFactor.create("1.00") },
      ]

      const result = calculatePortfolioReturn({
        dailyGrowthFactors,
      })

      // (0.99 - 1) * 100 = -1.00
      expect(result.value.toFixed(2)).toBe("-1.00")
    })

    it("should compound gains and losses", () => {
      const dailyGrowthFactors: { value: GrowthFactor }[] = [
        { value: GrowthFactor.create("1.05") },
        { value: GrowthFactor.create("0.90") },
      ]

      const result = calculatePortfolioReturn({
        dailyGrowthFactors,
      })

      // (1.05 * 0.90 - 1) * 100 = -5.5 -> rounded to 2dp = -5.50
      expect(result.value.toFixed(2)).toBe("-5.50")
    })

    it("should handle factors representing flat days", () => {
      const dailyGrowthFactors: { value: GrowthFactor }[] = [
        { value: GrowthFactor.create("1.02") },
        { value: GrowthFactor.create("1.0") },
        { value: GrowthFactor.create("1.03") },
      ]

      const result = calculatePortfolioReturn({
        dailyGrowthFactors,
      })

      // 1.02 * 1.0 * 1.03 = 1.0506 -> (1.0506 - 1) * 100 = 5.06
      expect(result.value.toFixed(2)).toBe("5.06")
    })

    it("should throw ValidationError for invalid GrowthFactor", () => {
      expect(() => GrowthFactor.create("-0.1")).toThrow(
        ValidationError
      )
      expect(() =>
        GrowthFactor.create(
          null as unknown as Parameters<
            typeof GrowthFactor.create
          >[0]
        )
      ).toThrow(ValidationError)
    })

    it("should produce valid SignedPercentage", () => {
      const dailyGrowthFactors: { value: GrowthFactor }[] = [
        { value: GrowthFactor.create("1.10") },
      ]
      const result = calculatePortfolioReturn({
        dailyGrowthFactors,
      })
      expect(result).toBeInstanceOf(SignedPercentage)
    })
  })
})
