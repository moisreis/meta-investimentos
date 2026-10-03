import { describe, it, expect } from "vitest"
import Decimal from "decimal.js"

import { calculateApplicationSum } from "@/domain/position/calculators/application-sum.calculator"
import { PositiveMoney } from "@/value-objects"

describe("domain/position/calculators/application-sum.calculator", () => {
  describe("calculateApplicationSum", () => {
    it("should add every application amount when several applications are provided", () => {
      const application = [
        { value: PositiveMoney.create("1000000") },
        { value: PositiveMoney.create("500000.55") },
      ]

      const result = calculateApplicationSum({ application })

      expect(result).toBeInstanceOf(PositiveMoney)
      expect(result.value.toFixed(2)).toBe("1500000.55")
    })

    it("should keep the single amount untouched when only one application is provided", () => {
      const application = [
        { value: PositiveMoney.create("2500.75") },
      ]

      const result = calculateApplicationSum({ application })

      expect(result.value.toFixed(2)).toBe("2500.75")
    })

    it("should return zero when the application list is empty", () => {
      const result = calculateApplicationSum({ application: [] })

      expect(result).toBeInstanceOf(PositiveMoney)
      expect(result.value.toString()).toBe("0")
    })

    it("should return zero when every application amount is zero", () => {
      const application = [
        { value: PositiveMoney.create("0") },
        { value: PositiveMoney.create("0.00") },
      ]

      const result = calculateApplicationSum({ application })

      expect(result.value.toString()).toBe("0")
    })

    it("should round each amount to money precision before summing", () => {
      const application = [
        { value: PositiveMoney.create("100.005") },
        { value: PositiveMoney.create("0.005") },
      ]

      const result = calculateApplicationSum({ application })

      expect(result.value.toFixed(2)).toBe("100.02")
    })

    it("should round the total half up to two decimal places when raw amounts carry more precision", () => {
      // 0.004 + 0.004 = 0.008, which the value object rounds half up to the
      // two decimal places allowed by `MONEY_DECIMAL_PLACES`.
      const application = [
        { value: { value: new Decimal("0.004") } },
        { value: { value: new Decimal("0.004") } },
      ] as unknown as Parameters<
        typeof calculateApplicationSum
      >[0]["application"]

      const result = calculateApplicationSum({ application })

      expect(result.value.toFixed(2)).toBe("0.01")
    })

    it("should not mutate the provided amounts when summing them", () => {
      const first = PositiveMoney.create("1000.00")
      const second = PositiveMoney.create("500.00")
      const application = [{ value: first }, { value: second }]

      calculateApplicationSum({ application })

      expect(first.value.toString()).toBe("1000")
      expect(second.value.toString()).toBe("500")
    })
  })
})
