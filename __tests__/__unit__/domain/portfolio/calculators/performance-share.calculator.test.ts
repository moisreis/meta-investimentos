import { describe, it, expect } from "vitest"
import { calculatePerformanceShare } from "@/domain/portfolio/calculators/performance-share.calculator"

describe("domain/portfolio/calculators/performance-share.calculator", () => {
  describe("calculatePerformanceShare", () => {
    it("should return the value as a share of the reference", () => {
      const result = calculatePerformanceShare({
        value: "8.20",
        reference: "5.00",
      })

      expect(result).toBe("164.00")
    })

    it("should keep the sign of a negative value", () => {
      const result = calculatePerformanceShare({
        value: "-2.50",
        reference: "5.00",
      })

      expect(result).toBe("-50.00")
    })

    it("should round the share to two decimal places", () => {
      const result = calculatePerformanceShare({
        value: "1.00",
        reference: "3.00",
      })

      expect(result).toBe("33.33")
    })

    it("should return null when the value is missing", () => {
      expect(
        calculatePerformanceShare({
          value: null,
          reference: "5.00",
        })
      ).toBeNull()
    })

    it("should return null when the reference is missing", () => {
      expect(
        calculatePerformanceShare({
          value: "8.20",
          reference: null,
        })
      ).toBeNull()
    })

    it("should return null when the reference is zero", () => {
      expect(
        calculatePerformanceShare({
          value: "8.20",
          reference: "0.00",
        })
      ).toBeNull()
    })

    it("should return null when the reference is negative", () => {
      expect(
        calculatePerformanceShare({
          value: "8.20",
          reference: "-5.00",
        })
      ).toBeNull()
    })
  })
})
