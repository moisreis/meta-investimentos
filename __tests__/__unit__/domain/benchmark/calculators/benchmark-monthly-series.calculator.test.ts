import { describe, it, expect } from "vitest"
import {
  accumulateBenchmarkRates,
  calculateBenchmarkMonthlyRates,
} from "@/domain/benchmark/calculators/benchmark-monthly-series.calculator"

describe("domain/benchmark/calculators/benchmark-monthly-series.calculator", () => {
  describe("calculateBenchmarkMonthlyRates", () => {
    it("should take the latest reading of each month", () => {
      const rows = calculateBenchmarkMonthlyRates({
        entries: [
          { date: "2026-01-05T00:00:00.000Z", rate: "0.44" },
          { date: "2026-02-20T00:00:00.000Z", rate: "0.52" },
          { date: "2026-03-31T00:00:00.000Z", rate: "0.48" },
        ],
        months: ["2026-01", "2026-02", "2026-03"],
      })

      expect(rows).toEqual([
        { month: "2026-01", rate: "0.44" },
        { month: "2026-02", rate: "0.52" },
        { month: "2026-03", rate: "0.48" },
      ])
    })

    it("should keep a month without a reading as null", () => {
      const rows = calculateBenchmarkMonthlyRates({
        entries: [
          { date: "2026-05-01T00:00:00.000Z", rate: "0.40" },
        ],
        months: ["2026-01", "2026-05"],
      })

      expect(rows).toEqual([
        { month: "2026-01", rate: null },
        { month: "2026-05", rate: "0.40" },
      ])
    })

    it("should not spill a reading into a later month", () => {
      const rows = calculateBenchmarkMonthlyRates({
        entries: [
          { date: "2026-05-01T00:00:00.000Z", rate: "0.40" },
        ],
        months: ["2026-05", "2026-06", "2026-07"],
      })

      expect(rows).toEqual([
        { month: "2026-05", rate: "0.40" },
        { month: "2026-06", rate: null },
        { month: "2026-07", rate: null },
      ])
    })
  })

  describe("accumulateBenchmarkRates", () => {
    it("should chain the monthly rates", () => {
      expect(accumulateBenchmarkRates(["1.00", "2.00"])).toBe(
        "3.02"
      )
    })

    it("should ignore months without a reading", () => {
      expect(
        accumulateBenchmarkRates([null, "1.00", null, "2.00"])
      ).toBe("3.02")
    })

    it("should return null when no month holds a reading", () => {
      expect(accumulateBenchmarkRates([null, null])).toBeNull()
    })
  })
})
