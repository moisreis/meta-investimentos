import { describe, it, expect } from "vitest"

import { calculatePortfolioCumulativeBenchmark } from "@/domain/benchmark/calculators/cumulative-benchmark.calculator"
import { SignedPercentage } from "@/value-objects"

describe("domain/benchmark/calculators/cumulative-benchmark.calculator", () => {
  describe("calculatePortfolioCumulativeBenchmark", () => {
    it("should compound the monthly index values into a cumulative benchmark", () => {
      const monthlyIndexValues = [
        { value: SignedPercentage.create("0.45") },
        { value: SignedPercentage.create("0.42") },
        { value: SignedPercentage.create("0.51") },
      ]

      const result = calculatePortfolioCumulativeBenchmark({
        monthlyIndexValues,
      })

      expect(result).toBeInstanceOf(SignedPercentage)
      expect(result.value.toFixed(2)).toBe("1.39")
    })

    it("should return the monthly value when a single month is provided", () => {
      const monthlyIndexValues = [
        { value: SignedPercentage.create("1.04") },
      ]

      const result = calculatePortfolioCumulativeBenchmark({
        monthlyIndexValues,
      })

      expect(result.value.toFixed(2)).toBe("1.04")
    })

    it("should return zero when no monthly index value is provided", () => {
      const result = calculatePortfolioCumulativeBenchmark({
        monthlyIndexValues: [],
      })

      expect(result).toBeInstanceOf(SignedPercentage)
      expect(result.value.toString()).toBe("0")
      expect(result.isZero).toBe(true)
    })

    it("should sum the monthly values when each one is exactly one percent", () => {
      const monthlyIndexValues = [
        { value: SignedPercentage.create("1") },
        { value: SignedPercentage.create("1") },
        { value: SignedPercentage.create("1") },
      ]

      const result = calculatePortfolioCumulativeBenchmark({
        monthlyIndexValues,
      })

      expect(result.value.toFixed(2)).toBe("3.03")
    })

    it("should keep a negative residual when a monthly loss offsets a monthly gain", () => {
      const monthlyIndexValues = [
        { value: SignedPercentage.create("1.04") },
        { value: SignedPercentage.create("-1.01") },
      ]

      const result = calculatePortfolioCumulativeBenchmark({
        monthlyIndexValues,
      })

      expect(result.value.toFixed(2)).toBe("0.02")
    })

    it("should compound monthly losses into a negative cumulative value", () => {
      const monthlyIndexValues = [
        { value: SignedPercentage.create("-0.5") },
        { value: SignedPercentage.create("-0.5") },
      ]

      const result = calculatePortfolioCumulativeBenchmark({
        monthlyIndexValues,
      })

      expect(result.value.toFixed(2)).toBe("-1.00")
      expect(result.isNegative).toBe(true)
    })

    it("should double the index when a single month doubles it", () => {
      const monthlyIndexValues = [
        { value: SignedPercentage.create("100") },
      ]

      const result = calculatePortfolioCumulativeBenchmark({
        monthlyIndexValues,
      })

      expect(result.value.toFixed(2)).toBe("100.00")
    })

    it("should round the cumulative value half up to two decimal places", () => {
      const monthlyIndexValues = Array.from(
        { length: 12 },
        () => ({
          value: SignedPercentage.create("1"),
        })
      )

      const result = calculatePortfolioCumulativeBenchmark({
        monthlyIndexValues,
      })

      expect(result.value.toFixed(2)).toBe("12.68")
    })

    it("should not mutate the provided index values when compounding them", () => {
      const first = SignedPercentage.create("0.45")
      const second = SignedPercentage.create("0.42")
      const monthlyIndexValues = [
        { value: first },
        { value: second },
      ]

      calculatePortfolioCumulativeBenchmark({
        monthlyIndexValues,
      })

      expect(first.value.toString()).toBe("0.45")
      expect(second.value.toString()).toBe("0.42")
    })
  })
})
