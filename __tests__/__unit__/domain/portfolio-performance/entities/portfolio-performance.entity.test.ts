import { describe, it, expect } from "vitest"
import { PortfolioPerformance } from "@/domain/portfolio-performance/entities/portfolio-performance.entity"
import { ValidationError } from "@/errors"
import { EntityId } from "@/value-objects"
import { PositiveMoney } from "@/value-objects/positive-money.vo"
import { QuotaQuantity } from "@/value-objects/quota-quantity.vo"
import { SignedMoney } from "@/value-objects/signed-money.vo"
import { SignedPercentage } from "@/value-objects/signed-percentage.vo"
import { buildPortfolioPerformance } from "__tests__/__setup__/_factories.setup"

describe("PortfolioPerformance", () => {
  describe("create", () => {
    it("should create a valid PortfolioPerformance with required props", () => {
      const perf = PortfolioPerformance.create({
        portfolioId: EntityId.create("portfolio-1"),
        date: new Date("2026-01-15"),
        quotasHeld: QuotaQuantity.create("1000"),
        patrimony: PositiveMoney.create("50000"),
        applicationTotal: PositiveMoney.create("10000"),
        redemptionTotal: PositiveMoney.create("5000"),
        cashFlowNet: SignedMoney.create("5000"),
        earnings: SignedMoney.create("1000"),
        returnDaily: SignedPercentage.create("0.5"),
      })

      expect(perf.portfolioId).toBe(
        EntityId.create("portfolio-1")
      )
      expect(perf.date).toEqual(new Date("2026-01-15"))
      expect(perf.quotasHeld.value.toFixed(2)).toBe("1000.00")
      expect(perf.patrimony.value.toFixed(2)).toBe("50000.00")
      expect(perf.applicationTotal.value.toFixed(2)).toBe(
        "10000.00"
      )
      expect(perf.redemptionTotal.value.toFixed(2)).toBe(
        "5000.00"
      )
      expect(perf.cashFlowNet.value.toFixed(2)).toBe("5000.00")
      expect(perf.earnings.value.toFixed(2)).toBe("1000.00")
      expect(perf.returnDaily.value.toFixed(2)).toBe("0.50")
      expect(perf.returnMonthly).toBeNull()
      expect(perf.returnYearly).toBeNull()
      expect(perf.returnLast12m).toBeNull()
      expect(perf.target).toBeNull()
      expect(perf.cumulativeTarget).toBeNull()
      expect(perf.inflationSpread).toBeNull()
      expect(perf.riskFreeSpread).toBeNull()
      expect(perf.marketSpread).toBeNull()
      expect(perf.id).toBeUndefined()
      expect(perf.createdAt).toBeInstanceOf(Date)
    })

    it("should create a PortfolioPerformance with provided id", () => {
      const id = EntityId.create("perf-123")
      const perf = PortfolioPerformance.create(
        {
          portfolioId: EntityId.create("portfolio-1"),
          date: new Date("2026-01-15"),
          quotasHeld: QuotaQuantity.create("1000"),
          patrimony: PositiveMoney.create("50000"),
          applicationTotal: PositiveMoney.create("10000"),
          redemptionTotal: PositiveMoney.create("5000"),
          cashFlowNet: SignedMoney.create("5000"),
          earnings: SignedMoney.create("1000"),
          returnDaily: SignedPercentage.create("0.5"),
        },
        id
      )

      expect(perf.id).toBe(id)
    })

    it("should create a PortfolioPerformance with custom timestamp", () => {
      const createdAt = new Date("2026-01-01T00:00:00.000Z")
      const perf = PortfolioPerformance.create({
        portfolioId: EntityId.create("portfolio-1"),
        date: new Date("2026-01-15"),
        quotasHeld: QuotaQuantity.create("1000"),
        patrimony: PositiveMoney.create("50000"),
        applicationTotal: PositiveMoney.create("10000"),
        redemptionTotal: PositiveMoney.create("5000"),
        cashFlowNet: SignedMoney.create("5000"),
        earnings: SignedMoney.create("1000"),
        returnDaily: SignedPercentage.create("0.5"),
        createdAt,
      })

      expect(perf.createdAt).toEqual(createdAt)
    })

    it("should create a PortfolioPerformance with optional fields", () => {
      const perf = PortfolioPerformance.create({
        portfolioId: EntityId.create("portfolio-1"),
        date: new Date("2026-01-15"),
        quotasHeld: QuotaQuantity.create("1000"),
        patrimony: PositiveMoney.create("50000"),
        applicationTotal: PositiveMoney.create("10000"),
        redemptionTotal: PositiveMoney.create("5000"),
        cashFlowNet: SignedMoney.create("5000"),
        earnings: SignedMoney.create("1000"),
        returnDaily: SignedPercentage.create("0.5"),
        returnMonthly: SignedPercentage.create("1.5"),
        returnYearly: SignedPercentage.create("12.0"),
        returnLast12m: SignedPercentage.create("15.0"),
        target: SignedPercentage.create("0.8"),
        cumulativeTarget: SignedPercentage.create("10.0"),
        inflationSpread: SignedPercentage.create("0.2"),
        riskFreeSpread: SignedPercentage.create("0.1"),
        marketSpread: SignedPercentage.create("0.3"),
      })

      expect(perf.returnMonthly).not.toBeNull()
      expect(perf.returnMonthly!.value.toFixed(2)).toBe("1.50")
      expect(perf.returnYearly).not.toBeNull()
      expect(perf.returnYearly!.value.toFixed(2)).toBe("12.00")
      expect(perf.target).not.toBeNull()
      expect(perf.target!.value.toFixed(2)).toBe("0.80")
    })

    it("should throw ValidationError when portfolioId is empty", () => {
      expect(() =>
        PortfolioPerformance.create({
          portfolioId: EntityId.create(""),
          date: new Date("2026-01-15"),
          quotasHeld: QuotaQuantity.create("1000"),
          patrimony: PositiveMoney.create("50000"),
          applicationTotal: PositiveMoney.create("10000"),
          redemptionTotal: PositiveMoney.create("5000"),
          cashFlowNet: SignedMoney.create("5000"),
          earnings: SignedMoney.create("1000"),
          returnDaily: SignedPercentage.create("0.5"),
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when date is missing", () => {
      expect(() =>
        PortfolioPerformance.create({
          portfolioId: EntityId.create("portfolio-1"),
          quotasHeld: QuotaQuantity.create("1000"),
          patrimony: PositiveMoney.create("50000"),
          applicationTotal: PositiveMoney.create("10000"),
          redemptionTotal: PositiveMoney.create("5000"),
          cashFlowNet: SignedMoney.create("5000"),
          earnings: SignedMoney.create("1000"),
          returnDaily: SignedPercentage.create("0.5"),
        } as Parameters<typeof PortfolioPerformance.create>[0])
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when quotasHeld is missing", () => {
      expect(() =>
        PortfolioPerformance.create({
          portfolioId: EntityId.create("portfolio-1"),
          date: new Date("2026-01-15"),
          patrimony: PositiveMoney.create("50000"),
          applicationTotal: PositiveMoney.create("10000"),
          redemptionTotal: PositiveMoney.create("5000"),
          cashFlowNet: SignedMoney.create("5000"),
          earnings: SignedMoney.create("1000"),
          returnDaily: SignedPercentage.create("0.5"),
        } as Parameters<typeof PortfolioPerformance.create>[0])
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when patrimony is missing", () => {
      expect(() =>
        PortfolioPerformance.create({
          portfolioId: EntityId.create("portfolio-1"),
          date: new Date("2026-01-15"),
          quotasHeld: QuotaQuantity.create("1000"),
          applicationTotal: PositiveMoney.create("10000"),
          redemptionTotal: PositiveMoney.create("5000"),
          cashFlowNet: SignedMoney.create("5000"),
          earnings: SignedMoney.create("1000"),
          returnDaily: SignedPercentage.create("0.5"),
        } as Parameters<typeof PortfolioPerformance.create>[0])
      ).toThrow(ValidationError)
    })
  })

  describe("equals", () => {
    it("should return true for same instance", () => {
      const perf = buildPortfolioPerformance()
      expect(perf.equals(perf)).toBe(true)
    })

    it("should return true for different instances with same id", () => {
      const id = EntityId.create("perf-123")
      const p1 = PortfolioPerformance.create(
        {
          portfolioId: EntityId.create("portfolio-1"),
          date: new Date("2026-01-15"),
          quotasHeld: QuotaQuantity.create("1000"),
          patrimony: PositiveMoney.create("50000"),
          applicationTotal: PositiveMoney.create("10000"),
          redemptionTotal: PositiveMoney.create("5000"),
          cashFlowNet: SignedMoney.create("5000"),
          earnings: SignedMoney.create("1000"),
          returnDaily: SignedPercentage.create("0.5"),
        },
        id
      )
      const p2 = PortfolioPerformance.create(
        {
          portfolioId: EntityId.create("portfolio-1"),
          date: new Date("2026-01-15"),
          quotasHeld: QuotaQuantity.create("1000"),
          patrimony: PositiveMoney.create("50000"),
          applicationTotal: PositiveMoney.create("10000"),
          redemptionTotal: PositiveMoney.create("5000"),
          cashFlowNet: SignedMoney.create("5000"),
          earnings: SignedMoney.create("1000"),
          returnDaily: SignedPercentage.create("0.5"),
        },
        id
      )

      expect(p1.equals(p2)).toBe(true)
    })

    it("should return false for different ids", () => {
      const p1 = PortfolioPerformance.create(
        {
          portfolioId: EntityId.create("portfolio-1"),
          date: new Date("2026-01-15"),
          quotasHeld: QuotaQuantity.create("1000"),
          patrimony: PositiveMoney.create("50000"),
          applicationTotal: PositiveMoney.create("10000"),
          redemptionTotal: PositiveMoney.create("5000"),
          cashFlowNet: SignedMoney.create("5000"),
          earnings: SignedMoney.create("1000"),
          returnDaily: SignedPercentage.create("0.5"),
        },
        EntityId.create("perf-1")
      )
      const p2 = PortfolioPerformance.create(
        {
          portfolioId: EntityId.create("portfolio-1"),
          date: new Date("2026-01-15"),
          quotasHeld: QuotaQuantity.create("1000"),
          patrimony: PositiveMoney.create("50000"),
          applicationTotal: PositiveMoney.create("10000"),
          redemptionTotal: PositiveMoney.create("5000"),
          cashFlowNet: SignedMoney.create("5000"),
          earnings: SignedMoney.create("1000"),
          returnDaily: SignedPercentage.create("0.5"),
        },
        EntityId.create("perf-2")
      )

      expect(p1.equals(p2)).toBe(false)
    })

    it("should return false when this has no id", () => {
      const p1 = PortfolioPerformance.create({
        portfolioId: EntityId.create("portfolio-1"),
        date: new Date("2026-01-15"),
        quotasHeld: QuotaQuantity.create("1000"),
        patrimony: PositiveMoney.create("50000"),
        applicationTotal: PositiveMoney.create("10000"),
        redemptionTotal: PositiveMoney.create("5000"),
        cashFlowNet: SignedMoney.create("5000"),
        earnings: SignedMoney.create("1000"),
        returnDaily: SignedPercentage.create("0.5"),
      })
      const p2 = PortfolioPerformance.create(
        {
          portfolioId: EntityId.create("portfolio-1"),
          date: new Date("2026-01-15"),
          quotasHeld: QuotaQuantity.create("1000"),
          patrimony: PositiveMoney.create("50000"),
          applicationTotal: PositiveMoney.create("10000"),
          redemptionTotal: PositiveMoney.create("5000"),
          cashFlowNet: SignedMoney.create("5000"),
          earnings: SignedMoney.create("1000"),
          returnDaily: SignedPercentage.create("0.5"),
        },
        EntityId.create("perf-1")
      )

      expect(p1.equals(p2)).toBe(false)
    })

    it("should return false when other has no id", () => {
      const p1 = PortfolioPerformance.create(
        {
          portfolioId: EntityId.create("portfolio-1"),
          date: new Date("2026-01-15"),
          quotasHeld: QuotaQuantity.create("1000"),
          patrimony: PositiveMoney.create("50000"),
          applicationTotal: PositiveMoney.create("10000"),
          redemptionTotal: PositiveMoney.create("5000"),
          cashFlowNet: SignedMoney.create("5000"),
          earnings: SignedMoney.create("1000"),
          returnDaily: SignedPercentage.create("0.5"),
        },
        EntityId.create("perf-1")
      )
      const p2 = PortfolioPerformance.create({
        portfolioId: EntityId.create("portfolio-1"),
        date: new Date("2026-01-15"),
        quotasHeld: QuotaQuantity.create("1000"),
        patrimony: PositiveMoney.create("50000"),
        applicationTotal: PositiveMoney.create("10000"),
        redemptionTotal: PositiveMoney.create("5000"),
        cashFlowNet: SignedMoney.create("5000"),
        earnings: SignedMoney.create("1000"),
        returnDaily: SignedPercentage.create("0.5"),
      })

      expect(p1.equals(p2)).toBe(false)
    })

    it("should return false when comparing to null", () => {
      const perf = buildPortfolioPerformance()
      expect(perf.equals(null)).toBe(false)
    })

    it("should return false when comparing to undefined", () => {
      const perf = buildPortfolioPerformance()
      expect(perf.equals(undefined)).toBe(false)
    })
  })

  describe("immutability", () => {
    it("should not allow direct property mutation", () => {
      const perf = buildPortfolioPerformance()

      expect(() => {
        // @ts-expect-error - testing immutability by attempting to mutate readonly property
        perf.patrimony = PositiveMoney.create("99999")
      }).toThrow()
    })
  })
})
