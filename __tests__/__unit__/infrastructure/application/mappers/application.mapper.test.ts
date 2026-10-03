import { describe, it, expect } from "vitest"

import { Application } from "@/domain/application/entities/application.entity"
import { EntityId } from "@/value-objects"
import { PositiveMoney } from "@/value-objects/positive-money.vo"
import { QuotaQuantity } from "@/value-objects/quota-quantity.vo"
import {
  ToDomain,
  ToInsert,
  ToUpdate,
} from "@/infrastructure/application/mappers/application.mapper"
import { buildApplication } from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000034"
const POSITION_ID = "00000000-0000-0000-0000-000000000022"
const USER_ID = "user-1"

describe("infrastructure/application/mappers/application.mapper", () => {
  describe("ToDomain", () => {
    it("should map database row to Application entity", () => {
      const row = {
        id: ID,
        positionId: POSITION_ID,
        date: new Date("2026-01-15T00:00:00.000Z"),
        amount: "1000.000000",
        quotas: "100.000000",
        reversedAt: null,
        reversedByUserId: null,
        version: 1,
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-15T12:00:00.000Z"),
      }

      const application = ToDomain(row)

      expect(application.id).toBe(EntityId.create(ID))
      expect(application.positionId).toBe(
        EntityId.create(POSITION_ID)
      )
      expect(application.date).toEqual(row.date)
      expect(application.amount.value.toFixed(2)).toBe("1000.00")
      expect(application.quotas.value.toFixed(2)).toBe("100.00")
      expect(application.reversedAt).toBeNull()
      expect(application.reversedByUserId).toBeNull()
      expect(application.version).toBe(1)
      expect(application.createdAt).toEqual(row.createdAt)
      expect(application.updatedAt).toEqual(row.updatedAt)
    })

    it("should map reversal columns when present", () => {
      const reversedAt = new Date("2026-02-01T00:00:00.000Z")

      const application = ToDomain({
        id: ID,
        positionId: POSITION_ID,
        date: new Date("2026-01-15T00:00:00.000Z"),
        amount: "1000.000000",
        quotas: "100.000000",
        reversedAt,
        reversedByUserId: USER_ID,
        version: 1,
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-02-01T00:00:00.000Z"),
      })

      expect(application.reversedAt).toEqual(reversedAt)
      expect(application.reversedByUserId).toBe(
        EntityId.create(USER_ID)
      )
    })
  })

  describe("ToInsert", () => {
    it("should map Application entity to insert object without id", () => {
      const application = buildApplication({
        positionId: EntityId.create(POSITION_ID),
      })

      const insert = ToInsert(application)

      expect(insert).not.toHaveProperty("id")
      expect(insert.positionId).toBe(POSITION_ID)
      expect(insert.date).toEqual(application.date)
      expect(insert.amount).toBe(
        application.amount.value.toString()
      )
      expect(insert.quotas).toBe(
        application.quotas.value.toString()
      )
      expect(insert.reversedAt).toBeNull()
      expect(insert.reversedByUserId).toBeNull()
      expect(insert.version).toBe(application.version)
      expect(insert.createdAt).toEqual(application.createdAt)
      expect(insert.updatedAt).toEqual(application.updatedAt)
    })

    it("should map reversal columns when present", () => {
      const reversedAt = new Date("2026-02-01T00:00:00.000Z")

      const insert = ToInsert(
        buildApplication({
          reversedAt,
          reversedByUserId: EntityId.create(USER_ID),
        })
      )

      expect(insert.reversedAt).toEqual(reversedAt)
      expect(insert.reversedByUserId).toBe(USER_ID)
    })
  })

  describe("ToUpdate", () => {
    it("should map Application entity to update object without timestamps and version", () => {
      const application = buildApplication()

      const update = ToUpdate(application)

      expect(update).not.toHaveProperty("id")
      expect(update).not.toHaveProperty("createdAt")
      expect(update).not.toHaveProperty("updatedAt")
      expect(update).not.toHaveProperty("version")
      expect(update.amount).toBe(
        application.amount.value.toString()
      )
    })
  })

  describe("round-trip", () => {
    it("should preserve the entity through ToInsert then ToDomain", () => {
      const original = Application.create(
        {
          positionId: EntityId.create(POSITION_ID),
          date: new Date("2026-01-15T00:00:00.000Z"),
          amount: PositiveMoney.create("1000.00"),
          quotas: QuotaQuantity.create("100.00"),
          version: 1,
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
          updatedAt: new Date("2026-01-01T00:00:00.000Z"),
        },
        ID
      )

      const row = {
        ...ToInsert(original),
        id: original.id!,
      } as Parameters<typeof ToDomain>[0]
      const restored = ToDomain(row)

      expect(restored.equals(original)).toBe(true)
      expect(restored.amount.value.toFixed(2)).toBe("1000.00")
      expect(restored.reversedAt).toBeNull()
    })

    it("should preserve the entity through ToUpdate then ToDomain", () => {
      const reversedAt = new Date("2026-02-01T00:00:00.000Z")
      const original = Application.create(
        {
          positionId: EntityId.create(POSITION_ID),
          date: new Date("2026-01-15T00:00:00.000Z"),
          amount: PositiveMoney.create("2500.00"),
          quotas: QuotaQuantity.create("250.00"),
          reversedAt,
          reversedByUserId: EntityId.create(USER_ID),
          version: 2,
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
          updatedAt: new Date("2026-02-01T00:00:00.000Z"),
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
      expect(restored.reversedAt).toEqual(reversedAt)
      expect(restored.quotas.value.toFixed(2)).toBe("250.00")
    })
  })
})
