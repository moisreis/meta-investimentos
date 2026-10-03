import { describe, it, expect } from "vitest"
import {
  SumDecimals,
  SumMoney,
  SumQuotas,
  MONEY_SCALE,
} from "@/lib/money/sum-money"

const PRECISE_SCALE = 6

describe("lib/money/sum-money", () => {
  describe("SumMoney", () => {
    it("should sum money at 2 decimal places", () => {
      const result = SumMoney(["10,10", "0,20"])

      expect(result).toBe("10.30")
    })

    it("should return 0 for empty array", () => {
      const result = SumMoney([])

      expect(result).toBe("0.00")
    })

    it("should handle BRL thousand separators", () => {
      const result = SumMoney(["1.000,00", "500,50"])

      expect(result).toBe("1500.50")
    })

    it("should handle negative values", () => {
      const result = SumMoney(["100,00", "-30,50"])

      expect(result).toBe("69.50")
    })

    it("should handle trailing comma", () => {
      const result = SumMoney(["1000,", "500,50"])

      expect(result).toBe("1500.50")
    })
  })

  describe("SumQuotas", () => {
    it("should sum quota values at 6 decimal places", () => {
      const result = SumQuotas(["10,123456", "5,123456"])

      expect(result).toBe("15.246912")
    })

    it("should return 0 for empty array", () => {
      const result = SumQuotas([])

      expect(result).toBe("0.000000")
    })

    it("should handle large numbers", () => {
      const result = SumQuotas([
        "225825,142804",
        "200000,000000",
      ])

      expect(result).toBe("425825.142804")
    })

    it("should handle mixed valid and invalid", () => {
      const result = SumQuotas(["10,000000", "abc", "5,000000"])

      expect(result).toBe("15.000000")
    })

    it("should handle negative values", () => {
      const result = SumQuotas(["100,000000", "-30,500000"])

      expect(result).toBe("69.500000")
    })
  })

  describe("SumDecimals", () => {
    it("should sum at money scale", () => {
      const result = SumDecimals(["10,10", "0,20"], MONEY_SCALE)

      expect(result).toBe("10.30")
    })

    it("should sum at precise scale", () => {
      const result = SumDecimals(
        ["10,123456", "5,123456"],
        PRECISE_SCALE
      )

      expect(result).toBe("15.246912")
    })

    it("should skip null and undefined", () => {
      const result = SumDecimals(
        ["10,00", null, "5,00", undefined],
        MONEY_SCALE
      )

      expect(result).toBe("15.00")
    })

    it("should skip invalid entries", () => {
      const result = SumDecimals(
        ["10,00", "abc", "5,00"],
        MONEY_SCALE
      )

      expect(result).toBe("15.00")
    })

    it("should return 0 for empty array", () => {
      const result = SumDecimals([], MONEY_SCALE)

      expect(result).toBe("0.00")
    })

    it("should return 0 for all invalid", () => {
      const result = SumDecimals(
        ["abc", null, undefined],
        MONEY_SCALE
      )

      expect(result).toBe("0.00")
    })

    it("should sum negative and positive", () => {
      const result = SumDecimals(
        ["100,00", "-30,50"],
        MONEY_SCALE
      )

      expect(result).toBe("69.50")
    })
  })
})
