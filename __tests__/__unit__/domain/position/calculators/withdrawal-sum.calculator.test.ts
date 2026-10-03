import { describe, it, expect } from "vitest"
import Decimal from "decimal.js"

import { calculateWithdrawalSum } from "@/domain/position/calculators/withdrawal-sum.calculator"
import { PositiveMoney } from "@/value-objects"

describe("domain/position/calculators/withdrawal-sum.calculator", () => {
  describe("calculateWithdrawalSum", () => {
    it("should add every withdrawal amount when several withdrawals are provided", () => {
      const withdrawal = [
        { value: PositiveMoney.create("250000") },
        { value: PositiveMoney.create("1250.49") },
        { value: PositiveMoney.create("0.01") },
      ]

      const result = calculateWithdrawalSum({ withdrawal })

      expect(result).toBeInstanceOf(PositiveMoney)
      expect(result.value.toFixed(2)).toBe("251250.50")
    })

    it("should keep the single amount untouched when only one withdrawal is provided", () => {
      const withdrawal = [
        { value: PositiveMoney.create("1000") },
      ]

      const result = calculateWithdrawalSum({ withdrawal })

      expect(result.value.toFixed(2)).toBe("1000.00")
    })

    it("should return zero when the withdrawal list is empty", () => {
      const result = calculateWithdrawalSum({ withdrawal: [] })

      expect(result).toBeInstanceOf(PositiveMoney)
      expect(result.value.toString()).toBe("0")
    })

    it("should return zero when every withdrawal amount is zero", () => {
      const withdrawal = [
        { value: PositiveMoney.create("0") },
        { value: PositiveMoney.create("0.00") },
      ]

      const result = calculateWithdrawalSum({ withdrawal })

      expect(result.value.toString()).toBe("0")
    })

    it("should round each amount to money precision before summing", () => {
      const withdrawal = [
        { value: PositiveMoney.create("100.005") },
        { value: PositiveMoney.create("0.005") },
      ]

      const result = calculateWithdrawalSum({ withdrawal })

      expect(result.value.toFixed(2)).toBe("100.02")
    })

    it("should round the total half up to two decimal places when raw amounts carry more precision", () => {
      // 0.004 + 0.004 = 0.008, which the value object rounds half up to the
      // two decimal places allowed by `MONEY_DECIMAL_PLACES`.
      const withdrawal = [
        { value: { value: new Decimal("0.004") } },
        { value: { value: new Decimal("0.004") } },
      ] as unknown as Parameters<
        typeof calculateWithdrawalSum
      >[0]["withdrawal"]

      const result = calculateWithdrawalSum({ withdrawal })

      expect(result.value.toFixed(2)).toBe("0.01")
    })

    it("should not mutate the provided amounts when summing them", () => {
      const first = PositiveMoney.create("1000.00")
      const second = PositiveMoney.create("500.00")
      const withdrawal = [{ value: first }, { value: second }]

      calculateWithdrawalSum({ withdrawal })

      expect(first.value.toString()).toBe("1000")
      expect(second.value.toString()).toBe("500")
    })
  })
})
