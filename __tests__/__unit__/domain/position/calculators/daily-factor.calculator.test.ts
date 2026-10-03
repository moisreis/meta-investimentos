import { describe, it, expect } from "vitest"

import { calculateDailyFactor } from "@/domain/position/calculators/daily-factor.calculator"
import { ValidationError } from "@/errors"
import {
  GrowthFactor,
  QuotaPrice,
  QuotaQuantity,
  SignedMoney,
} from "@/value-objects"

describe("domain/position/calculators/daily-factor.calculator", () => {
  describe("calculateDailyFactor", () => {
    it("should return a factor slightly above one when the quota price rises without cash flow", () => {
      const currentDayQuotaValue = QuotaPrice.create("4.424818")
      const currentDayQuotaQuantity =
        QuotaQuantity.create("342021.111191")
      const currentDayCashFlow = SignedMoney.create("0")
      const previousDayQuotaValue = QuotaPrice.create("4.423720")
      const previousDayQuotaQuantity =
        QuotaQuantity.create("342021.111191")

      const result = calculateDailyFactor({
        currentDayQuotaValue,
        currentDayQuotaQuantity,
        currentDayCashFlow,
        previousDayQuotaValue,
        previousDayQuotaQuantity,
      })

      expect(result).toBeInstanceOf(GrowthFactor)
      expect(result.value.toFixed(8)).toBe("1.00024821")
      expect(result.isGain).toBe(true)
    })

    it("should cancel the quantity out and reduce to the price ratio when both days hold the same quantity", () => {
      const currentDayQuotaValue = QuotaPrice.create("10")
      const currentDayQuotaQuantity = QuotaQuantity.create("100")
      const currentDayCashFlow = SignedMoney.create("0")
      const previousDayQuotaValue = QuotaPrice.create("9")
      const previousDayQuotaQuantity =
        QuotaQuantity.create("100")

      const result = calculateDailyFactor({
        currentDayQuotaValue,
        currentDayQuotaQuantity,
        currentDayCashFlow,
        previousDayQuotaValue,
        previousDayQuotaQuantity,
      })

      expect(result.value.toFixed(8)).toBe("1.11111111")
    })

    it("should round the factor half up to eight decimal places when the ratio repeats", () => {
      const currentDayQuotaValue = QuotaPrice.create("1")
      const currentDayQuotaQuantity = QuotaQuantity.create("1")
      const currentDayCashFlow = SignedMoney.create("0")
      const previousDayQuotaValue = QuotaPrice.create("3")
      const previousDayQuotaQuantity = QuotaQuantity.create("1")

      const result = calculateDailyFactor({
        currentDayQuotaValue,
        currentDayQuotaQuantity,
        currentDayCashFlow,
        previousDayQuotaValue,
        previousDayQuotaQuantity,
      })

      expect(result.value.toFixed(8)).toBe("0.33333333")
    })

    it("should return a zero factor when the cash flow absorbs the whole current day value", () => {
      const currentDayQuotaValue = QuotaPrice.create("10")
      const currentDayQuotaQuantity = QuotaQuantity.create("100")
      const currentDayCashFlow = SignedMoney.create("1000")
      const previousDayQuotaValue = QuotaPrice.create("9")
      const previousDayQuotaQuantity =
        QuotaQuantity.create("100")

      const result = calculateDailyFactor({
        currentDayQuotaValue,
        currentDayQuotaQuantity,
        currentDayCashFlow,
        previousDayQuotaValue,
        previousDayQuotaQuantity,
      })

      expect(result.value.toString()).toBe("0")
      expect(result.isFlat).toBe(false)
      expect(result.isLoss).toBe(true)
    })

    it("should raise the factor when the cash flow is negative because quotas were redeemed", () => {
      const currentDayQuotaValue = QuotaPrice.create("10")
      const currentDayQuotaQuantity = QuotaQuantity.create("100")
      const currentDayCashFlow = SignedMoney.create("-1000")
      const previousDayQuotaValue = QuotaPrice.create("9")
      const previousDayQuotaQuantity =
        QuotaQuantity.create("100")

      const result = calculateDailyFactor({
        currentDayQuotaValue,
        currentDayQuotaQuantity,
        currentDayCashFlow,
        previousDayQuotaValue,
        previousDayQuotaQuantity,
      })

      expect(result.value.toFixed(8)).toBe("2.22222222")
    })

    it("should throw ValidationError when the previous day quantity is zero", () => {
      const currentDayQuotaValue = QuotaPrice.create("10")
      const currentDayQuotaQuantity = QuotaQuantity.create("100")
      const currentDayCashFlow = SignedMoney.create("0")
      const previousDayQuotaValue = QuotaPrice.create("9")
      const previousDayQuotaQuantity = QuotaQuantity.create("0")

      expect(() =>
        calculateDailyFactor({
          currentDayQuotaValue,
          currentDayQuotaQuantity,
          currentDayCashFlow,
          previousDayQuotaValue,
          previousDayQuotaQuantity,
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when the previous day quota value is zero", () => {
      const currentDayQuotaValue = QuotaPrice.create("10")
      const currentDayQuotaQuantity = QuotaQuantity.create("100")
      const currentDayCashFlow = SignedMoney.create("0")
      const previousDayQuotaValue = QuotaPrice.create("0")
      const previousDayQuotaQuantity =
        QuotaQuantity.create("100")

      expect(() =>
        calculateDailyFactor({
          currentDayQuotaValue,
          currentDayQuotaQuantity,
          currentDayCashFlow,
          previousDayQuotaValue,
          previousDayQuotaQuantity,
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when both previous day inputs are zero", () => {
      const currentDayQuotaValue = QuotaPrice.create("10")
      const currentDayQuotaQuantity = QuotaQuantity.create("100")
      const currentDayCashFlow = SignedMoney.create("0")
      const previousDayQuotaValue = QuotaPrice.create("0")
      const previousDayQuotaQuantity = QuotaQuantity.create("0")

      expect(() =>
        calculateDailyFactor({
          currentDayQuotaValue,
          currentDayQuotaQuantity,
          currentDayCashFlow,
          previousDayQuotaValue,
          previousDayQuotaQuantity,
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when the adjusted current day value turns negative", () => {
      const currentDayQuotaValue = QuotaPrice.create("10")
      const currentDayQuotaQuantity = QuotaQuantity.create("100")
      const currentDayCashFlow = SignedMoney.create("1500")
      const previousDayQuotaValue = QuotaPrice.create("9")
      const previousDayQuotaQuantity =
        QuotaQuantity.create("100")

      expect(() =>
        calculateDailyFactor({
          currentDayQuotaValue,
          currentDayQuotaQuantity,
          currentDayCashFlow,
          previousDayQuotaValue,
          previousDayQuotaQuantity,
        })
      ).toThrow(ValidationError)
    })
  })
})
