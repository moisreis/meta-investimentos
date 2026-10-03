import { describe, it, expect } from "vitest"
import { calculatePortfolioCashFlowNet } from "@/domain/portfolio/calculators/cash-flow-net.calculator"
import { ValidationError } from "@/errors"
import { PositiveMoney, SignedMoney } from "@/value-objects"

describe("domain/portfolio/calculators/cash-flow-net.calculator", () => {
  describe("calculatePortfolioCashFlowNet", () => {
    it("should return positive signed money when applications exceed withdrawals", () => {
      const applications = PositiveMoney.create("5140000")
      const withdrawals = PositiveMoney.create("4000000")

      const result = calculatePortfolioCashFlowNet({
        applications,
        withdrawals,
      })

      expect(result.value.toFixed(2)).toBe("1140000.00")
      expect(result).toBeInstanceOf(SignedMoney)
    })

    it("should return zero when applications equal withdrawals", () => {
      const applications = PositiveMoney.create("5000000")
      const withdrawals = PositiveMoney.create("5000000")

      const result = calculatePortfolioCashFlowNet({
        applications,
        withdrawals,
      })

      expect(result.value.toFixed(2)).toBe("0.00")
    })

    it("should return negative signed money when withdrawals exceed applications", () => {
      const applications = PositiveMoney.create("4000000")
      const withdrawals = PositiveMoney.create("5140000")

      const result = calculatePortfolioCashFlowNet({
        applications,
        withdrawals,
      })

      expect(result.value.toFixed(2)).toBe("-1140000.00")
    })

    it("should handle decimal values correctly", () => {
      const applications = PositiveMoney.create("1000.50")
      const withdrawals = PositiveMoney.create("500.25")

      const result = calculatePortfolioCashFlowNet({
        applications,
        withdrawals,
      })

      expect(result.value.toFixed(2)).toBe("500.25")
    })

    it("should handle zero applications", () => {
      const applications = PositiveMoney.create("0")
      const withdrawals = PositiveMoney.create("1000000")

      const result = calculatePortfolioCashFlowNet({
        applications,
        withdrawals,
      })

      expect(result.value.toFixed(2)).toBe("-1000000.00")
    })

    it("should handle zero withdrawals", () => {
      const applications = PositiveMoney.create("1000000")
      const withdrawals = PositiveMoney.create("0")

      const result = calculatePortfolioCashFlowNet({
        applications,
        withdrawals,
      })

      expect(result.value.toFixed(2)).toBe("1000000.00")
    })

    it("should throw ValidationError when creating invalid PositiveMoney", () => {
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
    })
  })
})
