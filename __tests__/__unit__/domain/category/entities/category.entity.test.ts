import { describe, it, expect } from "vitest"
import { Category } from "@/domain/category/entities/category.entity"
import { ValidationError } from "@/errors"
import { EntityId } from "@/value-objects"
import { buildCategory } from "__tests__/__setup__/_factories.setup"
import {
  useFixedClock,
  advanceTime,
} from "__tests__/__setup__/_clock.setup"

describe("Category", () => {
  describe("create", () => {
    it("should create a valid Category with required props", () => {
      const category = Category.create({ name: "Renda Fixa" })

      expect(category.name).toBe("Renda Fixa")
      expect(category.id).toBeUndefined()
      expect(category.createdAt).toBeInstanceOf(Date)
      expect(category.updatedAt).toBeInstanceOf(Date)
    })

    it("should create a Category with provided id", () => {
      const id = EntityId.create("category-123")
      const category = Category.create(
        { name: "Renda Fixa" },
        id
      )

      expect(category.id).toBe(id)
    })

    it("should create a Category with custom timestamps", () => {
      const createdAt = new Date("2026-01-01T00:00:00.000Z")
      const updatedAt = new Date("2026-01-15T12:00:00.000Z")
      const category = Category.create({
        name: "Renda Fixa",
        createdAt,
        updatedAt,
      })

      expect(category.createdAt).toEqual(createdAt)
      expect(category.updatedAt).toEqual(updatedAt)
    })

    it("should create a Category with a trimmed name", () => {
      const category = Category.create({
        name: "Renda Fixa",
      })

      expect(category.name).toBe("Renda Fixa")
    })

    it("should throw ValidationError when name is empty", () => {
      expect(() => Category.create({ name: "" })).toThrow(
        ValidationError
      )
      expect(() => Category.create({ name: "   " })).toThrow(
        ValidationError
      )
    })

    it("should throw ValidationError when name is missing", () => {
      expect(() =>
        Category.create({ name: "" } as Parameters<
          typeof Category.create
        >[0])
      ).toThrow(ValidationError)
    })
  })

  describe("rename", () => {
    it("should return new Category with updated name", () => {
      useFixedClock()
      const category = buildCategory({ name: "Renda Fixa" })
      advanceTime(1000)
      const renamed = category.rename("Renda Variável")

      expect(renamed.name).toBe("Renda Variável")
      expect(renamed.id).toBe(category.id)
      expect(renamed.updatedAt).not.toEqual(category.updatedAt)
      // Original unchanged
      expect(category.name).toBe("Renda Fixa")
    })

    it("should throw ValidationError when new name is empty", () => {
      const category = buildCategory()
      expect(() => category.rename("")).toThrow(ValidationError)
      expect(() => category.rename("   ")).toThrow(
        ValidationError
      )
    })

    it("should accept optional now parameter for updatedAt", () => {
      const category = buildCategory()
      const now = new Date("2026-06-15T10:00:00.000Z")
      const renamed = category.rename("Novo Nome", now)

      expect(renamed.updatedAt).toEqual(now)
    })
  })

  describe("equals", () => {
    it("should return true for same instance", () => {
      const category = buildCategory()
      expect(category.equals(category)).toBe(true)
    })

    it("should return true for different instances with same id", () => {
      const id = EntityId.create("category-123")
      const category1 = Category.create(
        { name: "Renda Fixa" },
        id
      )
      const category2 = Category.create(
        { name: "Renda Fixa" },
        id
      )

      expect(category1.equals(category2)).toBe(true)
    })

    it("should return false for different ids", () => {
      const category1 = Category.create(
        { name: "Renda Fixa" },
        EntityId.create("category-1")
      )
      const category2 = Category.create(
        { name: "Renda Fixa" },
        EntityId.create("category-2")
      )

      expect(category1.equals(category2)).toBe(false)
    })

    it("should return false when this has no id", () => {
      const category1 = Category.create({ name: "Renda Fixa" })
      const category2 = Category.create(
        { name: "Renda Fixa" },
        EntityId.create("category-1")
      )

      expect(category1.equals(category2)).toBe(false)
    })

    it("should return false when other has no id", () => {
      const category1 = Category.create(
        { name: "Renda Fixa" },
        EntityId.create("category-1")
      )
      const category2 = Category.create({ name: "Renda Fixa" })

      expect(category1.equals(category2)).toBe(false)
    })

    it("should return false when comparing to null", () => {
      const category = buildCategory()
      expect(category.equals(null)).toBe(false)
    })

    it("should return false when comparing to undefined", () => {
      const category = buildCategory()
      expect(category.equals(undefined)).toBe(false)
    })
  })

  describe("immutability", () => {
    it("should not allow direct property mutation", () => {
      const category = buildCategory()

      expect(() => {
        // @ts-expect-error - testing immutability by attempting to mutate readonly property
        category.name = "Novo Nome"
      }).toThrow()
    })

    it("should return new instances on mutations", () => {
      const category = buildCategory()
      const renamed = category.rename("Novo Nome")

      expect(renamed).not.toBe(category)
    })
  })
})
