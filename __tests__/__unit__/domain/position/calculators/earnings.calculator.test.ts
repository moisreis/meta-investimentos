import { describe, it, expect } from "vitest"

import { calculateEarnings } from "@/domain/position/calculators/earnings.calculator"
import { SignedMoney } from "@/value-objects"

describe("domain/position/calculators/earnings.calculator", () => {
  describe("calculateEarnings", () => {
    it("should return the profit when the balance grew without cash flow", () => {
      const currentBalance = SignedMoney.create("1534123.40")
      const initialBalance = SignedMoney.create("1513005.63")
      const cashFlow = SignedMoney.create("0.00")

      const result = calculateEarnings({
        currentBalance,
        initialBalance,
        cashFlow,
      })

      expect(result).toBeInstanceOf(SignedMoney)
      expect(result.value.toFixed(2)).toBe("21117.77")
      expect(result.isPositive).toBe(true)
    })

    it("should remove the cash flow from the balance growth when there was a net inflow", () => {
      const currentBalance = SignedMoney.create("1200")
      const initialBalance = SignedMoney.create("1000")
      const cashFlow = SignedMoney.create("100")

      const result = calculateEarnings({
        currentBalance,
        initialBalance,
        cashFlow,
      })

      expect(result.value.toFixed(2)).toBe("100.00")
    })

    it("should return the loss when the balance shrank below the initial one", () => {
      const currentBalance = SignedMoney.create("800")
      const initialBalance = SignedMoney.create("1000")
      const cashFlow = SignedMoney.create("100")

      const result = calculateEarnings({
        currentBalance,
        initialBalance,
        cashFlow,
      })

      expect(result.value.toFixed(2)).toBe("-300.00")
      expect(result.isNegative).toBe(true)
    })

    it("should add the outflow back when the cash flow is negative", () => {
      const currentBalance = SignedMoney.create("900")
      const initialBalance = SignedMoney.create("1000")
      const cashFlow = SignedMoney.create("-200")

      const result = calculateEarnings({
        currentBalance,
        initialBalance,
        cashFlow,
      })

      expect(result.value.toFixed(2)).toBe("100.00")
    })

    it("should return zero when the balance grew exactly by the cash flow", () => {
      const currentBalance = SignedMoney.create("1000")
      const initialBalance = SignedMoney.create("1000")
      const cashFlow = SignedMoney.create("0")

      const result = calculateEarnings({
        currentBalance,
        initialBalance,
        cashFlow,
      })

      expect(result.value.toString()).toBe("0")
      expect(result.isZero).toBe(true)
    })

    it("should return zero when every input is zero", () => {
      const currentBalance = SignedMoney.create("0")
      const initialBalance = SignedMoney.create("0")
      const cashFlow = SignedMoney.create("0")

      const result = calculateEarnings({
        currentBalance,
        initialBalance,
        cashFlow,
      })

      expect(result.value.toString()).toBe("0")
    })

    it("should not mutate the provided balances when isolating the earnings", () => {
      const currentBalance = SignedMoney.create("1200.00")
      const initialBalance = SignedMoney.create("1000.00")
      const cashFlow = SignedMoney.create("100.00")

      calculateEarnings({
        currentBalance,
        initialBalance,
        cashFlow,
      })

      expect(currentBalance.value.toString()).toBe("1200")
      expect(initialBalance.value.toString()).toBe("1000")
      expect(cashFlow.value.toString()).toBe("100")
    })
  })
})
