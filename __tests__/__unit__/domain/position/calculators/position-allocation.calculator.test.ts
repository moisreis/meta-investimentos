import { describe, it, expect } from "vitest"

import { calculatePositionAllocation } from "@/domain/position/calculators/position-allocation.calculator"
import { ValidationError } from "@/errors"
import { SignedPercentage } from "@/value-objects"

describe("domain/position/calculators/position-allocation.calculator", () => {
  describe("calculatePositionAllocation", () => {
    it("should give the whole portfolio to the position when it is the only one", () => {
      const result = calculatePositionAllocation({
        positionsCount: 1,
      })

      expect(result).toBeInstanceOf(SignedPercentage)
      expect(result.value.toFixed(2)).toBe("100.00")
    })

    it("should split the portfolio in half when two positions share it", () => {
      const result = calculatePositionAllocation({
        positionsCount: 2,
      })

      expect(result.value.toFixed(2)).toBe("50.00")
    })

    it("should split the portfolio in quarters when four positions share it", () => {
      const result = calculatePositionAllocation({
        positionsCount: 4,
      })

      expect(result.value.toFixed(2)).toBe("25.00")
    })

    it("should keep a half share when eight positions share it", () => {
      const result = calculatePositionAllocation({
        positionsCount: 8,
      })

      expect(result.value.toFixed(2)).toBe("12.50")
    })

    it("should round the share down to two decimal places when three positions share it", () => {
      const result = calculatePositionAllocation({
        positionsCount: 3,
      })

      expect(result.value.toFixed(2)).toBe("33.33")
    })

    it("should round the share down to two decimal places when seven positions share it", () => {
      const result = calculatePositionAllocation({
        positionsCount: 7,
      })

      expect(result.value.toFixed(2)).toBe("14.29")
    })

    it("should give one percent to the position when a hundred positions share the portfolio", () => {
      const result = calculatePositionAllocation({
        positionsCount: 100,
      })

      expect(result.value.toFixed(2)).toBe("1.00")
    })

    it("should keep a tenth of a percent when a thousand positions share the portfolio", () => {
      const result = calculatePositionAllocation({
        positionsCount: 1000,
      })

      expect(result.value.toFixed(2)).toBe("0.10")
    })

    it("should throw ValidationError when the positions count is zero", () => {
      expect(() =>
        calculatePositionAllocation({ positionsCount: 0 })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when the positions count is negative", () => {
      expect(() =>
        calculatePositionAllocation({ positionsCount: -1 })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when the positions count is not an integer", () => {
      expect(() =>
        calculatePositionAllocation({ positionsCount: 1.5 })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when the positions count is not a number", () => {
      expect(() =>
        calculatePositionAllocation({
          positionsCount: Number.NaN,
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when the positions count is infinite", () => {
      expect(() =>
        calculatePositionAllocation({
          positionsCount: Number.POSITIVE_INFINITY,
        })
      ).toThrow(ValidationError)
    })
  })
})
