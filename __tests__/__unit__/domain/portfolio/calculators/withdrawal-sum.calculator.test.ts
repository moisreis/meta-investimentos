import { describe, it, expect } from "vitest"
import { calculatePortfolioWithdrawalSum } from "@/domain/portfolio/calculators/withdrawal-sum.calculator"
import { ValidationError } from "@/errors"
import { PositiveMoney } from "@/value-objects"

describe("domain/portfolio/calculators/withdrawal-sum.calculator", () => {
  describe("calculatePortfolioWithdrawalSum", () => {
    it("should return zero sum when withdrawals list is empty", () => {
      const withdrawal: { value: PositiveMoney }[] = []

      const result = calculatePortfolioWithdrawalSum({
        withdrawal,
      })

      expect(result.value.toFixed(2)).toBe("0.00")
    })

    it("should sum all withdrawal amounts with single item", () => {
      const withdrawal: { value: PositiveMoney }[] = [
        { value: PositiveMoney.create("1000000") },
      ]

      const result = calculatePortfolioWithdrawalSum({
        withdrawal,
      })

      expect(result.value.toFixed(2)).toBe("1000000.00")
    })

    it("should sum all withdrawal amounts with multiple items", () => {
      const withdrawal: { value: PositiveMoney }[] = [
        { value: PositiveMoney.create("1000000") },
        { value: PositiveMoney.create("1000000") },
        { value: PositiveMoney.create("0") },
        { value: PositiveMoney.create("500000") },
      ]

      const result = calculatePortfolioWithdrawalSum({
        withdrawal,
      })

      expect(result.value.toFixed(2)).toBe("2500000.00")
    })

    it("should handle decimal values correctly", () => {
      const withdrawal: { value: PositiveMoney }[] = [
        { value: PositiveMoney.create("1500.75") },
        { value: PositiveMoney.create("500.25") },
      ]

      const result = calculatePortfolioWithdrawalSum({
        withdrawal,
      })

      expect(result.value.toFixed(2)).toBe("2001.00")
    })

    it("should apply money precision on sum", () => {
      const withdrawal: { value: PositiveMoney }[] = [
        { value: PositiveMoney.create("10.333") },
        { value: PositiveMoney.create("10.333") },
      ]

      const result = calculatePortfolioWithdrawalSum({
        withdrawal,
      })

      // Each 10.333 rounds to 10.33 (2dp), sum = 20.66
      expect(result.value.toFixed(2)).toBe("20.66")
    })

    it("should throw ValidationError when withdrawal amount is invalid", () => {
      expect(() => PositiveMoney.create("-100")).toThrow(
        ValidationError
      )
      expect(() =>
        PositiveMoney.create(
          null as unknown as Parameters<
            typeof PositiveMoney.create
          >[0]
        )
      ).toThrow(ValidationError)
      expect(() => PositiveMoney.create("not-a-number")).toThrow(
        ValidationError
      )
    })
  })
})
