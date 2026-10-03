import { describe, it, expect } from "vitest"

import { TransactionAllocation } from "@/domain/transaction-allocation/entities/transaction-allocation.entity"
import { EntityId } from "@/value-objects"
import { QuotaQuantity } from "@/value-objects/quota-quantity.vo"
import {
  ToDomain,
  ToInsert,
  ToUpdate,
} from "@/infrastructure/transaction-allocation/mappers/transaction-allocation.mapper"
import { buildTransactionAllocation } from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000033"
const APPLICATION_ID = "00000000-0000-0000-0000-000000000034"
const WITHDRAWAL_ID = "00000000-0000-0000-0000-000000000035"

describe("infrastructure/transaction-allocation/mappers/transaction-allocation.mapper", () => {
  describe("ToDomain", () => {
    it("should map database row to TransactionAllocation entity", () => {
      const row = {
        id: ID,
        applicationId: APPLICATION_ID,
        withdrawId: WITHDRAWAL_ID,
        quotasConsumed: "100.000000",
        version: 2,
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
      }

      const allocation = ToDomain(row)

      expect(allocation.id).toBe(EntityId.create(ID))
      expect(allocation.applicationId).toBe(
        EntityId.create(APPLICATION_ID)
      )
      expect(allocation.withdrawId).toBe(
        EntityId.create(WITHDRAWAL_ID)
      )
      expect(allocation.quotasConsumed.value.toFixed(2)).toBe(
        "100.00"
      )
      expect(allocation.version).toBe(2)
      expect(allocation.createdAt).toEqual(row.createdAt)
    })
  })

  describe("ToInsert", () => {
    it("should map TransactionAllocation entity to insert object without id", () => {
      const allocation = buildTransactionAllocation({
        applicationId: EntityId.create(APPLICATION_ID),
        withdrawId: EntityId.create(WITHDRAWAL_ID),
      })

      const insert = ToInsert(allocation)

      expect(insert).not.toHaveProperty("id")
      expect(insert.applicationId).toBe(APPLICATION_ID)
      expect(insert.withdrawId).toBe(WITHDRAWAL_ID)
      expect(insert.quotasConsumed).toBe(
        allocation.quotasConsumed.value.toString()
      )
      expect(insert.version).toBe(allocation.version)
      expect(insert.createdAt).toEqual(allocation.createdAt)
    })
  })

  describe("ToUpdate", () => {
    it("should map TransactionAllocation entity to update object without version and createdAt", () => {
      const allocation = buildTransactionAllocation()

      const update = ToUpdate(allocation)

      expect(update).not.toHaveProperty("id")
      expect(update).not.toHaveProperty("version")
      expect(update).not.toHaveProperty("createdAt")
      expect(update.quotasConsumed).toBe(
        allocation.quotasConsumed.value.toString()
      )
    })
  })

  describe("round-trip", () => {
    it("should preserve the entity through ToInsert then ToDomain", () => {
      const original = TransactionAllocation.create(
        {
          applicationId: EntityId.create(APPLICATION_ID),
          withdrawId: EntityId.create(WITHDRAWAL_ID),
          quotasConsumed: QuotaQuantity.create("100.00"),
          version: 2,
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
      expect(restored.quotasConsumed.value.toFixed(2)).toBe(
        "100.00"
      )
      expect(restored.version).toBe(2)
    })

    it("should preserve the entity through ToUpdate then ToDomain", () => {
      const original = TransactionAllocation.create(
        {
          applicationId: EntityId.create(APPLICATION_ID),
          withdrawId: EntityId.create(WITHDRAWAL_ID),
          quotasConsumed: QuotaQuantity.create("250.50"),
          version: 1,
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
        },
        ID
      )

      const row = {
        ...ToUpdate(original),
        id: original.id!,
        version: original.version,
        createdAt: original.createdAt,
      } as Parameters<typeof ToDomain>[0]

      expect(ToDomain(row).equals(original)).toBe(true)
    })
  })
})
