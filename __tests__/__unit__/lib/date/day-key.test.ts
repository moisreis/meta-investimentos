import { describe, it, expect } from "vitest"
import {
  FromDayKey,
  FromStoredDayValue,
  ToDayKey,
} from "@/lib/date/day-key"

describe("lib/date/day-key", () => {
  describe("ToDayKey", () => {
    it("should format date as yyyy-MM-dd", () => {
      const date = new Date(2026, 7, 31) // August 31, 2026

      const result = ToDayKey(date)

      expect(result).toBe("2026-08-31")
    })

    it("should use local date components", () => {
      const date = new Date(2026, 11, 31, 23, 59) // Dec 31, 2026 23:59 local

      const result = ToDayKey(date)

      expect(result).toBe("2026-12-31")
    })

    it("should handle leap day", () => {
      const date = new Date(2024, 1, 29) // Feb 29, 2024

      const result = ToDayKey(date)

      expect(result).toBe("2024-02-29")
    })

    it("should handle year boundary", () => {
      const date = new Date(2025, 0, 1) // Jan 1, 2025

      const result = ToDayKey(date)

      expect(result).toBe("2025-01-01")
    })
  })

  describe("FromDayKey", () => {
    it("should parse yyyy-MM-dd into local date", () => {
      const result = FromDayKey("2026-08-31")

      expect(result).toBeInstanceOf(Date)
      expect(result?.getFullYear()).toBe(2026)
      expect(result?.getMonth()).toBe(7) // August is month 7 (0-indexed)
      expect(result?.getDate()).toBe(31)
    })

    it("should return undefined for empty string", () => {
      expect(FromDayKey("")).toBeUndefined()
      expect(FromDayKey("   ")).toBeUndefined()
    })

    it("should return undefined for null/undefined input", () => {
      expect(
        FromDayKey(null as unknown as string)
      ).toBeUndefined()
      expect(
        FromDayKey(undefined as unknown as string)
      ).toBeUndefined()
    })

    it("should return undefined for invalid format", () => {
      // new Date() is very lenient and accepts many formats
      // Use strings that definitely produce NaN
      expect(FromDayKey("not-a-date")).toBeUndefined()
      expect(FromDayKey("")).toBeUndefined()
      expect(FromDayKey("   ")).toBeUndefined()
    })

    it("should parse ISO string as instant", () => {
      const result = FromDayKey("2026-08-31T12:00:00.000Z")

      expect(result).toBeInstanceOf(Date)
      // ISO string is parsed as UTC instant
    })

    it("should return undefined for unparseable ISO string", () => {
      expect(FromDayKey("not-an-iso-string")).toBeUndefined()
    })

    it("should handle year boundary", () => {
      const result = FromDayKey("2025-01-01")

      expect(result?.getFullYear()).toBe(2025)
      expect(result?.getMonth()).toBe(0)
      expect(result?.getDate()).toBe(1)
    })

    it("should handle leap day", () => {
      const result = FromDayKey("2024-02-29")

      expect(result?.getFullYear()).toBe(2024)
      expect(result?.getMonth()).toBe(1)
      expect(result?.getDate()).toBe(29)
    })
  })

  describe("roundtrip", () => {
    it("should preserve day when roundtripping", () => {
      const original = new Date(2026, 7, 31)
      const key = ToDayKey(original)
      const parsed = FromDayKey(key)

      expect(parsed?.getFullYear()).toBe(original.getFullYear())
      expect(parsed?.getMonth()).toBe(original.getMonth())
      expect(parsed?.getDate()).toBe(original.getDate())
    })
  })

  describe("FromStoredDayValue", () => {
    it("should parse yyyy-MM-dd into the same local date FromDayKey builds", () => {
      const key = FromStoredDayValue("2026-07-01")
      const plain = FromDayKey("2026-07-01")

      expect(key?.getFullYear()).toBe(2026)
      expect(key?.getMonth()).toBe(6)
      expect(key?.getDate()).toBe(1)
      expect(key?.getTime()).toBe(plain?.getTime())
    })

    it("should read a UTC midnight ISO value as the day it stores", () => {
      // A stored `date` column serializes at UTC midnight.
      // The picked day must be the stored day, not the local
      // day the instant falls on when the offset is negative.
      const result = FromStoredDayValue(
        "2026-07-01T00:00:00.000Z"
      )

      expect(result?.getFullYear()).toBe(2026)
      expect(result?.getMonth()).toBe(6)
      expect(result?.getDate()).toBe(1)
    })

    it("should return undefined for empty or unparseable values", () => {
      expect(FromStoredDayValue("")).toBeUndefined()
      expect(FromStoredDayValue("   ")).toBeUndefined()
      expect(
        FromStoredDayValue("not-a-date")
      ).toBeUndefined()
    })

    it("should handle leap day stored as UTC midnight", () => {
      const result = FromStoredDayValue(
        "2024-02-29T00:00:00.000Z"
      )

      expect(result?.getFullYear()).toBe(2024)
      expect(result?.getMonth()).toBe(1)
      expect(result?.getDate()).toBe(29)
    })
  })
})
