import { describe, it, expect } from "vitest"
import { GrowthFactor } from "@/value-objects/growth-factor.vo"
import { ValidationError } from "@/errors"
import Decimal from "decimal.js"

describe("value-objects/growth-factor.vo", () => {
  describe("create", () => {
    it("should create GrowthFactor from number", () => {
      const factor = GrowthFactor.create(1.05)

      expect(factor).toBeInstanceOf(GrowthFactor)
      expect(factor.value.toFixed(8)).toBe("1.05000000")
    })

    it("should create GrowthFactor from string", () => {
      const factor = GrowthFactor.create("1.05")

      expect(factor.value.toFixed(8)).toBe("1.05000000")
    })

    it("should create GrowthFactor from Decimal", () => {
      const factor = GrowthFactor.create(new Decimal("1.05"))

      expect(factor.value.toFixed(8)).toBe("1.05000000")
    })

    it("should round to 8 decimal places", () => {
      const factor = GrowthFactor.create("1.1234567890123")

      expect(factor.value.toFixed(8)).toBe("1.12345679")
    })

    it("should throw ValidationError when value is undefined", () => {
      expect(() =>
        GrowthFactor.create(
          undefined as unknown as Decimal.Value
        )
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when value is null", () => {
      expect(() =>
        GrowthFactor.create(null as unknown as Decimal.Value)
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when value is NaN", () => {
      expect(() => GrowthFactor.create(NaN)).toThrow(
        ValidationError
      )
    })

    it("should throw ValidationError when value is Infinity", () => {
      expect(() => GrowthFactor.create(Infinity)).toThrow(
        ValidationError
      )
    })

    it("should throw ValidationError when value is negative", () => {
      expect(() => GrowthFactor.create(-0.1)).toThrow(
        ValidationError
      )
      expect(() => GrowthFactor.create(-1)).toThrow(
        ValidationError
      )
    })

    it("should accept zero", () => {
      const factor = GrowthFactor.create(0)

      expect(factor.value.toFixed(8)).toBe("0.00000000")
    })

    it("should accept exactly 1", () => {
      const factor = GrowthFactor.create(1)

      expect(factor.value.toFixed(8)).toBe("1.00000000")
    })
  })

  describe("equals", () => {
    it("should return true for equal GrowthFactors", () => {
      const a = GrowthFactor.create("1.05")
      const b = GrowthFactor.create(1.05)

      expect(GrowthFactor.equals(a, b)).toBe(true)
    })

    it("should return false for different GrowthFactors", () => {
      const a = GrowthFactor.create("1.05")
      const b = GrowthFactor.create("1.06")

      expect(GrowthFactor.equals(a, b)).toBe(false)
    })
  })

  describe("isGain", () => {
    it("should return true when value > 1", () => {
      const factor = GrowthFactor.create("1.01")

      expect(factor.isGain).toBe(true)
    })

    it("should return false when value === 1", () => {
      const factor = GrowthFactor.create("1")

      expect(factor.isGain).toBe(false)
    })

    it("should return false when value < 1", () => {
      const factor = GrowthFactor.create("0.99")

      expect(factor.isGain).toBe(false)
    })
  })

  describe("isLoss", () => {
    it("should return true when value < 1", () => {
      const factor = GrowthFactor.create("0.99")

      expect(factor.isLoss).toBe(true)
    })

    it("should return false when value === 1", () => {
      const factor = GrowthFactor.create("1")

      expect(factor.isLoss).toBe(false)
    })

    it("should return false when value > 1", () => {
      const factor = GrowthFactor.create("1.01")

      expect(factor.isLoss).toBe(false)
    })
  })

  describe("isFlat", () => {
    it("should return true when value === 1", () => {
      const factor = GrowthFactor.create("1")

      expect(factor.isFlat).toBe(true)
    })

    it("should return false when value !== 1", () => {
      expect(GrowthFactor.create("1.01").isFlat).toBe(false)
      expect(GrowthFactor.create("0.99").isFlat).toBe(false)
    })
  })

  describe("toPercentage", () => {
    it("should return (value - 1) * 100 as Decimal", () => {
      const factor = GrowthFactor.create("1.05")
      const percent = factor.toPercentage()

      expect(percent.toFixed(2)).toBe("5.00")
    })

    it("should return negative percentage for loss", () => {
      const factor = GrowthFactor.create("0.95")
      const percent = factor.toPercentage()

      expect(percent.toFixed(2)).toBe("-5.00")
    })

    it("should return zero for flat", () => {
      const factor = GrowthFactor.create("1")
      const percent = factor.toPercentage()

      expect(percent.toFixed(2)).toBe("0.00")
    })
  })

  describe("value getter", () => {
    it("should return Decimal instance", () => {
      const factor = GrowthFactor.create("1.05")

      expect(factor.value).toBeInstanceOf(Decimal)
    })
  })
})
