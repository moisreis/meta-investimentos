import { describe, it, expect } from "vitest"
import { calculateMonthlyPerformance } from "@/domain/portfolio/calculators/monthly-performance.calculator"

describe("domain/portfolio/calculators/monthly-performance.calculator", () => {
  describe("calculateMonthlyPerformance", () => {
    it("should resolve an empty row for a month without snapshots", () => {
      const rows = calculateMonthlyPerformance([], ["2026-01"])

      expect(rows).toEqual([
        {
          month: "2026-01",
          returnMonthly: null,
          target: null,
          earnings: "0.00",
          patrimony: null,
          applications: "0.00",
          withdrawals: "0.00",
        },
      ])
    })

    it("should chain the daily returns of the month", () => {
      const rows = calculateMonthlyPerformance(
        [
          {
            date: "2026-01-02T00:00:00.000Z",
            returnDaily: "1.00",
            returnMonthly: null,
            target: "0.50",
            earnings: "100.00",
            patrimony: "1000.00",
            applicationTotal: "0.00",
            redemptionTotal: "0.00",
          },
          {
            date: "2026-01-30T00:00:00.000Z",
            returnDaily: "2.00",
            returnMonthly: null,
            target: "0.50",
            earnings: "50.00",
            patrimony: "1050.00",
            applicationTotal: "10.00",
            redemptionTotal: "5.00",
          },
        ],
        ["2026-01"]
      )

      expect(rows).toEqual([
        {
          month: "2026-01",
          returnMonthly: "3.02",
          target: "0.50",
          earnings: "150.00",
          patrimony: "1050.00",
          applications: "10.00",
          withdrawals: "5.00",
        },
      ])
    })

    it("should fall back to the stored month return for a single snapshot", () => {
      const rows = calculateMonthlyPerformance(
        [
          {
            date: "2026-03-31T00:00:00.000Z",
            returnDaily: "0.10",
            returnMonthly: "1.19",
            target: "0.60",
            earnings: "20.00",
            patrimony: "2000.00",
            applicationTotal: "0.00",
            redemptionTotal: "0.00",
          },
        ],
        ["2026-03"]
      )

      expect(rows[0].returnMonthly).toBe("1.19")
    })

    it("should keep the requested month order and skip absent months", () => {
      const rows = calculateMonthlyPerformance(
        [
          {
            date: "2026-02-10T00:00:00.000Z",
            returnDaily: "1.00",
            returnMonthly: "1.00",
            target: "0.50",
            earnings: "10.00",
            patrimony: "1010.00",
            applicationTotal: "0.00",
            redemptionTotal: "0.00",
          },
        ],
        ["2026-01", "2026-02", "2026-03"]
      )

      expect(rows.map((row) => row.month)).toEqual([
        "2026-01",
        "2026-02",
        "2026-03",
      ])
      expect(rows[0].patrimony).toBeNull()
      expect(rows[1].patrimony).toBe("1010.00")
      expect(rows[2].patrimony).toBeNull()
    })
  })
})
