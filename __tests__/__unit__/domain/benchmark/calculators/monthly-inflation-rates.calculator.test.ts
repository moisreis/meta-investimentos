import { describe, it, expect } from "vitest"

import { calculateMonthlyInflationRates } from "@/domain/benchmark/calculators/monthly-inflation-rates.calculator"
import { SignedPercentage } from "@/value-objects"

function entry(month: number, rate: string, year = 2026) {
  return {
    date: new Date(Date.UTC(year, month, 1)),
    rate: SignedPercentage.create(rate),
  }
}

function ratesOf(
  month: number,
  rates: (SignedPercentage | null)[]
) {
  return rates[month]
}

describe("domain/benchmark/calculators/monthly-inflation-rates.calculator", () => {
  describe("calculateMonthlyInflationRates", () => {
    it("should return one slot for January when the target date is in January", () => {
      const result = calculateMonthlyInflationRates({
        entries: [entry(0, "0.45")],
        targetDate: new Date(Date.UTC(2026, 0, 15)),
      })

      expect(result.rates).toHaveLength(1)
      expect(ratesOf(0, result.rates)?.value.toFixed(2)).toBe(
        "0.45"
      )
    })

    it("should return every month up to the target month", () => {
      const result = calculateMonthlyInflationRates({
        entries: [
          entry(0, "0.45"),
          entry(1, "0.52"),
          entry(2, "0.61"),
          entry(3, "0.70"),
        ],
        targetDate: new Date(Date.UTC(2026, 2, 31)),
      })

      expect(result.rates).toHaveLength(3)
      expect(ratesOf(1, result.rates)?.value.toFixed(2)).toBe(
        "0.52"
      )
      expect(ratesOf(2, result.rates)?.value.toFixed(2)).toBe(
        "0.61"
      )
    })

    it("should carry the previous reading forward when the target month has none", () => {
      const result = calculateMonthlyInflationRates({
        entries: [entry(0, "0.45")],
        targetDate: new Date(Date.UTC(2026, 3, 15)),
      })

      expect(result.rates).toHaveLength(4)
      expect(ratesOf(3, result.rates)?.value.toFixed(2)).toBe(
        "0.45"
      )
    })

    it("should carry a reading from the previous year into January", () => {
      const result = calculateMonthlyInflationRates({
        entries: [entry(11, "0.58", 2025)],
        targetDate: new Date(Date.UTC(2026, 1, 10)),
      })

      expect(ratesOf(0, result.rates)?.value.toFixed(2)).toBe(
        "0.58"
      )
      expect(ratesOf(1, result.rates)?.value.toFixed(2)).toBe(
        "0.58"
      )
    })

    it("should return null for every month before the first reading", () => {
      const result = calculateMonthlyInflationRates({
        entries: [entry(4, "0.80")],
        targetDate: new Date(Date.UTC(2026, 4, 20)),
      })

      expect(ratesOf(0, result.rates)).toBeNull()
      expect(ratesOf(3, result.rates)).toBeNull()
      expect(ratesOf(4, result.rates)?.value.toFixed(2)).toBe(
        "0.80"
      )
    })

    it("should ignore readings recorded after the target month", () => {
      const result = calculateMonthlyInflationRates({
        entries: [entry(0, "0.45"), entry(5, "0.90")],
        targetDate: new Date(Date.UTC(2026, 1, 15)),
      })

      expect(result.rates).toHaveLength(2)
      expect(ratesOf(1, result.rates)?.value.toFixed(2)).toBe(
        "0.45"
      )
    })

    it("should take the latest reading of the target month", () => {
      const result = calculateMonthlyInflationRates({
        entries: [
          {
            date: new Date(Date.UTC(2026, 1, 1)),
            rate: SignedPercentage.create("0.50"),
          },
          {
            date: new Date(Date.UTC(2026, 1, 20)),
            rate: SignedPercentage.create("0.55"),
          },
        ],
        targetDate: new Date(Date.UTC(2026, 1, 28)),
      })

      expect(ratesOf(1, result.rates)?.value.toFixed(2)).toBe(
        "0.55"
      )
    })

    it("should resolve the series when the entries are given out of order", () => {
      const result = calculateMonthlyInflationRates({
        entries: [entry(2, "0.61"), entry(0, "0.45")],
        targetDate: new Date(Date.UTC(2026, 2, 10)),
      })

      expect(ratesOf(0, result.rates)?.value.toFixed(2)).toBe(
        "0.45"
      )
      expect(ratesOf(2, result.rates)?.value.toFixed(2)).toBe(
        "0.61"
      )
    })

    it("should return null slots when there is no reading at all", () => {
      const result = calculateMonthlyInflationRates({
        entries: [],
        targetDate: new Date(Date.UTC(2026, 2, 10)),
      })

      expect(result.rates).toHaveLength(3)
      expect(result.rates.every((rate) => rate === null)).toBe(
        true
      )
    })
  })
})
