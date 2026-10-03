import { describe, it, expect } from "vitest"
import { calculatePortfolioCumulativeTarget } from "@/domain/portfolio/calculators/cumulative-target.calculator"
import { ValidationError } from "@/errors"
import { SignedPercentage } from "@/value-objects"

describe("domain/portfolio/calculators/cumulative-target.calculator", () => {
  describe("calculatePortfolioCumulativeTarget", () => {
    it("should return zero cumulative target when monthly targets list is empty", () => {
      const monthlyTargets: { value: SignedPercentage }[] = []

      const result = calculatePortfolioCumulativeTarget({
        monthlyTargets,
      })

      expect(result.value.toFixed(2)).toBe("0.00")
    })

    it("should return the same percentage when list has single target", () => {
      const monthlyTargets: { value: SignedPercentage }[] = [
        { value: SignedPercentage.create("3.57") },
      ]

      const result = calculatePortfolioCumulativeTarget({
        monthlyTargets,
      })

      expect(result.value.toFixed(2)).toBe("3.57")
    })

    it("should compound multiple positive monthly targets correctly", () => {
      const monthlyTargets: { value: SignedPercentage }[] = [
        { value: SignedPercentage.create("3.57") },
        { value: SignedPercentage.create("2.91") },
        { value: SignedPercentage.create("3.44") },
      ]

      const result = calculatePortfolioCumulativeTarget({
        monthlyTargets,
      })

      // ((1+0.0357)*(1+0.0291)*(1+0.0344)) - 1 * 100
      // 1.0357 * 1.0291 = ~1.0658 (approx) * 1.0344 = ~1.1025; so ~10.25%
      expect(result.value.toFixed(2)).toBe("10.25")
    })

    it("should compound targets including negative values", () => {
      const monthlyTargets: { value: SignedPercentage }[] = [
        { value: SignedPercentage.create("5.00") },
        { value: SignedPercentage.create("-10.00") },
      ]

      const result = calculatePortfolioCumulativeTarget({
        monthlyTargets,
      })

      // (1.05 * 0.90) - 1 = -5.5%
      expect(result.value.toFixed(2)).toBe("-5.50")
    })

    it("should handle zero percentage targets in compounding", () => {
      const monthlyTargets: { value: SignedPercentage }[] = [
        { value: SignedPercentage.create("5.00") },
        { value: SignedPercentage.create("0.00") },
        { value: SignedPercentage.create("3.00") },
      ]

      const result = calculatePortfolioCumulativeTarget({
        monthlyTargets,
      })

      // (1.05 * 1.00 * 1.03) - 1 = 8.15%
      expect(result.value.toFixed(2)).toBe("8.15")
    })

    it("should handle decimal precision in results", () => {
      const monthlyTargets: { value: SignedPercentage }[] = [
        { value: SignedPercentage.create("1.00") },
        { value: SignedPercentage.create("1.00") },
      ]

      const result = calculatePortfolioCumulativeTarget({
        monthlyTargets,
      })

      expect(result.value.toFixed(2)).toBe("2.01")
    })

    it("should throw ValidationError when percentage is invalid", () => {
      expect(() =>
        SignedPercentage.create(
          null as unknown as Parameters<
            typeof SignedPercentage.create
          >[0]
        )
      ).toThrow(ValidationError)
      expect(() => SignedPercentage.create("abc")).toThrow(
        ValidationError
      )
    })
  })
})
