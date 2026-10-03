import { describe, it, expect } from "vitest"
import { calculatePortfolioQuotasHeldSum } from "@/domain/portfolio/calculators/quotas-held-sum.calculator"
import { ValidationError } from "@/errors"
import { QuotaQuantity } from "@/value-objects"

describe("domain/portfolio/calculators/quotas-held-sum.calculator", () => {
  describe("calculatePortfolioQuotasHeldSum", () => {
    it("should return zero sum when quota quantities list is empty", () => {
      const quotaQuantity: { value: QuotaQuantity }[] = []

      const result = calculatePortfolioQuotasHeldSum({
        quotaQuantity,
      })

      expect(result.value.toFixed(6)).toBe("0.000000")
    })

    it("should sum all quota quantities when list has single item", () => {
      const quotaQuantity: { value: QuotaQuantity }[] = [
        { value: QuotaQuantity.create("225825.442804") },
      ]

      const result = calculatePortfolioQuotasHeldSum({
        quotaQuantity,
      })

      expect(result.value.toFixed(6)).toBe("225825.442804")
    })

    it("should sum all quota quantities when list has multiple items", () => {
      const quotaQuantity: { value: QuotaQuantity }[] = [
        { value: QuotaQuantity.create("225825.442804") },
        { value: QuotaQuantity.create("100000.000000") },
      ]

      const result = calculatePortfolioQuotasHeldSum({
        quotaQuantity,
      })

      expect(result.value.toFixed(6)).toBe("325825.442804")
    })

    it("should handle zero values in list", () => {
      const quotaQuantity: { value: QuotaQuantity }[] = [
        { value: QuotaQuantity.create("50000") },
        { value: QuotaQuantity.create("0") },
        { value: QuotaQuantity.create("25000.500000") },
      ]

      const result = calculatePortfolioQuotasHeldSum({
        quotaQuantity,
      })

      expect(result.value.toFixed(6)).toBe("75000.500000")
    })

    it("should preserve decimal precision as per QuotaQuantity", () => {
      const quotaQuantity: { value: QuotaQuantity }[] = [
        { value: QuotaQuantity.create("1.000001") },
        { value: QuotaQuantity.create("1.000002") },
      ]

      const result = calculatePortfolioQuotasHeldSum({
        quotaQuantity,
      })

      expect(result.value.toFixed(6)).toBe("2.000003")
    })

    it("should throw ValidationError when quota quantity is invalid", () => {
      expect(() => QuotaQuantity.create("-5")).toThrow(
        ValidationError
      )
      expect(() =>
        QuotaQuantity.create(
          null as unknown as Parameters<
            typeof QuotaQuantity.create
          >[0]
        )
      ).toThrow(ValidationError)
      expect(() => QuotaQuantity.create("invalid")).toThrow(
        ValidationError
      )
    })
  })
})
