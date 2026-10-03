import { describe, it, expect } from "vitest"
import Decimal from "decimal.js"

import { calculateApplicationQuotasSum } from "@/domain/position/calculators/application-quotas-sum.calculator"
import { QuotaQuantity } from "@/value-objects"

describe("domain/position/calculators/application-quotas-sum.calculator", () => {
  describe("calculateApplicationQuotasSum", () => {
    it("should add every application quota quantity when several applications are provided", () => {
      const quotaQuantity = [
        { value: QuotaQuantity.create("225825.442804") },
        { value: QuotaQuantity.create("100000.000000") },
      ]

      const result = calculateApplicationQuotasSum({
        quotaQuantity,
      })

      expect(result).toBeInstanceOf(QuotaQuantity)
      expect(result.value.toFixed(6)).toBe("325825.442804")
    })

    it("should keep the single quantity untouched when only one application is provided", () => {
      const quotaQuantity = [
        { value: QuotaQuantity.create("42.5") },
      ]

      const result = calculateApplicationQuotasSum({
        quotaQuantity,
      })

      expect(result.value.toFixed(6)).toBe("42.500000")
    })

    it("should return zero when the application list is empty", () => {
      const result = calculateApplicationQuotasSum({
        quotaQuantity: [],
      })

      expect(result).toBeInstanceOf(QuotaQuantity)
      expect(result.value.toString()).toBe("0")
    })

    it("should return zero when every application quantity is zero", () => {
      const quotaQuantity = [
        { value: QuotaQuantity.create("0") },
        { value: QuotaQuantity.create("0.000000") },
      ]

      const result = calculateApplicationQuotasSum({
        quotaQuantity,
      })

      expect(result.value.toString()).toBe("0")
    })

    it("should sum fractional quotas keeping the six decimal quantity precision", () => {
      const quotaQuantity = [
        { value: QuotaQuantity.create("0.000001") },
        { value: QuotaQuantity.create("0.000002") },
        { value: QuotaQuantity.create("0.000003") },
      ]

      const result = calculateApplicationQuotasSum({
        quotaQuantity,
      })

      expect(result.value.toFixed(6)).toBe("0.000006")
    })

    it("should round the total half up to six decimal places when raw quantities carry more precision", () => {
      // 0.1234565 + 0.0000004 = 0.1234569, which the value object rounds
      // to the six decimal places allowed by `QUANTITY_DECIMAL_PLACES`.
      const quotaQuantity = [
        { value: { value: new Decimal("0.1234565") } },
        { value: { value: new Decimal("0.0000004") } },
      ] as unknown as Parameters<
        typeof calculateApplicationQuotasSum
      >[0]["quotaQuantity"]

      const result = calculateApplicationQuotasSum({
        quotaQuantity,
      })

      expect(result.value.toFixed(6)).toBe("0.123457")
    })

    it("should not mutate the provided quantities when summing them", () => {
      const first = QuotaQuantity.create("10.5")
      const second = QuotaQuantity.create("4.25")
      const quotaQuantity = [{ value: first }, { value: second }]

      calculateApplicationQuotasSum({ quotaQuantity })

      expect(first.value.toString()).toBe("10.5")
      expect(second.value.toString()).toBe("4.25")
    })
  })
})
