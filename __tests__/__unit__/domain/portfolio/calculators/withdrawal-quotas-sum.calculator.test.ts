import { describe, it, expect } from "vitest"
import { calculatePortfolioWithdrawalQuotasSum } from "@/domain/portfolio/calculators/withdrawal-quotas-sum.calculator"
import { ValidationError } from "@/errors"
import { QuotaQuantity } from "@/value-objects"

describe("domain/portfolio/calculators/withdrawal-quotas-sum.calculator", () => {
  describe("calculatePortfolioWithdrawalQuotasSum", () => {
    it("should return zero sum when quota quantities list is empty", () => {
      const quotaQuantity: { value: QuotaQuantity }[] = []

      const result = calculatePortfolioWithdrawalQuotasSum({
        quotaQuantity,
      })

      expect(result.value.toFixed(6)).toBe("0.000000")
    })

    it("should sum all withdrawal quota quantities with single item", () => {
      const quotaQuantity: { value: QuotaQuantity }[] = [
        { value: QuotaQuantity.create("225825.142804") },
      ]

      const result = calculatePortfolioWithdrawalQuotasSum({
        quotaQuantity,
      })

      expect(result.value.toFixed(6)).toBe("225825.142804")
    })

    it("should sum all withdrawal quota quantities with multiple items", () => {
      const quotaQuantity: { value: QuotaQuantity }[] = [
        { value: QuotaQuantity.create("225825.142804") },
        { value: QuotaQuantity.create("200000.000000") },
      ]

      const result = calculatePortfolioWithdrawalQuotasSum({
        quotaQuantity,
      })

      expect(result.value.toFixed(6)).toBe("425825.142804")
    })

    it("should handle mixed values including zero", () => {
      const quotaQuantity: { value: QuotaQuantity }[] = [
        { value: QuotaQuantity.create("100000") },
        { value: QuotaQuantity.create("0") },
        { value: QuotaQuantity.create("50000.123456") },
      ]

      const result = calculatePortfolioWithdrawalQuotasSum({
        quotaQuantity,
      })

      expect(result.value.toFixed(6)).toBe("150000.123456")
    })

    it("should apply quota quantity precision on sum", () => {
      const quotaQuantity: { value: QuotaQuantity }[] = [
        { value: QuotaQuantity.create("0.333333") },
        { value: QuotaQuantity.create("0.333333") },
        { value: QuotaQuantity.create("0.333334") },
      ]

      const result = calculatePortfolioWithdrawalQuotasSum({
        quotaQuantity,
      })

      expect(result.value.toFixed(6)).toBe("1.000000")
    })

    it("should throw ValidationError when quota quantity is invalid", () => {
      expect(() => QuotaQuantity.create("-1")).toThrow(
        ValidationError
      )
      expect(() =>
        QuotaQuantity.create(
          undefined as unknown as Parameters<
            typeof QuotaQuantity.create
          >[0]
        )
      ).toThrow(ValidationError)
    })
  })
})
