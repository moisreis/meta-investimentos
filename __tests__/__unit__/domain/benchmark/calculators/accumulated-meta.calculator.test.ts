import { describe, it, expect } from "vitest"
import { calculateAccumulatedMeta } from "@/domain/benchmark/calculators/accumulated-meta.calculator"
import { ValidationError } from "@/errors"

describe("domain/benchmark/calculators/accumulated-meta.calculator", () => {
  describe("calculateAccumulatedMeta", () => {
    it("should return null when the elapsed window is empty", () => {
      const result = calculateAccumulatedMeta({
        annualInterestRate: "5.19",
        inflationRates: [],
      })

      expect(result).toBeNull()
    })

    it("should return null when no elapsed month holds a reading", () => {
      const result = calculateAccumulatedMeta({
        annualInterestRate: "5.19",
        inflationRates: [null, null, null],
      })

      expect(result).toBeNull()
    })

    it("should add the inflation reading to the monthly rate", () => {
      // i_m = (1 + 0.0519)^(1/12) - 1 = 0.422541%
      // 0.422541 + 0.82 = 1.242541 -> rounded to 1.24
      const result = calculateAccumulatedMeta({
        annualInterestRate: "5.19",
        inflationRates: ["0.82"],
      })

      expect(result).toBe("1.24")
    })

    it("should skip the months without a reading and compound the rest", () => {
      const withGaps = calculateAccumulatedMeta({
        annualInterestRate: "5.19",
        inflationRates: ["0.33", null, "0.82"],
      })
      const withoutGaps = calculateAccumulatedMeta({
        annualInterestRate: "5.19",
        inflationRates: ["0.33", "0.82"],
      })

      expect(withGaps).toBe(withoutGaps)
      expect(withGaps).toBe("2.00")
    })

    it("should compound the monthly metas at full precision", () => {
      // The monthly metas display as 0.75, 1.12, 1.30, 1.09,
      // 1.00, 0.58, 0.49, 0.10 and 1.24. Compounding those
      // rounded figures drifts the year to 7.93.
      const result = calculateAccumulatedMeta({
        annualInterestRate: "5.19",
        inflationRates: [
          "0.33",
          "0.70",
          "0.88",
          "0.67",
          "0.58",
          "0.16",
          "0.07",
          "-0.32",
          "0.82",
        ],
      })

      expect(result).toBe("7.95")
    })

    it("should keep the sign of a negative inflation reading", () => {
      const result = calculateAccumulatedMeta({
        annualInterestRate: "0.45",
        inflationRates: ["-1.00"],
      })

      expect(result).toBe("-0.96")
    })

    it("should throw when the annual interest rate is below -100%", () => {
      expect(() =>
        calculateAccumulatedMeta({
          annualInterestRate: "-100.01",
          inflationRates: ["0.50"],
        })
      ).toThrow(ValidationError)
    })

    it("should throw on a malformed reading", () => {
      expect(() =>
        calculateAccumulatedMeta({
          annualInterestRate: "5.19",
          inflationRates: ["IPCA"],
        })
      ).toThrow(ValidationError)
    })
  })
})
