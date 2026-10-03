import { describe, it, expect } from "vitest"
import { SignedPercentage } from "@/value-objects/signed-percentage.vo"
import { ValidationError } from "@/errors"
import Decimal from "decimal.js"

describe("value-objects/signed-percentage.vo", () => {
  describe("create", () => {
    it("should create positive SignedPercentage from number", () => {
      const percent = SignedPercentage.create(12.34)

      expect(percent).toBeInstanceOf(SignedPercentage)
      expect(percent.value.toFixed(2)).toBe("12.34")
      expect(percent.isPositive).toBe(true)
      expect(percent.isNegative).toBe(false)
      expect(percent.isZero).toBe(false)
    })

    it("should create negative SignedPercentage from string", () => {
      const percent = SignedPercentage.create("-12.34")

      expect(percent.value.toFixed(2)).toBe("-12.34")
      expect(percent.isNegative).toBe(true)
      expect(percent.isPositive).toBe(false)
    })

    it("should create zero SignedPercentage", () => {
      const percent = SignedPercentage.create(0)

      expect(percent.value.toFixed(2)).toBe("0.00")
      expect(percent.isZero).toBe(true)
      expect(percent.isPositive).toBe(false)
      expect(percent.isNegative).toBe(false)
    })

    it("should create SignedPercentage from Decimal", () => {
      const percent = SignedPercentage.create(
        new Decimal("12.34")
      )

      expect(percent.value.toFixed(2)).toBe("12.34")
    })

    it("should round to 2 decimal places", () => {
      const percent = SignedPercentage.create("12.345")

      expect(percent.value.toFixed(2)).toBe("12.35")
    })

    it("should round negative to 2 decimal places", () => {
      const percent = SignedPercentage.create("-12.345")

      expect(percent.value.toFixed(2)).toBe("-12.35")
    })

    it("should throw ValidationError when value is undefined", () => {
      expect(() =>
        SignedPercentage.create(
          undefined as unknown as Decimal.Value
        )
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when value is null", () => {
      expect(() =>
        SignedPercentage.create(null as unknown as Decimal.Value)
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when value is NaN", () => {
      expect(() => SignedPercentage.create(NaN)).toThrow(
        ValidationError
      )
    })

    it("should throw ValidationError when value is Infinity", () => {
      expect(() => SignedPercentage.create(Infinity)).toThrow(
        ValidationError
      )
    })
  })

  describe("equals", () => {
    it("should return true for equal SignedPercentage", () => {
      const a = SignedPercentage.create("12.34")
      const b = SignedPercentage.create(12.34)

      expect(SignedPercentage.equals(a, b)).toBe(true)
    })

    it("should return true for equal negative SignedPercentage", () => {
      const a = SignedPercentage.create("-12.34")
      const b = SignedPercentage.create(-12.34)

      expect(SignedPercentage.equals(a, b)).toBe(true)
    })

    it("should return false for different SignedPercentage", () => {
      const a = SignedPercentage.create("12.34")
      const b = SignedPercentage.create("12.35")

      expect(SignedPercentage.equals(a, b)).toBe(false)
    })
  })

  describe("isPositive / isNegative / isZero", () => {
    it("should correctly identify positive", () => {
      expect(SignedPercentage.create("0.01").isPositive).toBe(
        true
      )
      expect(SignedPercentage.create("100").isPositive).toBe(
        true
      )
    })

    it("should correctly identify negative", () => {
      expect(SignedPercentage.create("-0.01").isNegative).toBe(
        true
      )
      expect(SignedPercentage.create("-100").isNegative).toBe(
        true
      )
    })

    it("should correctly identify zero", () => {
      expect(SignedPercentage.create("0").isZero).toBe(true)
      expect(SignedPercentage.create("0.00").isZero).toBe(true)
    })
  })

  describe("value getter", () => {
    it("should return Decimal instance", () => {
      const percent = SignedPercentage.create("12.34")

      expect(percent.value).toBeInstanceOf(Decimal)
    })
  })
})
