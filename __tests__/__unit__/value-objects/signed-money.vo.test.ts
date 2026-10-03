import { describe, it, expect } from "vitest"
import { SignedMoney } from "@/value-objects/signed-money.vo"
import { ValidationError } from "@/errors"
import Decimal from "decimal.js"

describe("value-objects/signed-money.vo", () => {
  describe("create", () => {
    it("should create positive SignedMoney from number", () => {
      const money = SignedMoney.create(10.5)

      expect(money).toBeInstanceOf(SignedMoney)
      expect(money.value.toFixed(2)).toBe("10.50")
      expect(money.isPositive).toBe(true)
      expect(money.isNegative).toBe(false)
      expect(money.isZero).toBe(false)
    })

    it("should create negative SignedMoney from string", () => {
      const money = SignedMoney.create("-10.50")

      expect(money.value.toFixed(2)).toBe("-10.50")
      expect(money.isNegative).toBe(true)
      expect(money.isPositive).toBe(false)
    })

    it("should create zero SignedMoney", () => {
      const money = SignedMoney.create(0)

      expect(money.value.toFixed(2)).toBe("0.00")
      expect(money.isZero).toBe(true)
      expect(money.isPositive).toBe(false)
      expect(money.isNegative).toBe(false)
    })

    it("should create SignedMoney from Decimal", () => {
      const money = SignedMoney.create(new Decimal("10.50"))

      expect(money.value.toFixed(2)).toBe("10.50")
    })

    it("should round to 2 decimal places", () => {
      const money = SignedMoney.create("10.555")

      expect(money.value.toFixed(2)).toBe("10.56")
    })

    it("should round negative to 2 decimal places", () => {
      const money = SignedMoney.create("-10.555")

      expect(money.value.toFixed(2)).toBe("-10.56")
    })

    it("should throw ValidationError when value is undefined", () => {
      expect(() =>
        SignedMoney.create(undefined as unknown as Decimal.Value)
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when value is null", () => {
      expect(() =>
        SignedMoney.create(null as unknown as Decimal.Value)
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when value is NaN", () => {
      expect(() => SignedMoney.create(NaN)).toThrow(
        ValidationError
      )
    })

    it("should throw ValidationError when value is Infinity", () => {
      expect(() => SignedMoney.create(Infinity)).toThrow(
        ValidationError
      )
    })
  })

  describe("equals", () => {
    it("should return true for equal SignedMoney", () => {
      const a = SignedMoney.create("10.50")
      const b = SignedMoney.create(10.5)

      expect(SignedMoney.equals(a, b)).toBe(true)
    })

    it("should return true for equal negative SignedMoney", () => {
      const a = SignedMoney.create("-10.50")
      const b = SignedMoney.create(-10.5)

      expect(SignedMoney.equals(a, b)).toBe(true)
    })

    it("should return false for different SignedMoney", () => {
      const a = SignedMoney.create("10.50")
      const b = SignedMoney.create("10.51")

      expect(SignedMoney.equals(a, b)).toBe(false)
    })
  })

  describe("isPositive / isNegative / isZero", () => {
    it("should correctly identify positive", () => {
      expect(SignedMoney.create("0.01").isPositive).toBe(true)
      expect(SignedMoney.create("100").isPositive).toBe(true)
    })

    it("should correctly identify negative", () => {
      expect(SignedMoney.create("-0.01").isNegative).toBe(true)
      expect(SignedMoney.create("-100").isNegative).toBe(true)
    })

    it("should correctly identify zero", () => {
      expect(SignedMoney.create("0").isZero).toBe(true)
      expect(SignedMoney.create("0.00").isZero).toBe(true)
    })
  })

  describe("value getter", () => {
    it("should return Decimal instance", () => {
      const money = SignedMoney.create("10.50")

      expect(money.value).toBeInstanceOf(Decimal)
    })
  })
})
