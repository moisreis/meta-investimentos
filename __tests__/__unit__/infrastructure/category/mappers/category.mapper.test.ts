import { describe, it, expect } from "vitest"

import { Category } from "@/domain/category/entities/category.entity"
import { EntityId } from "@/value-objects"
import {
  ToDomain,
  ToInsert,
  ToUpdate,
} from "@/infrastructure/category/mappers/category.mapper"
import { buildCategory } from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000002"

describe("infrastructure/category/mappers/category.mapper", () => {
  describe("ToDomain", () => {
    it("should map database row to Category entity", () => {
      const row = {
        id: ID,
        name: "Renda Fixa",
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-15T12:00:00.000Z"),
      }

      const category = ToDomain(row)

      expect(category.id).toBe(EntityId.create(ID))
      expect(category.name).toBe("Renda Fixa")
      expect(category.createdAt).toEqual(row.createdAt)
      expect(category.updatedAt).toEqual(row.updatedAt)
    })
  })

  describe("ToInsert", () => {
    it("should map Category entity to insert object without id", () => {
      const category = buildCategory({ name: "Multimercado" })

      const insert = ToInsert(category)

      expect(insert).not.toHaveProperty("id")
      expect(insert.name).toBe("Multimercado")
      expect(insert.createdAt).toEqual(category.createdAt)
      expect(insert.updatedAt).toEqual(category.updatedAt)
    })
  })

  describe("ToUpdate", () => {
    it("should map Category entity to update object with only the name", () => {
      const category = buildCategory()

      const update = ToUpdate(category)

      expect(update).not.toHaveProperty("id")
      expect(update).not.toHaveProperty("createdAt")
      expect(update).not.toHaveProperty("updatedAt")
      expect(update).toEqual({ name: category.name })
    })
  })

  describe("round-trip", () => {
    it("should preserve the entity through ToInsert then ToDomain", () => {
      const original = Category.create(
        {
          name: "Renda Variável",
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
      expect(restored.name).toBe("Renda Variável")
    })

    it("should preserve the entity through ToUpdate then ToDomain", () => {
      const original = Category.create(
        {
          name: "Renda Variável",
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
          updatedAt: new Date("2026-01-01T00:00:00.000Z"),
        },
        ID
      )

      const row = {
        ...ToUpdate(original),
        id: original.id!,
        createdAt: original.createdAt,
        updatedAt: original.updatedAt,
      } as Parameters<typeof ToDomain>[0]

      expect(ToDomain(row).equals(original)).toBe(true)
    })
  })
})
