import { describe, it, expect } from "vitest"
import { NormsPortfolios } from "@/domain/norms-portfolio/entities/norms-portfolios.entity"
import { ValidationError } from "@/errors"
import { EntityId } from "@/value-objects"
import { SignedPercentage } from "@/value-objects/signed-percentage.vo"
import { buildNormsPortfolios } from "__tests__/__setup__/_factories.setup"

describe("NormsPortfolios", () => {
  describe("create", () => {
    it("should create a valid NormsPortfolios with required props", () => {
      const relation = NormsPortfolios.create({
        normId: EntityId.create("norm-1"),
        portfolioId: EntityId.create("portfolio-1"),
        minAllocation: SignedPercentage.create("5"),
        maxAllocation: SignedPercentage.create("20"),
        targetAllocation: SignedPercentage.create("12"),
      })

      expect(relation.normId).toBe(EntityId.create("norm-1"))
      expect(relation.portfolioId).toBe(
        EntityId.create("portfolio-1")
      )
      expect(relation.minAllocation.value.toFixed(2)).toBe(
        "5.00"
      )
      expect(relation.maxAllocation.value.toFixed(2)).toBe(
        "20.00"
      )
      expect(relation.targetAllocation.value.toFixed(2)).toBe(
        "12.00"
      )
      expect(relation.version).toBe(0)
      expect(relation.id).toBeUndefined()
      expect(relation.createdAt).toBeInstanceOf(Date)
    })

    it("should create a NormsPortfolios with provided id", () => {
      const id = EntityId.create("relation-123")
      const relation = NormsPortfolios.create(
        {
          normId: EntityId.create("norm-1"),
          portfolioId: EntityId.create("portfolio-1"),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("12"),
        },
        id
      )

      expect(relation.id).toBe(id)
    })

    it("should create a NormsPortfolios with custom timestamp", () => {
      const createdAt = new Date("2026-01-01T00:00:00.000Z")
      const relation = NormsPortfolios.create({
        normId: EntityId.create("norm-1"),
        portfolioId: EntityId.create("portfolio-1"),
        minAllocation: SignedPercentage.create("5"),
        maxAllocation: SignedPercentage.create("20"),
        targetAllocation: SignedPercentage.create("12"),
        createdAt,
      })

      expect(relation.createdAt).toEqual(createdAt)
    })

    it("should throw ValidationError when normId is empty", () => {
      expect(() =>
        NormsPortfolios.create({
          normId: EntityId.create(""),
          portfolioId: EntityId.create("portfolio-1"),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("12"),
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when portfolioId is empty", () => {
      expect(() =>
        NormsPortfolios.create({
          normId: EntityId.create("norm-1"),
          portfolioId: EntityId.create(""),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("12"),
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when minAllocation is missing", () => {
      expect(() =>
        NormsPortfolios.create({
          normId: EntityId.create("norm-1"),
          portfolioId: EntityId.create("portfolio-1"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("12"),
        } as Parameters<typeof NormsPortfolios.create>[0])
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when maxAllocation is missing", () => {
      expect(() =>
        NormsPortfolios.create({
          normId: EntityId.create("norm-1"),
          portfolioId: EntityId.create("portfolio-1"),
          minAllocation: SignedPercentage.create("5"),
          targetAllocation: SignedPercentage.create("12"),
        } as Parameters<typeof NormsPortfolios.create>[0])
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when targetAllocation is missing", () => {
      expect(() =>
        NormsPortfolios.create({
          normId: EntityId.create("norm-1"),
          portfolioId: EntityId.create("portfolio-1"),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("20"),
        } as Parameters<typeof NormsPortfolios.create>[0])
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when min > target", () => {
      expect(() =>
        NormsPortfolios.create({
          normId: EntityId.create("norm-1"),
          portfolioId: EntityId.create("portfolio-1"),
          minAllocation: SignedPercentage.create("15"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("10"),
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when target > max", () => {
      expect(() =>
        NormsPortfolios.create({
          normId: EntityId.create("norm-1"),
          portfolioId: EntityId.create("portfolio-1"),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("10"),
          targetAllocation: SignedPercentage.create("15"),
        })
      ).toThrow(ValidationError)
    })
  })

  describe("equals", () => {
    it("should return true for same instance", () => {
      const relation = buildNormsPortfolios()
      expect(relation.equals(relation)).toBe(true)
    })

    it("should return true for different instances with same id", () => {
      const id = EntityId.create("relation-123")
      const r1 = NormsPortfolios.create(
        {
          normId: EntityId.create("norm-1"),
          portfolioId: EntityId.create("portfolio-1"),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("12"),
        },
        id
      )
      const r2 = NormsPortfolios.create(
        {
          normId: EntityId.create("norm-1"),
          portfolioId: EntityId.create("portfolio-1"),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("12"),
        },
        id
      )

      expect(r1.equals(r2)).toBe(true)
    })

    it("should return false for different ids", () => {
      const r1 = NormsPortfolios.create(
        {
          normId: EntityId.create("norm-1"),
          portfolioId: EntityId.create("portfolio-1"),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("12"),
        },
        EntityId.create("relation-1")
      )
      const r2 = NormsPortfolios.create(
        {
          normId: EntityId.create("norm-1"),
          portfolioId: EntityId.create("portfolio-1"),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("12"),
        },
        EntityId.create("relation-2")
      )

      expect(r1.equals(r2)).toBe(false)
    })

    it("should return false when this has no id", () => {
      const r1 = NormsPortfolios.create({
        normId: EntityId.create("norm-1"),
        portfolioId: EntityId.create("portfolio-1"),
        minAllocation: SignedPercentage.create("5"),
        maxAllocation: SignedPercentage.create("20"),
        targetAllocation: SignedPercentage.create("12"),
      })
      const r2 = NormsPortfolios.create(
        {
          normId: EntityId.create("norm-1"),
          portfolioId: EntityId.create("portfolio-1"),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("12"),
        },
        EntityId.create("relation-1")
      )

      expect(r1.equals(r2)).toBe(false)
    })

    it("should return false when other has no id", () => {
      const r1 = NormsPortfolios.create(
        {
          normId: EntityId.create("norm-1"),
          portfolioId: EntityId.create("portfolio-1"),
          minAllocation: SignedPercentage.create("5"),
          maxAllocation: SignedPercentage.create("20"),
          targetAllocation: SignedPercentage.create("12"),
        },
        EntityId.create("relation-1")
      )
      const r2 = NormsPortfolios.create({
        normId: EntityId.create("norm-1"),
        portfolioId: EntityId.create("portfolio-1"),
        minAllocation: SignedPercentage.create("5"),
        maxAllocation: SignedPercentage.create("20"),
        targetAllocation: SignedPercentage.create("12"),
      })

      expect(r1.equals(r2)).toBe(false)
    })

    it("should return false when comparing to null", () => {
      const relation = buildNormsPortfolios()
      expect(relation.equals(null)).toBe(false)
    })

    it("should return false when comparing to undefined", () => {
      const relation = buildNormsPortfolios()
      expect(relation.equals(undefined)).toBe(false)
    })
  })

  describe("immutability", () => {
    it("should not allow direct property mutation", () => {
      const relation = buildNormsPortfolios()

      expect(() => {
        // @ts-expect-error - testing immutability by attempting to mutate readonly property
        relation.minAllocation = SignedPercentage.create("99")
      }).toThrow()
    })
  })
})
