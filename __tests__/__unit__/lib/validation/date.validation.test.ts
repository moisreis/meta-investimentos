import { describe, it, expect } from "vitest"
import {
  DATE_SCHEMA,
  MONTH_SCHEMA,
} from "@/lib/validation/date.validation"

describe("lib/validation/date.validation", () => {
  describe("DATE_SCHEMA", () => {
    it("should accept valid yyyy-MM-dd date", () => {
      const result = DATE_SCHEMA.safeParse("2026-01-15")

      expect(result.success).toBe(true)
      expect(result.data).toBe("2026-01-15")
    })

    it("should accept leap day", () => {
      const result = DATE_SCHEMA.safeParse("2024-02-29")

      expect(result.success).toBe(true)
    })

    it("should reject empty string", () => {
      const result = DATE_SCHEMA.safeParse("")

      expect(result.success).toBe(false)
    })

    it("should reject invalid format - single digit month", () => {
      const result = DATE_SCHEMA.safeParse("2026-1-15")

      expect(result.success).toBe(false)
    })

    it("should reject invalid format - single digit day", () => {
      const result = DATE_SCHEMA.safeParse("2026-01-5")

      expect(result.success).toBe(false)
    })

    it("should reject DD-MM-yyyy format", () => {
      const result = DATE_SCHEMA.safeParse("15-01-2026")

      expect(result.success).toBe(false)
    })

    it("should reject MM/DD/YYYY format", () => {
      const result = DATE_SCHEMA.safeParse("01/15/2026")

      expect(result.success).toBe(false)
    })

    it("should reject non-date string", () => {
      const result = DATE_SCHEMA.safeParse("not-a-date")

      expect(result.success).toBe(false)
    })

    it("should accept format with month 13 (format only, no semantic check)", () => {
      const result = DATE_SCHEMA.safeParse("2026-13-01")

      expect(result.success).toBe(true)
    })

    it("should accept format with day 32 (format only, no semantic check)", () => {
      const result = DATE_SCHEMA.safeParse("2026-01-32")

      expect(result.success).toBe(true)
    })

    it("should reject null", () => {
      const result = DATE_SCHEMA.safeParse(null)
      expect(result.success).toBe(false)
    })

    it("should reject undefined", () => {
      const result = DATE_SCHEMA.safeParse(undefined)
      expect(result.success).toBe(false)
    })
  })

  describe("MONTH_SCHEMA", () => {
    it("should accept valid yyyy-MM month", () => {
      const result = MONTH_SCHEMA.safeParse("2026-01")

      expect(result.success).toBe(true)
      expect(result.data).toBe("2026-01")
    })

    it("should accept December", () => {
      const result = MONTH_SCHEMA.safeParse("2026-12")

      expect(result.success).toBe(true)
    })

    it("should reject empty string", () => {
      const result = MONTH_SCHEMA.safeParse("")

      expect(result.success).toBe(false)
    })

    it("should reject yyyy-M format", () => {
      const result = MONTH_SCHEMA.safeParse("2026-1")

      expect(result.success).toBe(false)
    })

    it("should reject full date", () => {
      const result = MONTH_SCHEMA.safeParse("2026-01-15")

      expect(result.success).toBe(false)
    })

    it("should accept format with month 13 (format only, no semantic check)", () => {
      const result = MONTH_SCHEMA.safeParse("2026-13")

      expect(result.success).toBe(true)
    })

    it("should reject non-month string", () => {
      const result = MONTH_SCHEMA.safeParse("not-a-month")

      expect(result.success).toBe(false)
    })

    it("should reject null", () => {
      const result = MONTH_SCHEMA.safeParse(null)
      expect(result.success).toBe(false)
    })

    it("should reject undefined", () => {
      const result = MONTH_SCHEMA.safeParse(undefined)
      expect(result.success).toBe(false)
    })
  })
})
