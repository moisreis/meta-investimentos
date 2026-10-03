import { describe, it, expect } from "vitest"
import { QuotaPrice } from "@/value-objects/quota-price.vo"
import { ValidationError } from "@/errors"
import Decimal from "decimal.js"

describe("value-objects/quota-price.vo", () => {
  describe("create", () => {
    it("should create QuotaPrice from number", () => {
      const price = QuotaPrice.create(10.123456)

      expect(price).toBeInstanceOf(QuotaPrice)
      expect(price.value.toFixed(6)).toBe("10.123456")
    })

    it("should create QuotaPrice from string", () => {
      const price = QuotaPrice.create("10.123456")

      expect(price.value.toFixed(6)).toBe("10.123456")
    })

    it("should create QuotaPrice from Decimal", () => {
      const price = QuotaPrice.create(new Decimal("10.123456"))

      expect(price.value.toFixed(6)).toBe("10.123456")
    })

    it("should round to 6 decimal places", () => {
      const price = QuotaPrice.create("10.1234567")

      expect(price.value.toFixed(6)).toBe("10.123457")
    })

    it("should throw ValidationError when value is undefined", () => {
      expect(() =>
        QuotaPrice.create(undefined as unknown as Decimal.Value)
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when value is null", () => {
      expect(() =>
        QuotaPrice.create(null as unknown as Decimal.Value)
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when value is NaN", () => {
      expect(() => QuotaPrice.create(NaN)).toThrow(
        ValidationError
      )
    })

    it("should throw ValidationError when value is Infinity", () => {
      expect(() => QuotaPrice.create(Infinity)).toThrow(
        ValidationError
      )
    })

    it("should throw ValidationError when value is negative", () => {
      expect(() => QuotaPrice.create(-0.01)).toThrow(
        ValidationError
      )
      expect(() => QuotaPrice.create("-1")).toThrow(
        ValidationError
      )
    })

    it("should accept zero", () => {
      const price = QuotaPrice.create(0)

      expect(price.value.toFixed(6)).toBe("0.000000")
    })
  })

  describe("equals", () => {
    it("should return true for equal QuotaPrice", () => {
      const a = QuotaPrice.create("10.123456")
      const b = QuotaPrice.create(10.123456)

      expect(QuotaPrice.equals(a, b)).toBe(true)
    })

    it("should return false for different QuotaPrice", () => {
      const a = QuotaPrice.create("10.123456")
      const b = QuotaPrice.create("10.123457")

      expect(QuotaPrice.equals(a, b)).toBe(false)
    })
  })

  describe("value getter", () => {
    it("should return Decimal instance", () => {
      const price = QuotaPrice.create("10.123456")

      expect(price.value).toBeInstanceOf(Decimal)
    })
  })
})
