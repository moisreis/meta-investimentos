import { describe, it, expect } from "vitest"

import { calculateReturn } from "@/domain/position/calculators/return.calculator"
import { GrowthFactor, SignedPercentage } from "@/value-objects"

describe("domain/position/calculators/return.calculator", () => {
  describe("calculateReturn", () => {
    it("should compound the daily factors into a cumulative return", () => {
      const dailyGrowthFactors = [
        { value: GrowthFactor.create("1.05") },
        { value: GrowthFactor.create("1.05") },
      ]

      const result = calculateReturn({ dailyGrowthFactors })

      expect(result).toBeInstanceOf(SignedPercentage)
      expect(result.value.toFixed(2)).toBe("10.25")
    })

    it("should return the daily factor return when a single day is provided", () => {
      const dailyGrowthFactors = [
        { value: GrowthFactor.create("1.05") },
      ]

      const result = calculateReturn({ dailyGrowthFactors })

      expect(result.value.toFixed(2)).toBe("5.00")
    })

    it("should return zero when no daily factor is provided", () => {
      const result = calculateReturn({ dailyGrowthFactors: [] })

      expect(result).toBeInstanceOf(SignedPercentage)
      expect(result.value.toString()).toBe("0")
      expect(result.isZero).toBe(true)
    })

    it("should return zero when every daily factor is flat", () => {
      const dailyGrowthFactors = [
        { value: GrowthFactor.create("1") },
        { value: GrowthFactor.create("1") },
        { value: GrowthFactor.create("1") },
      ]

      const result = calculateReturn({ dailyGrowthFactors })

      expect(result.value.toString()).toBe("0")
    })

    it("should return a negative return when the daily factors compound a loss", () => {
      const dailyGrowthFactors = [
        { value: GrowthFactor.create("0.9") },
        { value: GrowthFactor.create("0.9") },
      ]

      const result = calculateReturn({ dailyGrowthFactors })

      expect(result.value.toFixed(2)).toBe("-19.00")
      expect(result.isNegative).toBe(true)
    })

    it("should compensate a gain with a loss of the same size", () => {
      const dailyGrowthFactors = [
        { value: GrowthFactor.create("1.05") },
        { value: GrowthFactor.create("0.95") },
      ]

      const result = calculateReturn({ dailyGrowthFactors })

      expect(result.value.toFixed(2)).toBe("-0.25")
    })

    it("should sum the small daily factors of a real period", () => {
      const dailyGrowthFactors = [
        { value: GrowthFactor.create("1.00024821") },
        { value: GrowthFactor.create("1.00076410") },
        { value: GrowthFactor.create("1.00040729") },
      ]

      const result = calculateReturn({ dailyGrowthFactors })

      expect(result.value.toFixed(2)).toBe("0.14")
    })

    it("should round the cumulative return half up to two decimal places", () => {
      const dailyGrowthFactors = [
        { value: GrowthFactor.create("1.1") },
        { value: GrowthFactor.create("1.1") },
      ]

      const result = calculateReturn({ dailyGrowthFactors })

      expect(result.value.toFixed(2)).toBe("21.00")
    })

    it("should round a sub basis point gain to zero when the factor barely moves", () => {
      const dailyGrowthFactors = [
        { value: GrowthFactor.create("1.000000004") },
      ]

      const result = calculateReturn({ dailyGrowthFactors })

      expect(result.value.toString()).toBe("0")
    })

    it("should not mutate the provided daily factors when compounding them", () => {
      const first = GrowthFactor.create("1.05")
      const second = GrowthFactor.create("0.95")
      const dailyGrowthFactors = [
        { value: first },
        { value: second },
      ]

      calculateReturn({ dailyGrowthFactors })

      expect(first.value.toString()).toBe("1.05")
      expect(second.value.toString()).toBe("0.95")
    })
  })
})
