import { describe, it, expect } from "vitest"
import { Norm } from "@/domain/norm/entities/norm.entity"
import { ValidationError } from "@/errors"
import { EntityId } from "@/value-objects"
import { SignedPercentage } from "@/value-objects/signed-percentage.vo"
import { buildNorm } from "__tests__/__setup__/_factories.setup"

describe("Norm", () => {
  describe("create", () => {
    it("should create a valid Norm with required props", () => {
      const norm = Norm.create({
        articleNumber: "Art. 12",
        name: "Limite de Concentração",
        categoryId: EntityId.create("category-1"),
        minAllocation: SignedPercentage.create("5"),
        maxAllocation: SignedPercentage.create("20"),
        targetAllocation: SignedPercentage.create("12"),
      })

      expect(norm.articleNumber).toBe("Art. 12")
      expect(norm.name).toBe("Limite de Concentração")
      expect(norm.categoryId).toBe(EntityId.create("category-1"))
      expect(norm.minAllocation.value.toFixed(2)).toBe("5.00")
      expect(norm.maxAllocation.value.toFixed(2)).toBe("20.00")
      expect(norm.targetAllocation.value.toFixed(2)).toBe(
        "12.00"
      )
      expect(norm.version).toBe(0)
      expect(norm.id).toBeUndefined()
      expect(norm.createdAt).toBeInstanceOf(Date)
      expect(norm.updatedAt).toBeInstanceOf(Date)
    })

    it("should create a Norm with provided id", () => {
      const id = EntityId.create("norm-123")
      const norm = Norm.create(
        {
          articleNumber: "Art. 12",
          name: "Limite de Concentração",
          categoryId: EntityId.create("category-1"),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("12"),
        },
        id
      )

      expect(norm.id).toBe(id)
    })

    it("should create a Norm with custom timestamps", () => {
      const createdAt = new Date("2026-01-01T00:00:00.000Z")
      const updatedAt = new Date("2026-01-15T12:00:00.000Z")
      const norm = Norm.create({
        articleNumber: "Art. 12",
        name: "Limite de Concentração",
        categoryId: EntityId.create("category-1"),
        minAllocation: SignedPercentage.create("5"),
        maxAllocation: SignedPercentage.create("20"),
        targetAllocation: SignedPercentage.create("12"),
        createdAt,
        updatedAt,
      })

      expect(norm.createdAt).toEqual(createdAt)
      expect(norm.updatedAt).toEqual(updatedAt)
    })

    it("should throw ValidationError when articleNumber is empty", () => {
      expect(() =>
        Norm.create({
          articleNumber: "",
          name: "Teste",
          categoryId: EntityId.create("category-1"),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("12"),
        })
      ).toThrow(ValidationError)
      expect(() =>
        Norm.create({
          articleNumber: "   ",
          name: "Teste",
          categoryId: EntityId.create("category-1"),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("12"),
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when name is empty", () => {
      expect(() =>
        Norm.create({
          articleNumber: "Art. 12",
          name: "",
          categoryId: EntityId.create("category-1"),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("12"),
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when categoryId is empty", () => {
      expect(() =>
        Norm.create({
          articleNumber: "Art. 12",
          name: "Teste",
          categoryId: EntityId.create(""),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("12"),
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when minAllocation is missing", () => {
      expect(() =>
        Norm.create({
          articleNumber: "Art. 12",
          name: "Teste",
          categoryId: EntityId.create("category-1"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("12"),
        } as Parameters<typeof Norm.create>[0])
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when maxAllocation is missing", () => {
      expect(() =>
        Norm.create({
          articleNumber: "Art. 12",
          name: "Teste",
          categoryId: EntityId.create("category-1"),
          minAllocation: SignedPercentage.create("5"),
          targetAllocation: SignedPercentage.create("12"),
        } as Parameters<typeof Norm.create>[0])
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when targetAllocation is missing", () => {
      expect(() =>
        Norm.create({
          articleNumber: "Art. 12",
          name: "Teste",
          categoryId: EntityId.create("category-1"),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("20"),
        } as Parameters<typeof Norm.create>[0])
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when min > target", () => {
      expect(() =>
        Norm.create({
          articleNumber: "Art. 12",
          name: "Teste",
          categoryId: EntityId.create("category-1"),
          minAllocation: SignedPercentage.create("15"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("10"),
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when target > max", () => {
      expect(() =>
        Norm.create({
          articleNumber: "Art. 12",
          name: "Teste",
          categoryId: EntityId.create("category-1"),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("10"),
          targetAllocation: SignedPercentage.create("15"),
        })
      ).toThrow(ValidationError)
    })
  })

  describe("update", () => {
    it("should return new Norm with updated name", () => {
      const norm = buildNorm({ name: "Limite Original" })
      const now = new Date("2026-06-15T10:00:00.000Z")

      const updated = norm.update({ name: "Novo Limite" }, now)

      expect(updated.name).toBe("Novo Limite")
      expect(updated.id).toBe(norm.id)
      expect(updated.updatedAt).toEqual(now)
      // Original unchanged
      expect(norm.name).toBe("Limite Original")
    })

    it("should return new Norm with updated allocations", () => {
      const norm = buildNorm()
      const updated = norm.update({
        minAllocation: SignedPercentage.create("3"),
        maxAllocation: SignedPercentage.create("25"),
        targetAllocation: SignedPercentage.create("15"),
      })

      expect(updated.minAllocation.value.toFixed(2)).toBe("3.00")
      expect(updated.maxAllocation.value.toFixed(2)).toBe(
        "25.00"
      )
      expect(updated.targetAllocation.value.toFixed(2)).toBe(
        "15.00"
      )
      expect(updated.id).toBe(norm.id)
    })

    it("should throw ValidationError when new name is empty", () => {
      const norm = buildNorm()
      expect(() => norm.update({ name: "" })).toThrow(
        ValidationError
      )
      expect(() => norm.update({ name: "   " })).toThrow(
        ValidationError
      )
    })

    it("should throw ValidationError when min > target", () => {
      const norm = buildNorm()
      expect(() =>
        norm.update({
          minAllocation: SignedPercentage.create("15"),
          targetAllocation: SignedPercentage.create("10"),
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when target > max", () => {
      const norm = buildNorm()
      expect(() =>
        norm.update({
          maxAllocation: SignedPercentage.create("10"),
          targetAllocation: SignedPercentage.create("15"),
        })
      ).toThrow(ValidationError)
    })

    it("should accept optional now parameter for updatedAt", () => {
      const norm = buildNorm()
      const now = new Date("2026-06-15T10:00:00.000Z")

      const updated = norm.update({ name: "Novo Nome" }, now)

      expect(updated.updatedAt).toEqual(now)
    })
  })

  describe("equals", () => {
    it("should return true for same instance", () => {
      const norm = buildNorm()
      expect(norm.equals(norm)).toBe(true)
    })

    it("should return true for different instances with same id", () => {
      const id = EntityId.create("norm-123")
      const norm1 = Norm.create(
        {
          articleNumber: "Art. 12",
          name: "Limite de Concentração",
          categoryId: EntityId.create("category-1"),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("12"),
        },
        id
      )
      const norm2 = Norm.create(
        {
          articleNumber: "Art. 12",
          name: "Limite de Concentração",
          categoryId: EntityId.create("category-1"),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("12"),
        },
        id
      )

      expect(norm1.equals(norm2)).toBe(true)
    })

    it("should return false for different ids", () => {
      const norm1 = Norm.create(
        {
          articleNumber: "Art. 12",
          name: "Limite de Concentração",
          categoryId: EntityId.create("category-1"),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("12"),
        },
        EntityId.create("norm-1")
      )
      const norm2 = Norm.create(
        {
          articleNumber: "Art. 12",
          name: "Limite de Concentração",
          categoryId: EntityId.create("category-1"),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("12"),
        },
        EntityId.create("norm-2")
      )

      expect(norm1.equals(norm2)).toBe(false)
    })

    it("should return false when this has no id", () => {
      const norm1 = Norm.create({
        articleNumber: "Art. 12",
        name: "Limite de Concentração",
        categoryId: EntityId.create("category-1"),
        minAllocation: SignedPercentage.create("5"),
        maxAllocation: SignedPercentage.create("20"),
        targetAllocation: SignedPercentage.create("12"),
      })
      const norm2 = Norm.create(
        {
          articleNumber: "Art. 12",
          name: "Limite de Concentração",
          categoryId: EntityId.create("category-1"),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("12"),
        },
        EntityId.create("norm-1")
      )

      expect(norm1.equals(norm2)).toBe(false)
    })

    it("should return false when other has no id", () => {
      const norm1 = Norm.create(
        {
          articleNumber: "Art. 12",
          name: "Limite de Concentração",
          categoryId: EntityId.create("category-1"),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("12"),
        },
        EntityId.create("norm-1")
      )
      const norm2 = Norm.create({
        articleNumber: "Art. 12",
        name: "Limite de Concentração",
        categoryId: EntityId.create("category-1"),
        minAllocation: SignedPercentage.create("5"),
        maxAllocation: SignedPercentage.create("20"),
        targetAllocation: SignedPercentage.create("12"),
      })

      expect(norm1.equals(norm2)).toBe(false)
    })

    it("should return false when comparing to null", () => {
      const norm = buildNorm()
      expect(norm.equals(null)).toBe(false)
    })

    it("should return false when comparing to undefined", () => {
      const norm = buildNorm()
      expect(norm.equals(undefined)).toBe(false)
    })
  })

  describe("immutability", () => {
    it("should not allow direct property mutation", () => {
      const norm = buildNorm()

      expect(() => {
        // @ts-expect-error - testing immutability by attempting to mutate readonly property
        norm.name = "Novo Nome"
      }).toThrow()
    })

    it("should return new instances on mutations", () => {
      const norm = buildNorm()
      const updated = norm.update({ name: "Novo Nome" })

      expect(updated).not.toBe(norm)
    })
  })
})
