import { describe, it, expect } from "vitest"

import { Withdrawal } from "@/domain/withdrawal/entities/withdrawal.entity"
import { EntityId } from "@/value-objects"
import { PositiveMoney } from "@/value-objects/positive-money.vo"
import { QuotaQuantity } from "@/value-objects/quota-quantity.vo"
import {
  ToDomain,
  ToInsert,
  ToUpdate,
} from "@/infrastructure/withdrawal/mappers/withdrawal.mapper"
import { buildWithdrawal } from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000035"
const POSITION_ID = "00000000-0000-0000-0000-000000000022"
const USER_ID = "user-1"

describe("infrastructure/withdrawal/mappers/withdrawal.mapper", () => {
  describe("ToDomain", () => {
    it("should map database row to Withdrawal entity", () => {
      const row = {
        id: ID,
        positionId: POSITION_ID,
        date: new Date("2026-02-15T00:00:00.000Z"),
        amount: "500.000000",
        quotas: "50.000000",
        reversedAt: null,
        reversedByUserId: null,
        version: 1,
        createdAt: new Date("2026-02-01T00:00:00.000Z"),
        updatedAt: new Date("2026-02-15T12:00:00.000Z"),
      }

      const withdrawal = ToDomain(row)

      expect(withdrawal.id).toBe(EntityId.create(ID))
      expect(withdrawal.positionId).toBe(
        EntityId.create(POSITION_ID)
      )
      expect(withdrawal.date).toEqual(row.date)
      expect(withdrawal.amount.value.toFixed(2)).toBe("500.00")
      expect(withdrawal.quotas.value.toFixed(2)).toBe("50.00")
      expect(withdrawal.reversedAt).toBeNull()
      expect(withdrawal.reversedByUserId).toBeNull()
      expect(withdrawal.version).toBe(1)
      expect(withdrawal.createdAt).toEqual(row.createdAt)
      expect(withdrawal.updatedAt).toEqual(row.updatedAt)
    })

    it("should map reversal columns when present", () => {
      const reversedAt = new Date("2026-03-01T00:00:00.000Z")

      const withdrawal = ToDomain({
        id: ID,
        positionId: POSITION_ID,
        date: new Date("2026-02-15T00:00:00.000Z"),
        amount: "500.000000",
        quotas: "50.000000",
        reversedAt,
        reversedByUserId: USER_ID,
        version: 1,
        createdAt: new Date("2026-02-01T00:00:00.000Z"),
        updatedAt: new Date("2026-03-01T00:00:00.000Z"),
      })

      expect(withdrawal.reversedAt).toEqual(reversedAt)
      expect(withdrawal.reversedByUserId).toBe(
        EntityId.create(USER_ID)
      )
    })
  })

  describe("ToInsert", () => {
    it("should map Withdrawal entity to insert object without id", () => {
      const withdrawal = buildWithdrawal({
        positionId: EntityId.create(POSITION_ID),
      })

      const insert = ToInsert(withdrawal)

      expect(insert).not.toHaveProperty("id")
      expect(insert.positionId).toBe(POSITION_ID)
      expect(insert.date).toEqual(withdrawal.date)
      expect(insert.amount).toBe(
        withdrawal.amount.value.toString()
      )
      expect(insert.quotas).toBe(
        withdrawal.quotas.value.toString()
      )
      expect(insert.reversedAt).toBeNull()
      expect(insert.reversedByUserId).toBeNull()
      expect(insert.version).toBe(withdrawal.version)
      expect(insert.createdAt).toEqual(withdrawal.createdAt)
      expect(insert.updatedAt).toEqual(withdrawal.updatedAt)
    })
  })

  describe("ToUpdate", () => {
    it("should map Withdrawal entity to update object without timestamps and version", () => {
      const withdrawal = buildWithdrawal()

      const update = ToUpdate(withdrawal)

      expect(update).not.toHaveProperty("id")
      expect(update).not.toHaveProperty("createdAt")
      expect(update).not.toHaveProperty("updatedAt")
      expect(update).not.toHaveProperty("version")
      expect(update.amount).toBe(
        withdrawal.amount.value.toString()
      )
    })
  })

  describe("round-trip", () => {
    it("should preserve the entity through ToInsert then ToDomain", () => {
      const original = Withdrawal.create(
        {
          positionId: EntityId.create(POSITION_ID),
          date: new Date("2026-02-15T00:00:00.000Z"),
          amount: PositiveMoney.create("500.00"),
          quotas: QuotaQuantity.create("50.00"),
          version: 1,
          createdAt: new Date("2026-02-01T00:00:00.000Z"),
          updatedAt: new Date("2026-02-01T00:00:00.000Z"),
        },
        ID
      )

      const row = {
        ...ToInsert(original),
        id: original.id!,
      } as Parameters<typeof ToDomain>[0]
      const restored = ToDomain(row)

      expect(restored.equals(original)).toBe(true)
      expect(restored.amount.value.toFixed(2)).toBe("500.00")
    })

    it("should preserve the entity through ToUpdate then ToDomain", () => {
      const reversedAt = new Date("2026-03-01T00:00:00.000Z")
      const original = Withdrawal.create(
        {
          positionId: EntityId.create(POSITION_ID),
          date: new Date("2026-02-15T00:00:00.000Z"),
          amount: PositiveMoney.create("750.00"),
          quotas: QuotaQuantity.create("75.00"),
          reversedAt,
          reversedByUserId: EntityId.create(USER_ID),
          version: 2,
          createdAt: new Date("2026-02-01T00:00:00.000Z"),
          updatedAt: new Date("2026-03-01T00:00:00.000Z"),
        },
        ID
      )

      const row = {
        ...ToUpdate(original),
        id: original.id!,
        version: original.version,
        createdAt: original.createdAt,
        updatedAt: original.updatedAt,
      } as Parameters<typeof ToDomain>[0]

      const restored = ToDomain(row)

      expect(restored.equals(original)).toBe(true)
      expect(restored.reversedByUserId).toBe(
        EntityId.create(USER_ID)
      )
    })
  })
})
