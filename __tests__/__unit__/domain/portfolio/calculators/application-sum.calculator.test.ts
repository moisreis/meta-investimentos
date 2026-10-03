import { describe, it, expect } from "vitest"
import { calculatePortfolioApplicationSum } from "@/domain/portfolio/calculators/application-sum.calculator"
import { ValidationError } from "@/errors"
import { PositiveMoney } from "@/value-objects"

describe("domain/portfolio/calculators/application-sum.calculator", () => {
  describe("calculatePortfolioApplicationSum", () => {
    it("should return zero sum when applications list is empty", () => {
      const application: { value: PositiveMoney }[] = []

      const result = calculatePortfolioApplicationSum({
        application,
      })

      expect(result.value.toFixed(2)).toBe("0.00")
    })

    it("should sum all application amounts when list has single item", () => {
      const application: { value: PositiveMoney }[] = [
        { value: PositiveMoney.create("1000000") },
      ]

      const result = calculatePortfolioApplicationSum({
        application,
      })

      expect(result.value.toFixed(2)).toBe("1000000.00")
    })

    it("should sum all application amounts when list has multiple items", () => {
      const application: { value: PositiveMoney }[] = [
        { value: PositiveMoney.create("1000000") },
        { value: PositiveMoney.create("1100000") },
        { value: PositiveMoney.create("0") },
        { value: PositiveMoney.create("1000000") },
      ]

      const result = calculatePortfolioApplicationSum({
        application,
      })

      expect(result.value.toFixed(2)).toBe("3100000.00")
    })

    it("should handle decimal values correctly when summing", () => {
      const application: { value: PositiveMoney }[] = [
        { value: PositiveMoney.create("1000.50") },
        { value: PositiveMoney.create("2000.25") },
      ]

      const result = calculatePortfolioApplicationSum({
        application,
      })

      expect(result.value.toFixed(2)).toBe("3000.75")
    })

    it("should apply money precision when summing values with many decimals", () => {
      const application: { value: PositiveMoney }[] = [
        { value: PositiveMoney.create("10.125") },
        { value: PositiveMoney.create("10.125") },
      ]

      const result = calculatePortfolioApplicationSum({
        application,
      })

      expect(result.value.toFixed(2)).toBe("20.26")
    })

    it("should throw ValidationError when application amount is invalid", () => {
      expect(() => PositiveMoney.create("-1")).toThrow(
        ValidationError
      )
      expect(() =>
        PositiveMoney.create(
          null as unknown as Parameters<
            typeof PositiveMoney.create
          >[0]
        )
      ).toThrow(ValidationError)
      expect(() => PositiveMoney.create("")).toThrow(
        ValidationError
      )
    })
  })
})
