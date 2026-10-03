import { describe, it, expect } from "vitest"

import { Portfolio } from "@/domain/portfolio/entities/portfolio.entity"
import { EntityId } from "@/value-objects"
import { SignedPercentage } from "@/value-objects/signed-percentage.vo"
import {
  ToDomain,
  ToInsert,
  ToUpdate,
} from "@/infrastructure/portfolio/mappers/portfolio.mapper"
import { buildPortfolio } from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000015"
const USER_ID = "user-1"

describe("infrastructure/portfolio/mappers/portfolio.mapper", () => {
  describe("ToDomain", () => {
    it("should map database row to Portfolio entity", () => {
      const row = {
        id: ID,
        acronym: "FIA",
        name: "Fundo de Investimento em Ações",
        userId: USER_ID,
        annualInterestRate: "10.500000",
        minAllocation: "5.000000",
        maxAllocation: "20.000000",
        targetAllocation: "12.000000",
        version: 1,
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-15T12:00:00.000Z"),
      }

      const portfolio = ToDomain(row)

      expect(portfolio.id).toBe(EntityId.create(ID))
      expect(portfolio.acronym).toBe("FIA")
      expect(portfolio.name).toBe(
        "Fundo de Investimento em Ações"
      )
      expect(portfolio.userId).toBe(EntityId.create(USER_ID))
      expect(portfolio.annualInterestRate.value.toFixed(2)).toBe(
        "10.50"
      )
      expect(portfolio.minAllocation.value.toFixed(2)).toBe(
        "5.00"
      )
      expect(portfolio.maxAllocation.value.toFixed(2)).toBe(
        "20.00"
      )
      expect(portfolio.targetAllocation.value.toFixed(2)).toBe(
        "12.00"
      )
      expect(portfolio.version).toBe(1)
      expect(portfolio.createdAt).toEqual(row.createdAt)
      expect(portfolio.updatedAt).toEqual(row.updatedAt)
    })
  })

  describe("ToInsert", () => {
    it("should map Portfolio entity to insert object without id", () => {
      const portfolio = buildPortfolio()

      const insert = ToInsert(portfolio)

      expect(insert).not.toHaveProperty("id")
      expect(insert.acronym).toBe(portfolio.acronym)
      expect(insert.name).toBe(portfolio.name)
      expect(insert.userId).toBe("user-1")
      expect(insert.annualInterestRate).toBe(
        portfolio.annualInterestRate.value.toString()
      )
      expect(insert.minAllocation).toBe(
        portfolio.minAllocation.value.toString()
      )
      expect(insert.maxAllocation).toBe(
        portfolio.maxAllocation.value.toString()
      )
      expect(insert.targetAllocation).toBe(
        portfolio.targetAllocation.value.toString()
      )
      expect(insert.version).toBe(portfolio.version)
      expect(insert.createdAt).toEqual(portfolio.createdAt)
      expect(insert.updatedAt).toEqual(portfolio.updatedAt)
    })
  })

  describe("ToUpdate", () => {
    it("should map Portfolio entity to update object without timestamps and version", () => {
      const portfolio = buildPortfolio()

      const update = ToUpdate(portfolio)

      expect(update).not.toHaveProperty("id")
      expect(update).not.toHaveProperty("createdAt")
      expect(update).not.toHaveProperty("updatedAt")
      expect(update).not.toHaveProperty("version")
      expect(update.acronym).toBe(portfolio.acronym)
      expect(update.name).toBe(portfolio.name)
    })
  })

  describe("round-trip", () => {
    it("should preserve the entity through ToInsert then ToDomain", () => {
      const original = Portfolio.create(
        {
          acronym: "FIA",
          name: "Fundo de Investimento em Ações",
          userId: EntityId.create(USER_ID),
          annualInterestRate: SignedPercentage.create("10.5"),
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
      expect(restored.acronym).toBe("FIA")
      expect(restored.version).toBe(1)
    })

    it("should preserve the entity through ToUpdate then ToDomain", () => {
      const original = Portfolio.create(
        {
          acronym: "FIA",
          name: "Fundo de Investimento em Ações",
          userId: EntityId.create(USER_ID),
          annualInterestRate: SignedPercentage.create("10.5"),
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
