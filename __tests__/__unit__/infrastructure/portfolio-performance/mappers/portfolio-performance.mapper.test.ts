import { describe, it, expect } from "vitest"

import { PortfolioPerformance } from "@/domain/portfolio-performance/entities/portfolio-performance.entity"
import { EntityId } from "@/value-objects"
import { PositiveMoney } from "@/value-objects/positive-money.vo"
import { QuotaQuantity } from "@/value-objects/quota-quantity.vo"
import { SignedMoney } from "@/value-objects/signed-money.vo"
import { SignedPercentage } from "@/value-objects/signed-percentage.vo"
import {
  ToDomain,
  ToInsert,
  ToUpdate,
} from "@/infrastructure/portfolio-performance/mappers/portfolio-performance.mapper"
import { buildPortfolioPerformance } from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000030"
const PORTFOLIO_ID = "00000000-0000-0000-0000-000000000015"

describe("infrastructure/portfolio-performance/mappers/portfolio-performance.mapper", () => {
  describe("ToDomain", () => {
    it("should map database row to PortfolioPerformance entity", () => {
      const row = {
        id: ID,
        portfolioId: PORTFOLIO_ID,
        date: new Date("2026-01-31T00:00:00.000Z"),
        quotasHeld: "1000.000000",
        patrimony: "50000.000000",
        applicationTotal: "10000.000000",
        redemptionTotal: "5000.000000",
        cashFlowNet: "5000.000000",
        earnings: "1000.000000",
        returnDaily: "0.500000",
        returnMonthly: "1.500000",
        returnYearly: "12.000000",
        returnLast12m: "15.000000",
        target: "11.000000",
        cumulativeTarget: "10.500000",
        inflationSpread: "4.000000",
        riskFreeSpread: "6.000000",
        marketSpread: "3.000000",
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
      }

      const performance = ToDomain(row)

      expect(performance.id).toBe(EntityId.create(ID))
      expect(performance.portfolioId).toBe(
        EntityId.create(PORTFOLIO_ID)
      )
      expect(performance.date).toEqual(row.date)
      expect(performance.quotasHeld.value.toFixed(2)).toBe(
        "1000.00"
      )
      expect(performance.patrimony.value.toFixed(2)).toBe(
        "50000.00"
      )
      expect(performance.cashFlowNet.value.toFixed(2)).toBe(
        "5000.00"
      )
      expect(performance.earnings.value.toFixed(2)).toBe(
        "1000.00"
      )
      expect(performance.returnDaily.value.toFixed(2)).toBe(
        "0.50"
      )
      expect(performance.returnMonthly!.value.toFixed(2)).toBe(
        "1.50"
      )
      expect(performance.returnYearly!.value.toFixed(2)).toBe(
        "12.00"
      )
      expect(performance.returnLast12m!.value.toFixed(2)).toBe(
        "15.00"
      )
      expect(performance.target!.value.toFixed(2)).toBe("11.00")
      expect(
        performance.cumulativeTarget!.value.toFixed(2)
      ).toBe("10.50")
      expect(performance.inflationSpread!.value.toFixed(2)).toBe(
        "4.00"
      )
      expect(performance.riskFreeSpread!.value.toFixed(2)).toBe(
        "6.00"
      )
      expect(performance.marketSpread!.value.toFixed(2)).toBe(
        "3.00"
      )
    })

    it("should map null optional columns to null", () => {
      const row = {
        id: ID,
        portfolioId: PORTFOLIO_ID,
        date: new Date("2026-01-31T00:00:00.000Z"),
        quotasHeld: "1000.000000",
        patrimony: "50000.000000",
        applicationTotal: "10000.000000",
        redemptionTotal: "5000.000000",
        cashFlowNet: "5000.000000",
        earnings: "1000.000000",
        returnDaily: "0.500000",
        returnMonthly: null,
        returnYearly: null,
        returnLast12m: null,
        target: null,
        cumulativeTarget: null,
        inflationSpread: null,
        riskFreeSpread: null,
        marketSpread: null,
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
      }

      const performance = ToDomain(row)

      expect(performance.returnMonthly).toBeNull()
      expect(performance.returnYearly).toBeNull()
      expect(performance.returnLast12m).toBeNull()
      expect(performance.target).toBeNull()
      expect(performance.cumulativeTarget).toBeNull()
      expect(performance.inflationSpread).toBeNull()
      expect(performance.riskFreeSpread).toBeNull()
      expect(performance.marketSpread).toBeNull()
    })
  })

  describe("ToInsert", () => {
    it("should map PortfolioPerformance entity to insert object without id", () => {
      const performance = buildPortfolioPerformance({
        portfolioId: EntityId.create(PORTFOLIO_ID),
      })

      const insert = ToInsert(performance)

      expect(insert).not.toHaveProperty("id")
      expect(insert.portfolioId).toBe(PORTFOLIO_ID)
      expect(insert.date).toEqual(performance.date)
      expect(insert.quotasHeld).toBe(
        performance.quotasHeld.value.toString()
      )
      expect(insert.patrimony).toBe(
        performance.patrimony.value.toString()
      )
      expect(insert.returnDaily).toBe(
        performance.returnDaily.value.toString()
      )
      expect(insert.createdAt).toEqual(performance.createdAt)
    })

    it("should map absent optional returns to null", () => {
      const performance = buildPortfolioPerformance()

      const insert = ToInsert(performance)

      expect(insert.returnMonthly).toBeNull()
      expect(insert.returnYearly).toBeNull()
      expect(insert.returnLast12m).toBeNull()
      expect(insert.target).toBeNull()
      expect(insert.cumulativeTarget).toBeNull()
      expect(insert.inflationSpread).toBeNull()
      expect(insert.riskFreeSpread).toBeNull()
      expect(insert.marketSpread).toBeNull()
    })
  })

  describe("ToUpdate", () => {
    it("should map PortfolioPerformance entity to update object without createdAt", () => {
      const performance = buildPortfolioPerformance()

      const update = ToUpdate(performance)

      expect(update).not.toHaveProperty("id")
      expect(update).not.toHaveProperty("createdAt")
      expect(update.patrimony).toBe(
        performance.patrimony.value.toString()
      )
    })
  })

  describe("round-trip", () => {
    it("should preserve the entity through ToInsert then ToDomain", () => {
      const original = PortfolioPerformance.create(
        {
          portfolioId: EntityId.create(PORTFOLIO_ID),
          date: new Date("2026-01-31T00:00:00.000Z"),
          quotasHeld: QuotaQuantity.create("1000"),
          patrimony: PositiveMoney.create("50000"),
          applicationTotal: PositiveMoney.create("10000"),
          redemptionTotal: PositiveMoney.create("5000"),
          cashFlowNet: SignedMoney.create("5000"),
          earnings: SignedMoney.create("1000"),
          returnDaily: SignedPercentage.create("0.5"),
          target: SignedPercentage.create("11"),
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
        },
        ID
      )

      const row = {
        ...ToInsert(original),
        id: original.id!,
      } as Parameters<typeof ToDomain>[0]
      const restored = ToDomain(row)

      expect(restored.equals(original)).toBe(true)
      expect(restored.target!.value.toFixed(2)).toBe("11.00")
      expect(restored.returnMonthly).toBeNull()
    })

    it("should preserve the entity through ToUpdate then ToDomain", () => {
      const original = PortfolioPerformance.create(
        {
          portfolioId: EntityId.create(PORTFOLIO_ID),
          date: new Date("2026-01-31T00:00:00.000Z"),
          quotasHeld: QuotaQuantity.create("1000"),
          patrimony: PositiveMoney.create("50000"),
          applicationTotal: PositiveMoney.create("10000"),
          redemptionTotal: PositiveMoney.create("5000"),
          cashFlowNet: SignedMoney.create("-5000"),
          earnings: SignedMoney.create("-1000"),
          returnDaily: SignedPercentage.create("-0.5"),
          returnYearly: SignedPercentage.create("-12"),
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
        },
        ID
      )

      const row = {
        ...ToUpdate(original),
        id: original.id!,
        createdAt: original.createdAt,
      } as Parameters<typeof ToDomain>[0]

      const restored = ToDomain(row)

      expect(restored.equals(original)).toBe(true)
      expect(restored.earnings.value.toFixed(2)).toBe("-1000.00")
      expect(restored.returnYearly!.value.toFixed(2)).toBe(
        "-12.00"
      )
    })
  })
})
