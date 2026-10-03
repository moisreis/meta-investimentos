import { describe, it, expect } from "vitest"
import { QuotaQuantity } from "@/value-objects/quota-quantity.vo"
import { ValidationError } from "@/errors"
import Decimal from "decimal.js"

describe("value-objects/quota-quantity.vo", () => {
  describe("create", () => {
    it("should create QuotaQuantity from number", () => {
      const quantity = QuotaQuantity.create(10.123456)

      expect(quantity).toBeInstanceOf(QuotaQuantity)
      expect(quantity.value.toFixed(6)).toBe("10.123456")
    })

    it("should create QuotaQuantity from string", () => {
      const quantity = QuotaQuantity.create("10.123456")

      expect(quantity.value.toFixed(6)).toBe("10.123456")
    })

    it("should create QuotaQuantity from Decimal", () => {
      const quantity = QuotaQuantity.create(
        new Decimal("10.123456")
      )

      expect(quantity.value.toFixed(6)).toBe("10.123456")
    })

    it("should round to 6 decimal places", () => {
      const quantity = QuotaQuantity.create("10.1234567")

      expect(quantity.value.toFixed(6)).toBe("10.123457")
    })

    it("should throw ValidationError when value is undefined", () => {
      expect(() =>
        QuotaQuantity.create(
          undefined as unknown as Decimal.Value
        )
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when value is null", () => {
      expect(() =>
        QuotaQuantity.create(null as unknown as Decimal.Value)
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when value is NaN", () => {
      expect(() => QuotaQuantity.create(NaN)).toThrow(
        ValidationError
      )
    })

    it("should throw ValidationError when value is Infinity", () => {
      expect(() => QuotaQuantity.create(Infinity)).toThrow(
        ValidationError
      )
    })

    it("should throw ValidationError when value is negative", () => {
      expect(() => QuotaQuantity.create(-0.01)).toThrow(
        ValidationError
      )
      expect(() => QuotaQuantity.create("-1")).toThrow(
        ValidationError
      )
    })

    it("should accept zero", () => {
      const quantity = QuotaQuantity.create(0)

      expect(quantity.value.toFixed(6)).toBe("0.000000")
    })
  })

  describe("equals", () => {
    it("should return true for equal QuotaQuantity", () => {
      const a = QuotaQuantity.create("10.123456")
      const b = QuotaQuantity.create(10.123456)

      expect(QuotaQuantity.equals(a, b)).toBe(true)
    })

    it("should return false for different QuotaQuantity", () => {
      const a = QuotaQuantity.create("10.123456")
      const b = QuotaQuantity.create("10.123457")

      expect(QuotaQuantity.equals(a, b)).toBe(false)
    })
  })

  describe("value getter", () => {
    it("should return Decimal instance", () => {
      const quantity = QuotaQuantity.create("10.123456")

      expect(quantity.value).toBeInstanceOf(Decimal)
    })
  })
})
