import { describe, it, expect } from "vitest"

import { calculateCashFlowNet } from "@/domain/position/calculators/cash-flow-net.calculator"
import { PositiveMoney, SignedMoney } from "@/value-objects"

describe("domain/position/calculators/cash-flow-net.calculator", () => {
  describe("calculateCashFlowNet", () => {
    it("should return the net inflow when the applications exceed the withdrawals", () => {
      const applications = PositiveMoney.create("1000000")
      const withdrawals = PositiveMoney.create("250000")

      const result = calculateCashFlowNet({
        applications,
        withdrawals,
      })

      expect(result).toBeInstanceOf(SignedMoney)
      expect(result.value.toFixed(2)).toBe("750000.00")
      expect(result.isPositive).toBe(true)
    })

    it("should return a negative net flow when the withdrawals exceed the applications", () => {
      const applications = PositiveMoney.create("1000")
      const withdrawals = PositiveMoney.create("2500")

      const result = calculateCashFlowNet({
        applications,
        withdrawals,
      })

      expect(result.value.toFixed(2)).toBe("-1500.00")
      expect(result.isNegative).toBe(true)
    })

    it("should return zero when the applications equal the withdrawals", () => {
      const applications = PositiveMoney.create("1000.01")
      const withdrawals = PositiveMoney.create("1000.01")

      const result = calculateCashFlowNet({
        applications,
        withdrawals,
      })

      expect(result.value.toString()).toBe("0")
      expect(result.isZero).toBe(true)
    })

    it("should return zero when there are no applications nor withdrawals", () => {
      const applications = PositiveMoney.create("0")
      const withdrawals = PositiveMoney.create("0")

      const result = calculateCashFlowNet({
        applications,
        withdrawals,
      })

      expect(result.value.toString()).toBe("0")
    })

    it("should keep the cents of both sides when netting fractional amounts", () => {
      const applications = PositiveMoney.create("0.03")
      const withdrawals = PositiveMoney.create("0.01")

      const result = calculateCashFlowNet({
        applications,
        withdrawals,
      })

      expect(result.value.toFixed(2)).toBe("0.02")
    })

    it("should not mutate the provided totals when netting them", () => {
      const applications = PositiveMoney.create("1000.00")
      const withdrawals = PositiveMoney.create("400.00")

      calculateCashFlowNet({ applications, withdrawals })

      expect(applications.value.toString()).toBe("1000")
      expect(withdrawals.value.toString()).toBe("400")
    })
  })
})
