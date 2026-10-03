import { describe, it, expect } from "vitest"

import { calculateApplicationQuotas } from "@/domain/application/calculators/application-quotas.calculator"
import { ValidationError } from "@/errors"
import {
  PositiveMoney,
  QuotaPrice,
  QuotaQuantity,
} from "@/value-objects"

describe("domain/application/calculators/application-quotas.calculator", () => {
  describe("calculateApplicationQuotas", () => {
    it("should divide the application amount by the quota price", () => {
      const application = PositiveMoney.create("1000.00")
      const quota = QuotaPrice.create("10.00")

      const result = calculateApplicationQuotas({
        application,
        quota,
      })

      expect(result).toBeInstanceOf(QuotaQuantity)
      expect(result.value.toFixed(6)).toBe("100.000000")
    })

    it("should return the real world quota amount of a large application", () => {
      const application = PositiveMoney.create("1000000")
      const quota = QuotaPrice.create("4.428199")

      const result = calculateApplicationQuotas({
        application,
        quota,
      })

      expect(result.value.toFixed(6)).toBe("225825.442804")
    })

    it("should round the repeating quotient half up to six decimal places", () => {
      const application = PositiveMoney.create("1000.00")
      const quota = QuotaPrice.create("3.00")

      const result = calculateApplicationQuotas({
        application,
        quota,
      })

      expect(result.value.toFixed(6)).toBe("333.333333")
    })

    it("should round the quotient up on the seventh decimal digit when the price does not divide evenly", () => {
      const application = PositiveMoney.create("1000.00")
      const quota = QuotaPrice.create("7.00")

      const result = calculateApplicationQuotas({
        application,
        quota,
      })

      expect(result.value.toFixed(6)).toBe("142.857143")
    })

    it("should return the exact quotient when the price divides the amount evenly", () => {
      const application = PositiveMoney.create("1000.00")
      const quota = QuotaPrice.create("8.00")

      const result = calculateApplicationQuotas({
        application,
        quota,
      })

      expect(result.value.toString()).toBe("125")
    })

    it("should return zero quotas when the application amount is zero", () => {
      const application = PositiveMoney.create("0.00")
      const quota = QuotaPrice.create("10.50")

      const result = calculateApplicationQuotas({
        application,
        quota,
      })

      expect(result.value.toString()).toBe("0")
    })

    it("should return fractional quotas when the amount is smaller than the price", () => {
      const application = PositiveMoney.create("1.00")
      const quota = QuotaPrice.create("3.00")

      const result = calculateApplicationQuotas({
        application,
        quota,
      })

      expect(result.value.toFixed(6)).toBe("0.333333")
    })

    it("should throw ValidationError when the quota price is zero", () => {
      const application = PositiveMoney.create("1000.00")
      const quota = QuotaPrice.create("0")

      expect(() =>
        calculateApplicationQuotas({ application, quota })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when the quota price is zero and the amount is zero too", () => {
      const application = PositiveMoney.create("0.00")
      const quota = QuotaPrice.create("0.000000")

      expect(() =>
        calculateApplicationQuotas({ application, quota })
      ).toThrow(ValidationError)
    })

    it("should not mutate the provided amount nor price when dividing them", () => {
      const application = PositiveMoney.create("1000.00")
      const quota = QuotaPrice.create("8.00")

      calculateApplicationQuotas({ application, quota })

      expect(application.value.toString()).toBe("1000")
      expect(quota.value.toString()).toBe("8")
    })
  })
})
