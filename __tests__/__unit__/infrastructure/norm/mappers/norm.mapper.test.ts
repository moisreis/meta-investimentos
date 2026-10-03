import { describe, it, expect } from "vitest"

import { Norm } from "@/domain/norm/entities/norm.entity"
import { EntityId } from "@/value-objects"
import { SignedPercentage } from "@/value-objects/signed-percentage.vo"
import {
  ToDomain,
  ToInsert,
  ToUpdate,
} from "@/infrastructure/norm/mappers/norm.mapper"
import { buildNorm } from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000020"
const CATEGORY_ID = "00000000-0000-0000-0000-000000000021"

describe("infrastructure/norm/mappers/norm.mapper", () => {
  describe("ToDomain", () => {
    it("should map database row to Norm entity", () => {
      const row = {
        id: ID,
        articleNumber: "Art. 12",
        name: "Limite de Concentração",
        categoryId: CATEGORY_ID,
        minAllocation: "5.000000",
        maxAllocation: "20.000000",
        targetAllocation: "12.000000",
        version: 2,
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-15T12:00:00.000Z"),
      }

      const norm = ToDomain(row)

      expect(norm.id).toBe(EntityId.create(ID))
      expect(norm.articleNumber).toBe("Art. 12")
      expect(norm.name).toBe("Limite de Concentração")
      expect(norm.categoryId).toBe(EntityId.create(CATEGORY_ID))
      expect(norm.minAllocation.value.toFixed(2)).toBe("5.00")
      expect(norm.maxAllocation.value.toFixed(2)).toBe("20.00")
      expect(norm.targetAllocation.value.toFixed(2)).toBe(
        "12.00"
      )
      expect(norm.version).toBe(2)
      expect(norm.createdAt).toEqual(row.createdAt)
      expect(norm.updatedAt).toEqual(row.updatedAt)
    })
  })

  describe("ToInsert", () => {
    it("should map Norm entity to insert object without id", () => {
      const norm = buildNorm({
        categoryId: EntityId.create(CATEGORY_ID),
      })

      const insert = ToInsert(norm)

      expect(insert).not.toHaveProperty("id")
      expect(insert.articleNumber).toBe(norm.articleNumber)
      expect(insert.name).toBe(norm.name)
      expect(insert.categoryId).toBe(CATEGORY_ID)
      expect(insert.minAllocation).toBe(
        norm.minAllocation.value.toString()
      )
      expect(insert.maxAllocation).toBe(
        norm.maxAllocation.value.toString()
      )
      expect(insert.targetAllocation).toBe(
        norm.targetAllocation.value.toString()
      )
      expect(insert.version).toBe(norm.version)
      expect(insert.createdAt).toEqual(norm.createdAt)
      expect(insert.updatedAt).toEqual(norm.updatedAt)
    })
  })

  describe("ToUpdate", () => {
    it("should map Norm entity to update object without timestamps and version", () => {
      const norm = buildNorm()

      const update = ToUpdate(norm)

      expect(update).not.toHaveProperty("id")
      expect(update).not.toHaveProperty("createdAt")
      expect(update).not.toHaveProperty("updatedAt")
      expect(update).not.toHaveProperty("version")
      expect(update.name).toBe(norm.name)
      expect(update.targetAllocation).toBe(
        norm.targetAllocation.value.toString()
      )
    })
  })

  describe("round-trip", () => {
    it("should preserve the entity through ToInsert then ToDomain", () => {
      const original = Norm.create(
        {
          articleNumber: "Art. 12",
          name: "Limite de Concentração",
          categoryId: EntityId.create(CATEGORY_ID),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("12"),
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
      expect(restored.name).toBe("Limite de Concentração")
      expect(restored.version).toBe(1)
    })

    it("should preserve the entity through ToUpdate then ToDomain", () => {
      const original = Norm.create(
        {
          articleNumber: "Art. 12",
          name: "Limite de Concentração",
          categoryId: EntityId.create(CATEGORY_ID),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("12"),
          version: 1,
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
          updatedAt: new Date("2026-01-01T00:00:00.000Z"),
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

      expect(ToDomain(row).equals(original)).toBe(true)
    })
  })
})
