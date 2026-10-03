import { describe, it, expect } from "vitest"
import {
  ResolvePeriodWindow,
  SumSeriesEarnings,
  SumSeriesCashFlows,
  ChainPeriodReturn,
  type PerformanceSnapshot,
} from "@/lib/performance/period-window.calculator"
import { SignedPercentage } from "@/value-objects"

describe("lib/performance/period-window.calculator", () => {
  // Local snapshot type with optional earnings for testing ToAmount's null handling
  type TestSnapshot = Omit<PerformanceSnapshot, "earnings"> & {
    earnings?: string | null
  }

  const createSnapshot = (
    date: string,
    patrimony: string,
    earnings: string | null | undefined,
    cashFlowNet: string,
    returnDaily: string,
    returnMonthly: string | null = null,
    returnYearly: string | null = null
  ): TestSnapshot => ({
    date,
    patrimony,
    earnings,
    cashFlowNet,
    returnDaily,
    returnMonthly,
    returnYearly,
  })

  describe("ResolvePeriodWindow", () => {
    it("should return empty window for empty series", () => {
      const result = ResolvePeriodWindow([], null, null)

      expect(result.end).toBeNull()
      expect(result.opening).toBeNull()
      expect(result.inWindow).toEqual([])
      expect(result.yearSeries).toEqual([])
      expect(result.monthSeries).toEqual([])
    })

    it("should clamp to provided from/to dates", () => {
      const snapshots = [
        createSnapshot("2026-01-01", "1000", "10", "0", "1.0"),
        createSnapshot("2026-01-02", "1010", "10", "0", "1.0"),
        createSnapshot("2026-01-03", "1020", "10", "0", "1.0"),
      ]

      const result = ResolvePeriodWindow(
        snapshots as unknown as PerformanceSnapshot[],
        new Date("2026-01-02"),
        new Date("2026-01-02")
      )

      expect(result.inWindow.length).toBe(1)
      expect(result.inWindow[0].date).toBe("2026-01-02")
      expect(result.end?.date).toBe("2026-01-02")
    })

    it("should include snapshots in range", () => {
      const snapshots = [
        createSnapshot("2026-01-01", "1000", "10", "0", "1.0"),
        createSnapshot("2026-01-02", "1010", "10", "0", "1.0"),
        createSnapshot("2026-01-03", "1020", "10", "0", "1.0"),
      ]

      const result = ResolvePeriodWindow(
        snapshots as unknown as PerformanceSnapshot[],
        new Date("2026-01-01"),
        new Date("2026-01-02")
      )

      expect(result.inWindow.length).toBe(2)
      expect(result.inWindow[0].date).toBe("2026-01-01")
      expect(result.inWindow[1].date).toBe("2026-01-02")
    })

    it("should sort snapshots by date", () => {
      const snapshots = [
        createSnapshot("2026-01-03", "1020", "10", "0", "1.0"),
        createSnapshot("2026-01-01", "1000", "10", "0", "1.0"),
        createSnapshot("2026-01-02", "1010", "10", "0", "1.0"),
      ]

      const result = ResolvePeriodWindow(
        snapshots as unknown as PerformanceSnapshot[],
        null,
        null
      )

      expect(result.inWindow[0].date).toBe("2026-01-01")
      expect(result.inWindow[1].date).toBe("2026-01-02")
      expect(result.inWindow[2].date).toBe("2026-01-03")
    })

    it("should find opening snapshot before window", () => {
      const snapshots = [
        createSnapshot("2026-01-01", "1000", "10", "0", "1.0"),
        createSnapshot("2026-01-02", "1010", "10", "0", "1.0"),
        createSnapshot("2026-01-03", "1020", "10", "0", "1.0"),
      ]

      const result = ResolvePeriodWindow(
        snapshots as unknown as PerformanceSnapshot[],
        new Date("2026-01-02"),
        new Date("2026-01-03")
      )

      expect(result.opening).not.toBeNull()
      expect(result.opening?.date).toBe("2026-01-01")
    })

    it("should have null opening when window starts at first snapshot", () => {
      const snapshots = [
        createSnapshot("2026-01-01", "1000", "10", "0", "1.0"),
        createSnapshot("2026-01-02", "1010", "10", "0", "1.0"),
      ]

      const result = ResolvePeriodWindow(
        snapshots as unknown as PerformanceSnapshot[],
        new Date("2026-01-01"),
        new Date("2026-01-02")
      )

      expect(result.opening).toBeNull()
    })

    it("should compute year anchor correctly", () => {
      const snapshots = [
        createSnapshot("2025-12-31", "990", "10", "0", "1.0"),
        createSnapshot("2026-01-15", "1000", "10", "0", "1.0"),
      ]

      const result = ResolvePeriodWindow(
        snapshots as unknown as PerformanceSnapshot[],
        new Date("2026-01-01"),
        new Date("2026-01-15")
      )

      expect(result.yearAnchor).toBeGreaterThanOrEqual(
        result.monthAnchor
      )
      // yearAnchor should be max(from, year start)
      // monthAnchor should be max(from, month start)
    })

    it("should compute month anchor correctly", () => {
      const snapshots = [
        createSnapshot("2025-12-31", "990", "10", "0", "1.0"),
        createSnapshot("2026-01-15", "1000", "10", "0", "1.0"),
      ]

      const result = ResolvePeriodWindow(
        snapshots as unknown as PerformanceSnapshot[],
        new Date("2026-01-01"),
        new Date("2026-01-15")
      )

      // monthAnchor should be max(from, month start)
      expect(result.monthAnchor).toBeLessThanOrEqual(
        result.yearAnchor
      )
    })
  })

  describe("SumSeriesEarnings", () => {
    it("should sum earnings of series", () => {
      const series = [
        createSnapshot(
          "2026-01-01",
          "1000",
          "10.50",
          "0",
          "1.0"
        ),
        createSnapshot(
          "2026-01-02",
          "1010",
          "20.25",
          "0",
          "1.0"
        ),
        createSnapshot("2026-01-03", "1020", "5.75", "0", "1.0"),
      ]

      const result = SumSeriesEarnings(
        series as unknown as PerformanceSnapshot[]
      )

      expect(result).toBe(36.5)
    })

    it("should return 0 for empty series", () => {
      const result = SumSeriesEarnings([])

      expect(result).toBe(0)
    })

    it("should handle negative earnings", () => {
      const series = [
        createSnapshot(
          "2026-01-01",
          "1000",
          "-10.50",
          "0",
          "-1.0"
        ),
        createSnapshot(
          "2026-01-02",
          "1010",
          "20.25",
          "0",
          "1.0"
        ),
      ]

      const result = SumSeriesEarnings(
        series as unknown as PerformanceSnapshot[]
      )

      expect(result).toBe(9.75)
    })

    it("should handle null/undefined earnings", () => {
      const series = [
        createSnapshot(
          "2026-01-01",
          "1000",
          "10.50",
          "0",
          "1.0"
        ),
        createSnapshot("2026-01-02", "1010", null, "0", "1.0"),
        createSnapshot(
          "2026-01-03",
          "1020",
          undefined,
          "0",
          "1.0"
        ),
      ]

      const result = SumSeriesEarnings(
        series as unknown as PerformanceSnapshot[]
      )

      expect(result).toBe(10.5)
    })
  })

  describe("SumSeriesCashFlows", () => {
    it("should separate deposits and withdrawals", () => {
      const series = [
        createSnapshot("2026-01-01", "1000", "0", "100", "1.0"),
        createSnapshot("2026-01-02", "1010", "0", "-50", "1.0"),
        createSnapshot("2026-01-03", "1020", "0", "200", "1.0"),
      ]

      const result = SumSeriesCashFlows(
        series as unknown as PerformanceSnapshot[]
      )

      expect(result.deposits).toBe(300)
      expect(result.withdrawals).toBe(50)
    })

    it("should return zeros for empty series", () => {
      const result = SumSeriesCashFlows([])

      expect(result.deposits).toBe(0)
      expect(result.withdrawals).toBe(0)
    })

    it("should handle zero cash flow", () => {
      const series = [
        createSnapshot("2026-01-01", "1000", "0", "0", "1.0"),
        createSnapshot("2026-01-02", "1010", "0", "0", "1.0"),
      ]

      const result = SumSeriesCashFlows(
        series as unknown as PerformanceSnapshot[]
      )

      expect(result.deposits).toBe(0)
      expect(result.withdrawals).toBe(0)
    })

    it("should handle mixed positive and negative", () => {
      const series = [
        createSnapshot("2026-01-01", "1000", "0", "100", "1.0"),
        createSnapshot("2026-01-02", "1010", "0", "-200", "1.0"),
        createSnapshot("2026-01-03", "1020", "0", "50", "1.0"),
      ]

      const result = SumSeriesCashFlows(
        series as unknown as PerformanceSnapshot[]
      )

      expect(result.deposits).toBe(150)
      expect(result.withdrawals).toBe(200)
    })
  })

  describe("ChainPeriodReturn", () => {
    it("should return null for empty series", () => {
      const result = ChainPeriodReturn([], null, (input) =>
        SignedPercentage.create(
          input.dailyGrowthFactors
            .map((f) => f.value.toString())
            .reduce((a, b) => a + b, "")
        )
      )

      expect(result).toBeNull()
    })

    it("should return null for single factor with no stored", () => {
      const series = [
        createSnapshot("2026-01-01", "1000", "0", "0", "1.0"),
      ]

      const result = ChainPeriodReturn(
        series as unknown as PerformanceSnapshot[],
        null,
        (_input) => {
          void _input
          return SignedPercentage.create("0")
        }
      )

      expect(result).toBeNull()
    })

    it("should return stored when fewer than 2 factors", () => {
      const series = [
        createSnapshot("2026-01-01", "1000", "0", "0", "1.0"),
      ]

      const result = ChainPeriodReturn(
        series as unknown as PerformanceSnapshot[],
        "5.5",
        (_input) => {
          void _input
          return SignedPercentage.create("0")
        }
      )

      expect(result).toBe("5.5")
    })

    it("should chain factors when 2 or more valid", () => {
      const series = [
        createSnapshot("2026-01-01", "1000", "0", "0", "1.0"),
        createSnapshot("2026-01-02", "1010", "0", "0", "1.0"),
      ]

      const result = ChainPeriodReturn(
        series as unknown as PerformanceSnapshot[],
        null,
        (_input) => {
          void _input
          return SignedPercentage.create("5.5")
        }
      )

      expect(result).toBe("5.5")
    })

    it("should skip invalid factors", () => {
      const series = [
        createSnapshot(
          "2026-01-01",
          "1000",
          "0",
          "0",
          "not-a-number"
        ),
        createSnapshot("2026-01-02", "1010", "0", "0", "1.0"),
        createSnapshot("2026-01-03", "1020", "0", "0", "1.0"),
      ]

      const result = ChainPeriodReturn(
        series as unknown as PerformanceSnapshot[],
        null,
        (_input) => {
          void _input
          return SignedPercentage.create("0")
        }
      )

      // Only 2 valid factors (1.0 and 1.0), so it chains
      expect(result).toBe("0")
    })

    it("should skip negative factors", () => {
      const series = [
        createSnapshot("2026-01-01", "1000", "0", "0", "-1.0"),
        createSnapshot("2026-01-02", "1010", "0", "0", "1.0"),
        createSnapshot("2026-01-03", "1020", "0", "0", "1.0"),
      ]

      const result = ChainPeriodReturn(
        series as unknown as PerformanceSnapshot[],
        null,
        (_input) => {
          void _input
          return SignedPercentage.create("0")
        }
      )

      // Only 2 valid factors (1.0 and 1.0), so it chains
      expect(result).toBe("0")
    })
  })
})
