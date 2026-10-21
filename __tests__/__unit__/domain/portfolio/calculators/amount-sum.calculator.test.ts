import { describe, it, expect } from "vitest"
import { calculateAmountSum } from "@/domain/portfolio/calculators/amount-sum.calculator"

describe("domain/portfolio/calculators/amount-sum.calculator", () => {
  describe("calculateAmountSum", () => {
    it("should return zero when the series is empty", () => {
      const result = calculateAmountSum({ values: [] })

      expect(result).toBe("0.00")
    })

    it("should sum a single value", () => {
      const result = calculateAmountSum({ values: ["10.00"] })

      expect(result).toBe("10.00")
    })

    it("should sum positive and negative values in order", () => {
      const result = calculateAmountSum({
        values: ["10.00", "-2.50", "0.50"],
      })

      expect(result).toBe("8.00")
    })

    it("should round the total to two decimals", () => {
      const result = calculateAmountSum({
        values: ["0.014", "0.001"],
      })

      expect(result).toBe("0.02")
    })

    it("should keep a fully negative total", () => {
      const result = calculateAmountSum({
        values: ["-1.10", "-2.20"],
      })

      expect(result).toBe("-3.30")
    })
  })
})
