import { describe, it, expect } from "vitest"
import {
  IsValidMoney,
  NormalizeMoney,
  IsPositiveMoney,
  IsNegativeMoney,
} from "@/lib/money/money.validator"

describe("lib/money/money.validator", () => {
  describe("IsValidMoney", () => {
    it("should accept plain integer", () => {
      expect(IsValidMoney("1000")).toBe(true)
    })

    it("should accept decimal with comma", () => {
      expect(IsValidMoney("1234,56")).toBe(true)
    })

    it("should accept decimal with dot", () => {
      expect(IsValidMoney("1234.56")).toBe(true)
    })

    it("should accept BRL thousand separators", () => {
      expect(IsValidMoney("1.234,56")).toBe(true)
      expect(IsValidMoney("1.234.567,89")).toBe(true)
    })

    it("should accept negative values", () => {
      expect(IsValidMoney("-1234,56")).toBe(true)
      expect(IsValidMoney("-1.234,56")).toBe(true)
    })

    it("should accept trailing comma", () => {
      expect(IsValidMoney("1000,")).toBe(true)
      expect(IsValidMoney("1234,56,")).toBe(true)
    })

    it("should accept negative with trailing comma", () => {
      expect(IsValidMoney("-1000,")).toBe(true)
    })

    it("should accept up to 6 decimal places", () => {
      expect(IsValidMoney("10,123456")).toBe(true)
    })

    it("should reject empty string", () => {
      expect(IsValidMoney("")).toBe(false)
      expect(IsValidMoney("   ")).toBe(false)
    })

    it("should reject letters", () => {
      expect(IsValidMoney("abc")).toBe(false)
      expect(IsValidMoney("1000abc")).toBe(false)
    })

    it("should reject more than 6 decimals", () => {
      expect(IsValidMoney("10,1234567")).toBe(false)
    })

    it("should reject multiple decimal separators", () => {
      expect(IsValidMoney("1.234.567,89,00")).toBe(false)
    })
  })

  describe("NormalizeMoney", () => {
    it("should return plain decimal string for integer", () => {
      expect(NormalizeMoney("1000")).toBe("1000")
    })

    it("should convert comma to dot", () => {
      expect(NormalizeMoney("1234,56")).toBe("1234.56")
    })

    it("should remove BRL thousand separators", () => {
      expect(NormalizeMoney("1.234,56")).toBe("1234.56")
      expect(NormalizeMoney("1.234.567,89")).toBe("1234567.89")
    })

    it("should remove trailing comma", () => {
      expect(NormalizeMoney("1000,")).toBe("1000")
      expect(NormalizeMoney("1234,56,")).toBe("1234.56")
    })

    it("should handle negative values", () => {
      expect(NormalizeMoney("-1234,56")).toBe("-1234.56")
      expect(NormalizeMoney("-1.234,56")).toBe("-1234.56")
    })

    it("should return null for invalid shape", () => {
      expect(NormalizeMoney("abc")).toBeNull()
      expect(NormalizeMoney("")).toBeNull()
      expect(NormalizeMoney("10,1234567")).toBeNull()
    })
  })

  describe("IsPositiveMoney", () => {
    it("should return true for positive integer", () => {
      expect(IsPositiveMoney("1000")).toBe(true)
    })

    it("should return true for positive decimal", () => {
      expect(IsPositiveMoney("1234,56")).toBe(true)
      expect(IsPositiveMoney("0,01")).toBe(true)
    })

    it("should return true for BRL formatted positive", () => {
      expect(IsPositiveMoney("1.234,56")).toBe(true)
    })

    it("should return false for zero", () => {
      expect(IsPositiveMoney("0")).toBe(false)
      expect(IsPositiveMoney("0,00")).toBe(false)
    })

    it("should return false for negative", () => {
      expect(IsPositiveMoney("-1000")).toBe(false)
      expect(IsPositiveMoney("-1.234,56")).toBe(false)
    })

    it("should return false for invalid", () => {
      expect(IsPositiveMoney("abc")).toBe(false)
      expect(IsPositiveMoney("")).toBe(false)
    })

    it("should return false for negative zero", () => {
      expect(IsPositiveMoney("-0")).toBe(false)
    })
  })

  describe("IsNegativeMoney", () => {
    it("should return true for negative integer", () => {
      expect(IsNegativeMoney("-1000")).toBe(true)
    })

    it("should return true for negative decimal", () => {
      expect(IsNegativeMoney("-1234,56")).toBe(true)
      expect(IsNegativeMoney("-0,01")).toBe(true)
    })

    it("should return true for BRL formatted negative", () => {
      expect(IsNegativeMoney("-1.234,56")).toBe(true)
    })

    it("should return false for zero", () => {
      expect(IsNegativeMoney("0")).toBe(false)
      expect(IsNegativeMoney("0,00")).toBe(false)
    })

    it("should return false for positive", () => {
      expect(IsNegativeMoney("1000")).toBe(false)
      expect(IsNegativeMoney("1.234,56")).toBe(false)
    })

    it("should return false for invalid", () => {
      expect(IsNegativeMoney("abc")).toBe(false)
      expect(IsNegativeMoney("")).toBe(false)
    })

    it("should return false for negative zero", () => {
      expect(IsNegativeMoney("-0")).toBe(false)
    })
  })
})
