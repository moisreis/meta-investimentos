import { describe, it, expect } from "vitest"

import { calculatePositionWeight } from "@/domain/position/calculators/position-weight.calculator"
import { ValidationError } from "@/errors"
import { SignedMoney, SignedPercentage } from "@/value-objects"

describe("domain/position/calculators/position-weight.calculator", () => {
  describe("calculatePositionWeight", () => {
    it("should return the dominant share when the position holds most of the portfolio", () => {
      const positionBalance = SignedMoney.create("90000.00")
      const portfolioBalance = SignedMoney.create("100000.00")

      const result = calculatePositionWeight({
        positionBalance,
        portfolioBalance,
      })

      expect(result).toBeInstanceOf(SignedPercentage)
      expect(result.value.toFixed(2)).toBe("90.00")
    })

    it("should return the residual share when the position holds the remainder of the portfolio", () => {
      const positionBalance = SignedMoney.create("10000.00")
      const portfolioBalance = SignedMoney.create("100000.00")

      const result = calculatePositionWeight({
        positionBalance,
        portfolioBalance,
      })

      expect(result.value.toFixed(2)).toBe("10.00")
    })

    it("should return a third of the portfolio when the balance is split in three", () => {
      const positionBalance = SignedMoney.create("1000.00")
      const portfolioBalance = SignedMoney.create("3000.00")

      const result = calculatePositionWeight({
        positionBalance,
        portfolioBalance,
      })

      expect(result.value.toFixed(2)).toBe("33.33")
    })

    it("should round the ratio half up to two decimal places when the division repeats", () => {
      const positionBalance = SignedMoney.create("1.00")
      const portfolioBalance = SignedMoney.create("3.00")

      const result = calculatePositionWeight({
        positionBalance,
        portfolioBalance,
      })

      expect(result.value.toFixed(2)).toBe("33.33")
    })

    it("should return a negative share when the position was drained", () => {
      const positionBalance = SignedMoney.create("-5000.00")
      const portfolioBalance = SignedMoney.create("100000.00")

      const result = calculatePositionWeight({
        positionBalance,
        portfolioBalance,
      })

      expect(result.value.toFixed(2)).toBe("-5.00")
      expect(result.isNegative).toBe(true)
    })

    it("should return a share above one hundred when a sibling position is negative", () => {
      const positionBalance = SignedMoney.create("150000.00")
      const portfolioBalance = SignedMoney.create("100000.00")

      const result = calculatePositionWeight({
        positionBalance,
        portfolioBalance,
      })

      expect(result.value.toFixed(2)).toBe("150.00")
    })

    it("should return zero when the position holds no money at all", () => {
      const positionBalance = SignedMoney.create("0.00")
      const portfolioBalance = SignedMoney.create("100000.00")

      const result = calculatePositionWeight({
        positionBalance,
        portfolioBalance,
      })

      expect(result.value.toString()).toBe("0")
      expect(result.isZero).toBe(true)
    })

    it("should return the whole portfolio when the position is its only balance", () => {
      const positionBalance = SignedMoney.create("100000.00")
      const portfolioBalance = SignedMoney.create("100000.00")

      const result = calculatePositionWeight({
        positionBalance,
        portfolioBalance,
      })

      expect(result.value.toFixed(2)).toBe("100.00")
    })

    it("should scale the share up when the portfolio balance is a fraction of a real", () => {
      const positionBalance = SignedMoney.create("1.00")
      const portfolioBalance = SignedMoney.create("0.01")

      const result = calculatePositionWeight({
        positionBalance,
        portfolioBalance,
      })

      expect(result.value.toFixed(2)).toBe("10000.00")
    })

    it("should throw ValidationError when the portfolio balance is zero", () => {
      const positionBalance = SignedMoney.create("1000.00")
      const portfolioBalance = SignedMoney.create("0.00")

      expect(() =>
        calculatePositionWeight({
          positionBalance,
          portfolioBalance,
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when the portfolio balance is negative", () => {
      const positionBalance = SignedMoney.create("1000.00")
      const portfolioBalance = SignedMoney.create("-100.00")

      expect(() =>
        calculatePositionWeight({
          positionBalance,
          portfolioBalance,
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when both balances are zero", () => {
      const positionBalance = SignedMoney.create("0.00")
      const portfolioBalance = SignedMoney.create("0.00")

      expect(() =>
        calculatePositionWeight({
          positionBalance,
          portfolioBalance,
        })
      ).toThrow(ValidationError)
    })
  })
})
