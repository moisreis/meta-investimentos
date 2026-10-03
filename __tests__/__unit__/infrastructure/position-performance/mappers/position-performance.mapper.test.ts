import { describe, it, expect } from "vitest"

import { PositionPerformance } from "@/domain/position-performance/entities/position-performance.entity"
import { EntityId } from "@/value-objects"
import { PositiveMoney } from "@/value-objects/positive-money.vo"
import { QuotaQuantity } from "@/value-objects/quota-quantity.vo"
import { SignedMoney } from "@/value-objects/signed-money.vo"
import { SignedPercentage } from "@/value-objects/signed-percentage.vo"
import {
  ToDomain,
  ToInsert,
  ToUpdate,
} from "@/infrastructure/position-performance/mappers/position-performance.mapper"
import { buildPositionPerformance } from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000031"
const POSITION_ID = "00000000-0000-0000-0000-000000000022"

describe("infrastructure/position-performance/mappers/position-performance.mapper", () => {
  describe("ToDomain", () => {
    it("should map database row to PositionPerformance entity", () => {
      const row = {
        id: ID,
        positionId: POSITION_ID,
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
        allocation: "50.000000",
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
      }

      const performance = ToDomain(row)

      expect(performance.id).toBe(EntityId.create(ID))
      expect(performance.positionId).toBe(
        EntityId.create(POSITION_ID)
      )
      expect(performance.date).toEqual(row.date)
      expect(performance.quotasHeld.value.toFixed(2)).toBe(
        "1000.00"
      )
      expect(performance.patrimony.value.toFixed(2)).toBe(
        "50000.00"
      )
      expect(performance.applicationTotal.value.toFixed(2)).toBe(
        "10000.00"
      )
      expect(performance.redemptionTotal.value.toFixed(2)).toBe(
        "5000.00"
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
      expect(performance.allocation.value.toFixed(2)).toBe(
        "50.00"
      )
    })

    it("should map null optional returns to null", () => {
      const row = {
        id: ID,
        positionId: POSITION_ID,
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
        allocation: "50.000000",
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
      }

      const performance = ToDomain(row)

      expect(performance.returnMonthly).toBeNull()
      expect(performance.returnYearly).toBeNull()
      expect(performance.returnLast12m).toBeNull()
    })
  })

  describe("ToInsert", () => {
    it("should map PositionPerformance entity to insert object without id", () => {
      const performance = buildPositionPerformance({
        positionId: EntityId.create(POSITION_ID),
      })

      const insert = ToInsert(performance)

      expect(insert).not.toHaveProperty("id")
      expect(insert.positionId).toBe(POSITION_ID)
      expect(insert.date).toEqual(performance.date)
      expect(insert.patrimony).toBe(
        performance.patrimony.value.toString()
      )
      expect(insert.allocation).toBe(
        performance.allocation.value.toString()
      )
      expect(insert.createdAt).toEqual(performance.createdAt)
    })

    it("should map absent optional returns to null", () => {
      const insert = ToInsert(buildPositionPerformance())

      expect(insert.returnMonthly).toBeNull()
      expect(insert.returnYearly).toBeNull()
      expect(insert.returnLast12m).toBeNull()
    })
  })

  describe("ToUpdate", () => {
    it("should map PositionPerformance entity to update object without createdAt", () => {
      const performance = buildPositionPerformance()

      const update = ToUpdate(performance)

      expect(update).not.toHaveProperty("id")
      expect(update).not.toHaveProperty("createdAt")
      expect(update.allocation).toBe(
        performance.allocation.value.toString()
      )
    })
  })

  describe("round-trip", () => {
    it("should preserve the entity through ToInsert then ToDomain", () => {
      const original = PositionPerformance.create(
        {
          positionId: EntityId.create(POSITION_ID),
          date: new Date("2026-01-31T00:00:00.000Z"),
          quotasHeld: QuotaQuantity.create("1000"),
          patrimony: PositiveMoney.create("50000"),
          applicationTotal: PositiveMoney.create("10000"),
          redemptionTotal: PositiveMoney.create("5000"),
          cashFlowNet: SignedMoney.create("5000"),
          earnings: SignedMoney.create("1000"),
          returnDaily: SignedPercentage.create("0.5"),
          allocation: SignedPercentage.create("50"),
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
      expect(restored.allocation.value.toFixed(2)).toBe("50.00")
    })

    it("should preserve the entity through ToUpdate then ToDomain", () => {
      const original = PositionPerformance.create(
        {
          positionId: EntityId.create(POSITION_ID),
          date: new Date("2026-01-31T00:00:00.000Z"),
          quotasHeld: QuotaQuantity.create("1000"),
          patrimony: PositiveMoney.create("50000"),
          applicationTotal: PositiveMoney.create("10000"),
          redemptionTotal: PositiveMoney.create("5000"),
          cashFlowNet: SignedMoney.create("-5000"),
          earnings: SignedMoney.create("-1000"),
          returnDaily: SignedPercentage.create("-0.5"),
          allocation: SignedPercentage.create("50"),
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
      expect(restored.cashFlowNet.value.toFixed(2)).toBe(
        "-5000.00"
      )
    })
  })
})
