import { describe, it, expect } from "vitest"
import { PositiveMoney } from "@/value-objects/positive-money.vo"
import { ValidationError } from "@/errors"
import Decimal from "decimal.js"

describe("value-objects/positive-money.vo", () => {
  describe("create", () => {
    it("should create PositiveMoney from number", () => {
      const money = PositiveMoney.create(10.5)

      expect(money).toBeInstanceOf(PositiveMoney)
      expect(money.value.toFixed(2)).toBe("10.50")
    })

    it("should create PositiveMoney from string", () => {
      const money = PositiveMoney.create("10.50")

      expect(money.value.toFixed(2)).toBe("10.50")
    })

    it("should create PositiveMoney from Decimal", () => {
      const money = PositiveMoney.create(new Decimal("10.50"))

      expect(money.value.toFixed(2)).toBe("10.50")
    })

    it("should round to 2 decimal places", () => {
      const money = PositiveMoney.create("10.555")

      expect(money.value.toFixed(2)).toBe("10.56")
    })

    it("should round 10.555 to 10.56 (ROUND_HALF_UP)", () => {
      const money = PositiveMoney.create("10.555")

      expect(money.value.toFixed(2)).toBe("10.56")
    })

    it("should throw ValidationError when value is undefined", () => {
      expect(() =>
        PositiveMoney.create(
          undefined as unknown as Decimal.Value
        )
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when value is null", () => {
      expect(() =>
        PositiveMoney.create(null as unknown as Decimal.Value)
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when value is NaN", () => {
      expect(() => PositiveMoney.create(NaN)).toThrow(
        ValidationError
      )
    })

    it("should throw ValidationError when value is Infinity", () => {
      expect(() => PositiveMoney.create(Infinity)).toThrow(
        ValidationError
      )
    })

    it("should throw ValidationError when value is negative", () => {
      expect(() => PositiveMoney.create(-0.01)).toThrow(
        ValidationError
      )
      expect(() => PositiveMoney.create("-1")).toThrow(
        ValidationError
      )
    })

    it("should accept zero", () => {
      const money = PositiveMoney.create(0)

      expect(money.value.toFixed(2)).toBe("0.00")
    })

    it("should accept string zero", () => {
      const money = PositiveMoney.create("0")

      expect(money.value.toFixed(2)).toBe("0.00")
    })
  })

  describe("equals", () => {
    it("should return true for equal PositiveMoney", () => {
      const a = PositiveMoney.create("10.50")
      const b = PositiveMoney.create(10.5)

      expect(PositiveMoney.equals(a, b)).toBe(true)
    })

    it("should return false for different PositiveMoney", () => {
      const a = PositiveMoney.create("10.50")
      const b = PositiveMoney.create("10.51")

      expect(PositiveMoney.equals(a, b)).toBe(false)
    })
  })

  describe("value getter", () => {
    it("should return Decimal instance", () => {
      const money = PositiveMoney.create("10.50")

      expect(money.value).toBeInstanceOf(Decimal)
    })
  })
})
