import { describe, it, expect } from "vitest"

import { calculateQuotasHeld } from "@/domain/position/calculators/quotas-held.calculator"
import { ValidationError } from "@/errors"
import { QuotaQuantity } from "@/value-objects"

describe("domain/position/calculators/quotas-held.calculator", () => {
  describe("calculateQuotasHeld", () => {
    it("should add the applications to the previous period and remove the withdrawals", () => {
      const lastPeriodQuotaQuantity = QuotaQuantity.create("100")
      const applicationQuotasQuantity =
        QuotaQuantity.create("50")
      const withdrawalQuotasQuantity = QuotaQuantity.create("25")

      const result = calculateQuotasHeld({
        lastPeriodQuotaQuantity,
        applicationQuotasQuantity,
        withdrawalQuotasQuantity,
      })

      expect(result).toBeInstanceOf(QuotaQuantity)
      expect(result.value.toFixed(6)).toBe("125.000000")
    })

    it("should keep the fractional quota precision of the inputs", () => {
      const lastPeriodQuotaQuantity =
        QuotaQuantity.create("342021.111191")
      const applicationQuotasQuantity =
        QuotaQuantity.create("225825.442804")
      const withdrawalQuotasQuantity =
        QuotaQuantity.create("224675.226343")

      const result = calculateQuotasHeld({
        lastPeriodQuotaQuantity,
        applicationQuotasQuantity,
        withdrawalQuotasQuantity,
      })

      expect(result.value.toFixed(6)).toBe("343171.327652")
    })

    it("should return zero when there are no quotas at all", () => {
      const lastPeriodQuotaQuantity = QuotaQuantity.create("0")
      const applicationQuotasQuantity = QuotaQuantity.create("0")
      const withdrawalQuotasQuantity = QuotaQuantity.create("0")

      const result = calculateQuotasHeld({
        lastPeriodQuotaQuantity,
        applicationQuotasQuantity,
        withdrawalQuotasQuantity,
      })

      expect(result.value.toString()).toBe("0")
    })

    it("should return zero when every held quota was withdrawn", () => {
      const lastPeriodQuotaQuantity = QuotaQuantity.create("10")
      const applicationQuotasQuantity = QuotaQuantity.create("0")
      const withdrawalQuotasQuantity = QuotaQuantity.create("10")

      const result = calculateQuotasHeld({
        lastPeriodQuotaQuantity,
        applicationQuotasQuantity,
        withdrawalQuotasQuantity,
      })

      expect(result.value.toString()).toBe("0")
    })

    it("should return the applications alone when the position started empty", () => {
      const lastPeriodQuotaQuantity = QuotaQuantity.create("0")
      const applicationQuotasQuantity =
        QuotaQuantity.create("120.75")
      const withdrawalQuotasQuantity = QuotaQuantity.create("0")

      const result = calculateQuotasHeld({
        lastPeriodQuotaQuantity,
        applicationQuotasQuantity,
        withdrawalQuotasQuantity,
      })

      expect(result.value.toFixed(6)).toBe("120.750000")
    })

    it("should round the remaining quotas to six decimal places when the fractions cancel out", () => {
      const lastPeriodQuotaQuantity = QuotaQuantity.create("0.1")
      const applicationQuotasQuantity =
        QuotaQuantity.create("0.2")
      const withdrawalQuotasQuantity =
        QuotaQuantity.create("0.3")

      const result = calculateQuotasHeld({
        lastPeriodQuotaQuantity,
        applicationQuotasQuantity,
        withdrawalQuotasQuantity,
      })

      expect(result.value.toString()).toBe("0")
    })

    it("should throw ValidationError when the withdrawals exceed the held quotas", () => {
      const lastPeriodQuotaQuantity = QuotaQuantity.create("10")
      const applicationQuotasQuantity = QuotaQuantity.create("0")
      const withdrawalQuotasQuantity = QuotaQuantity.create("20")

      expect(() =>
        calculateQuotasHeld({
          lastPeriodQuotaQuantity,
          applicationQuotasQuantity,
          withdrawalQuotasQuantity,
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when a withdrawal is made on an empty position", () => {
      const lastPeriodQuotaQuantity = QuotaQuantity.create("0")
      const applicationQuotasQuantity = QuotaQuantity.create("0")
      const withdrawalQuotasQuantity =
        QuotaQuantity.create("0.000001")

      expect(() =>
        calculateQuotasHeld({
          lastPeriodQuotaQuantity,
          applicationQuotasQuantity,
          withdrawalQuotasQuantity,
        })
      ).toThrow(ValidationError)
    })

    it("should not mutate the provided quantities when closing the period", () => {
      const lastPeriodQuotaQuantity =
        QuotaQuantity.create("100.00")
      const applicationQuotasQuantity =
        QuotaQuantity.create("50.00")
      const withdrawalQuotasQuantity =
        QuotaQuantity.create("25.00")

      calculateQuotasHeld({
        lastPeriodQuotaQuantity,
        applicationQuotasQuantity,
        withdrawalQuotasQuantity,
      })

      expect(lastPeriodQuotaQuantity.value.toString()).toBe(
        "100"
      )
      expect(applicationQuotasQuantity.value.toString()).toBe(
        "50"
      )
      expect(withdrawalQuotasQuantity.value.toString()).toBe(
        "25"
      )
    })
  })
})
