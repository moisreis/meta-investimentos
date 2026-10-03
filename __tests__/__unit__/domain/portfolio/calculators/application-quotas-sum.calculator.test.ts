import { describe, it, expect } from "vitest"
import { calculatePortfolioApplicationQuotasSum } from "@/domain/portfolio/calculators/application-quotas-sum.calculator"
import { ValidationError } from "@/errors"
import { QuotaQuantity } from "@/value-objects"

describe("domain/portfolio/calculators/application-quotas-sum.calculator", () => {
  describe("calculatePortfolioApplicationQuotasSum", () => {
    it("should return zero sum when quota quantities list is empty", () => {
      const quotaQuantity: { value: QuotaQuantity }[] = []

      const result = calculatePortfolioApplicationQuotasSum({
        quotaQuantity,
      })

      expect(result.value.toFixed(6)).toBe("0.000000")
    })

    it("should sum all quota quantities when list has single item", () => {
      const quotaQuantity: { value: QuotaQuantity }[] = [
        { value: QuotaQuantity.create("225825.442804") },
      ]

      const result = calculatePortfolioApplicationQuotasSum({
        quotaQuantity,
      })

      expect(result.value.toFixed(6)).toBe("225825.442804")
    })

    it("should sum all quota quantities when list has multiple items", () => {
      const quotaQuantity: { value: QuotaQuantity }[] = [
        { value: QuotaQuantity.create("225825.442804") },
        { value: QuotaQuantity.create("200000.000000") },
      ]

      const result = calculatePortfolioApplicationQuotasSum({
        quotaQuantity,
      })

      expect(result.value.toFixed(6)).toBe("425825.442804")
    })

    it("should handle zero values when included in list", () => {
      const quotaQuantity: { value: QuotaQuantity }[] = [
        { value: QuotaQuantity.create("100000.000000") },
        { value: QuotaQuantity.create("0") },
        { value: QuotaQuantity.create("50000.500000") },
      ]

      const result = calculatePortfolioApplicationQuotasSum({
        quotaQuantity,
      })

      expect(result.value.toFixed(6)).toBe("150000.500000")
    })

    it("should apply decimal precision according to value object when summing", () => {
      const quotaQuantity: { value: QuotaQuantity }[] = [
        { value: QuotaQuantity.create("0.123456") },
        { value: QuotaQuantity.create("0.123456") },
      ]

      const result = calculatePortfolioApplicationQuotasSum({
        quotaQuantity,
      })

      expect(result.value.toFixed(6)).toBe("0.246912")
    })

    it("should throw ValidationError when quota quantity is invalid", () => {
      expect(() => QuotaQuantity.create("-1")).toThrow(
        ValidationError
      )
      expect(() => QuotaQuantity.create("")).toThrow(
        ValidationError
      )
      expect(() =>
        QuotaQuantity.create(
          null as unknown as Parameters<
            typeof QuotaQuantity.create
          >[0]
        )
      ).toThrow(ValidationError)
    })
  })
})
