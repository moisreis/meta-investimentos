import { describe, it, expect } from "vitest"
import { IsValidPercentage } from "@/lib/validation/percentage.validation"

describe("lib/validation/percentage.validation", () => {
  describe("IsValidPercentage", () => {
    it("should accept integer percentage", () => {
      expect(IsValidPercentage("10")).toBe(true)
      expect(IsValidPercentage("0")).toBe(true)
      expect(IsValidPercentage("100")).toBe(true)
      expect(IsValidPercentage("999")).toBe(true)
    })

    it("should accept decimal with dot", () => {
      expect(IsValidPercentage("10.5")).toBe(true)
      expect(IsValidPercentage("10.50")).toBe(true)
      expect(IsValidPercentage("0.01")).toBe(true)
      expect(IsValidPercentage("999.99")).toBe(true)
    })

    it("should accept decimal with comma", () => {
      expect(IsValidPercentage("10,5")).toBe(true)
      expect(IsValidPercentage("10,50")).toBe(true)
      expect(IsValidPercentage("0,01")).toBe(true)
      expect(IsValidPercentage("999,99")).toBe(true)
    })

    it("should reject negative values", () => {
      expect(IsValidPercentage("-10")).toBe(false)
      expect(IsValidPercentage("-0,01")).toBe(false)
      expect(IsValidPercentage("-999,99")).toBe(false)
    })

    it("should reject values above 999.99", () => {
      expect(IsValidPercentage("1000")).toBe(false)
      expect(IsValidPercentage("1000,00")).toBe(false)
      expect(IsValidPercentage("9999,99")).toBe(false)
    })

    it("should reject more than 2 decimals", () => {
      expect(IsValidPercentage("10,123")).toBe(false)
      expect(IsValidPercentage("10.123")).toBe(false)
    })

    it("should reject empty string", () => {
      expect(IsValidPercentage("")).toBe(false)
      expect(IsValidPercentage("   ")).toBe(false)
    })

    it("should reject non-numeric", () => {
      expect(IsValidPercentage("abc")).toBe(false)
      expect(IsValidPercentage("10abc")).toBe(false)
    })

    it("should reject multiple decimal separators", () => {
      expect(IsValidPercentage("10.10.10")).toBe(false)
      expect(IsValidPercentage("10,10,10")).toBe(false)
    })

    it("should trim whitespace", () => {
      expect(IsValidPercentage(" 10 ")).toBe(true)
      expect(IsValidPercentage(" 10,5 ")).toBe(true)
    })

    it("should handle boundary values", () => {
      expect(IsValidPercentage("0")).toBe(true)
      expect(IsValidPercentage("0.00")).toBe(true)
      expect(IsValidPercentage("0,01")).toBe(true)
      expect(IsValidPercentage("999.99")).toBe(true)
      expect(IsValidPercentage("999,99")).toBe(true)
    })
  })
})
