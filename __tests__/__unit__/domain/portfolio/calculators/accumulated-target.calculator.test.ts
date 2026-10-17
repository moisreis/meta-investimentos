import { describe, it, expect } from "vitest"
import { calculateAccumulatedTarget } from "@/domain/portfolio/calculators/accumulated-target.calculator"

describe("domain/portfolio/calculators/accumulated-target.calculator", () => {
  describe("calculateAccumulatedTarget", () => {
    it("should return null when the elapsed window is empty", () => {
      const result = calculateAccumulatedTarget({
        annualInterestRate: "0.45",
        inflationRates: [],
      })

      expect(result).toBeNull()
    })

    it("should return null when no elapsed month holds a reading", () => {
      const result = calculateAccumulatedTarget({
        annualInterestRate: "0.45",
        inflationRates: [null, null, null],
      })

      expect(result).toBeNull()
    })

    it("should return the monthly target when a single month holds a reading", () => {
      const result = calculateAccumulatedTarget({
        annualInterestRate: "0.45",
        inflationRates: ["1.00"],
      })

      expect(result).toBe("1.04")
    })

    it("should skip the months without a reading and compound the rest", () => {
      const withGaps = calculateAccumulatedTarget({
        annualInterestRate: "0.45",
        inflationRates: ["1.00", null, "2.00"],
      })
      const withoutGaps = calculateAccumulatedTarget({
        annualInterestRate: "0.45",
        inflationRates: ["1.00", "2.00"],
      })

      expect(withGaps).toBe(withoutGaps)
      expect(withGaps).toBe("3.10")
    })

    it("should compound the readings the report window holds", () => {
      const result = calculateAccumulatedTarget({
        annualInterestRate: "0.45",
        inflationRates: [null, "3.00", "0.82"],
      })

      expect(result).toBe("3.93")
    })

    it("should keep the sign of a negative inflation reading", () => {
      const result = calculateAccumulatedTarget({
        annualInterestRate: "0.45",
        inflationRates: ["-1.00"],
      })

      expect(result).toBe("-0.96")
    })
  })
})
