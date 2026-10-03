import { describe, it, expect } from "vitest"

import { Quota } from "@/domain/quota/entities/quota.entity"
import { EntityId } from "@/value-objects"
import { QuotaPrice } from "@/value-objects/quota-price.vo"
import {
  ToDomain,
  ToInsert,
  ToUpdate,
} from "@/infrastructure/quota/mappers/quota.mapper"
import { buildQuota } from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000024"
const FUND_ID = "00000000-0000-0000-0000-000000000023"

describe("infrastructure/quota/mappers/quota.mapper", () => {
  describe("ToDomain", () => {
    it("should map database row to Quota entity", () => {
      const row = {
        id: ID,
        fundId: FUND_ID,
        date: new Date("2026-01-15T00:00:00.000Z"),
        price: "10.500000",
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
      }

      const quota = ToDomain(row)

      expect(quota.id).toBe(EntityId.create(ID))
      expect(quota.fundId).toBe(EntityId.create(FUND_ID))
      expect(quota.date).toEqual(row.date)
      expect(quota.price.value.toFixed(2)).toBe("10.50")
      expect(quota.createdAt).toEqual(row.createdAt)
    })
  })

  describe("ToInsert", () => {
    it("should map Quota entity to insert object without id", () => {
      const quota = buildQuota({
        fundId: EntityId.create(FUND_ID),
      })

      const insert = ToInsert(quota)

      expect(insert).not.toHaveProperty("id")
      expect(insert.fundId).toBe(FUND_ID)
      expect(insert.date).toEqual(quota.date)
      expect(insert.price).toBe(quota.price.value.toString())
      expect(insert.createdAt).toEqual(quota.createdAt)
    })
  })

  describe("ToUpdate", () => {
    it("should map Quota entity to update object without createdAt", () => {
      const quota = buildQuota()

      const update = ToUpdate(quota)

      expect(update).not.toHaveProperty("id")
      expect(update).not.toHaveProperty("createdAt")
      expect(update.price).toBe(quota.price.value.toString())
    })
  })

  describe("round-trip", () => {
    it("should preserve the entity through ToInsert then ToDomain", () => {
      const original = Quota.create(
        {
          fundId: EntityId.create(FUND_ID),
          date: new Date("2026-01-15T00:00:00.000Z"),
          price: QuotaPrice.create("10.50"),
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
      expect(restored.price.value.toFixed(2)).toBe("10.50")
    })

    it("should preserve the entity through ToUpdate then ToDomain", () => {
      const original = Quota.create(
        {
          fundId: EntityId.create(FUND_ID),
          date: new Date("2026-01-15T00:00:00.000Z"),
          price: QuotaPrice.create("12.75"),
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
        },
        ID
      )

      const row = {
        ...ToUpdate(original),
        id: original.id!,
        createdAt: original.createdAt,
      } as Parameters<typeof ToDomain>[0]

      expect(ToDomain(row).equals(original)).toBe(true)
    })
  })
})
