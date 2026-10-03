import { describe, it, expect } from "vitest"

import { NormsPortfolios } from "@/domain/norms-portfolio/entities/norms-portfolios.entity"
import { EntityId } from "@/value-objects"
import { SignedPercentage } from "@/value-objects/signed-percentage.vo"
import {
  ToDomain,
  ToInsert,
} from "@/infrastructure/norms-portfolio/mappers/norms-portfolios.mapper"
import { buildNormsPortfolios } from "__tests__/__setup__/_factories.setup"

const NORM_ID = "00000000-0000-0000-0000-000000000020"
const PORTFOLIO_ID = "00000000-0000-0000-0000-000000000015"

describe("infrastructure/norms-portfolio/mappers/norms-portfolios.mapper", () => {
  describe("ToDomain", () => {
    it("should map database row to NormsPortfolios entity", () => {
      const row = {
        normId: NORM_ID,
        portfolioId: PORTFOLIO_ID,
        minAllocation: "5.000000",
        maxAllocation: "20.000000",
        targetAllocation: "12.000000",
        version: 1,
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
      }

      const mapping = ToDomain(row)

      expect(mapping.id).toBeUndefined()
      expect(mapping.normId).toBe(EntityId.create(NORM_ID))
      expect(mapping.portfolioId).toBe(
        EntityId.create(PORTFOLIO_ID)
      )
      expect(mapping.minAllocation.value.toFixed(2)).toBe("5.00")
      expect(mapping.maxAllocation.value.toFixed(2)).toBe(
        "20.00"
      )
      expect(mapping.targetAllocation.value.toFixed(2)).toBe(
        "12.00"
      )
      expect(mapping.version).toBe(1)
      expect(mapping.createdAt).toEqual(row.createdAt)
    })
  })

  describe("ToInsert", () => {
    it("should map NormsPortfolios entity to insert object", () => {
      const mapping = buildNormsPortfolios({
        normId: EntityId.create(NORM_ID),
        portfolioId: EntityId.create(PORTFOLIO_ID),
      })

      const insert = ToInsert(mapping)

      expect(insert).not.toHaveProperty("id")
      expect(insert.normId).toBe(NORM_ID)
      expect(insert.portfolioId).toBe(PORTFOLIO_ID)
      expect(insert.minAllocation).toBe(
        mapping.minAllocation.value.toString()
      )
      expect(insert.maxAllocation).toBe(
        mapping.maxAllocation.value.toString()
      )
      expect(insert.targetAllocation).toBe(
        mapping.targetAllocation.value.toString()
      )
      expect(insert.version).toBe(mapping.version)
      expect(insert.createdAt).toEqual(mapping.createdAt)
    })
  })

  describe("round-trip", () => {
    it("should preserve the allocations through ToInsert then ToDomain", () => {
      const original = NormsPortfolios.create({
        normId: EntityId.create(NORM_ID),
        portfolioId: EntityId.create(PORTFOLIO_ID),
        minAllocation: SignedPercentage.create("5"),
        maxAllocation: SignedPercentage.create("20"),
        targetAllocation: SignedPercentage.create("12"),
        version: 3,
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
      })

      const row = ToInsert(original) as Parameters<
        typeof ToDomain
      >[0]
      const restored = ToDomain(row)

      expect(restored.normId).toBe(original.normId)
      expect(restored.portfolioId).toBe(original.portfolioId)
      expect(restored.targetAllocation.value.toFixed(2)).toBe(
        "12.00"
      )
      expect(restored.version).toBe(3)
    })
  })
})
