import { describe, it, expect } from "vitest"

import { calculateWithdrawalQuotas } from "@/domain/withdrawal/calculators/withdrawal-quotas.calculator"
import { ValidationError } from "@/errors"
import {
  PositiveMoney,
  QuotaPrice,
  QuotaQuantity,
} from "@/value-objects"

describe("domain/withdrawal/calculators/withdrawal-quotas.calculator", () => {
  describe("calculateWithdrawalQuotas", () => {
    it("should divide the withdrawal amount by the quota price", () => {
      const withdrawal = PositiveMoney.create("1050.00")
      const quota = QuotaPrice.create("10.50")

      const result = calculateWithdrawalQuotas({
        withdrawal,
        quota,
      })

      expect(result).toBeInstanceOf(QuotaQuantity)
      expect(result.value.toFixed(6)).toBe("100.000000")
    })

    it("should return the real world quota amount of a large withdrawal", () => {
      const withdrawal = PositiveMoney.create("1000000")
      const quota = QuotaPrice.create("4.450869")

      const result = calculateWithdrawalQuotas({
        withdrawal,
        quota,
      })

      expect(result.value.toFixed(6)).toBe("224675.226343")
    })

    it("should round the repeating quotient half up to six decimal places", () => {
      const withdrawal = PositiveMoney.create("500.00")
      const quota = QuotaPrice.create("3.00")

      const result = calculateWithdrawalQuotas({
        withdrawal,
        quota,
      })

      expect(result.value.toFixed(6)).toBe("166.666667")
    })

    it("should round the quotient up on the seventh decimal digit when the price does not divide evenly", () => {
      const withdrawal = PositiveMoney.create("500.00")
      const quota = QuotaPrice.create("7.00")

      const result = calculateWithdrawalQuotas({
        withdrawal,
        quota,
      })

      expect(result.value.toFixed(6)).toBe("71.428571")
    })

    it("should return the exact quotient when the price divides the amount evenly", () => {
      const withdrawal = PositiveMoney.create("500.00")
      const quota = QuotaPrice.create("5.00")

      const result = calculateWithdrawalQuotas({
        withdrawal,
        quota,
      })

      expect(result.value.toString()).toBe("100")
    })

    it("should return zero quotas when the withdrawal amount is zero", () => {
      const withdrawal = PositiveMoney.create("0.00")
      const quota = QuotaPrice.create("4.45")

      const result = calculateWithdrawalQuotas({
        withdrawal,
        quota,
      })

      expect(result.value.toString()).toBe("0")
    })

    it("should return fractional quotas when the amount is smaller than the price", () => {
      const withdrawal = PositiveMoney.create("1.00")
      const quota = QuotaPrice.create("3.00")

      const result = calculateWithdrawalQuotas({
        withdrawal,
        quota,
      })

      expect(result.value.toFixed(6)).toBe("0.333333")
    })

    it("should throw ValidationError when the quota price is zero", () => {
      const withdrawal = PositiveMoney.create("500.00")
      const quota = QuotaPrice.create("0")

      expect(() =>
        calculateWithdrawalQuotas({ withdrawal, quota })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when the quota price is zero and the amount is zero too", () => {
      const withdrawal = PositiveMoney.create("0.00")
      const quota = QuotaPrice.create("0.000000")

      expect(() =>
        calculateWithdrawalQuotas({ withdrawal, quota })
      ).toThrow(ValidationError)
    })

    it("should not mutate the provided amount nor price when dividing them", () => {
      const withdrawal = PositiveMoney.create("500.00")
      const quota = QuotaPrice.create("5.00")

      calculateWithdrawalQuotas({ withdrawal, quota })

      expect(withdrawal.value.toString()).toBe("500")
      expect(quota.value.toString()).toBe("5")
    })
  })
})
