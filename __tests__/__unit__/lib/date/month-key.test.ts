import { describe, it, expect } from "vitest"
import {
  BuildYearMonthKeys,
  ToMonthKey,
} from "@/lib/date/month-key"

describe("lib/date/month-key", () => {
  describe("ToMonthKey", () => {
    it("should resolve the UTC month of an instant", () => {
      expect(ToMonthKey("2026-07-31T12:00:00.000Z")).toBe(
        "2026-07"
      )
    })

    it("should pad the month number", () => {
      expect(ToMonthKey("2026-01-15T00:00:00.000Z")).toBe(
        "2026-01"
      )
    })
  })

  describe("BuildYearMonthKeys", () => {
    it("should build the twelve keys of a year, in order", () => {
      expect(BuildYearMonthKeys(2026)).toEqual([
        "2026-01",
        "2026-02",
        "2026-03",
        "2026-04",
        "2026-05",
        "2026-06",
        "2026-07",
        "2026-08",
        "2026-09",
        "2026-10",
        "2026-11",
        "2026-12",
      ])
    })
  })
})
