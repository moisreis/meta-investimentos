import { describe, it, expect } from "vitest"

import { Position } from "@/domain/position/entities/position.entity"
import { EntityId } from "@/value-objects"
import { PositiveMoney } from "@/value-objects/positive-money.vo"
import { SignedPercentage } from "@/value-objects/signed-percentage.vo"
import {
  ToDomain,
  ToInsert,
  ToUpdate,
} from "@/infrastructure/position/mappers/position.mapper"
import { buildPosition } from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000022"
const PORTFOLIO_ID = "00000000-0000-0000-0000-000000000015"
const FUND_ID = "00000000-0000-0000-0000-000000000023"

describe("infrastructure/position/mappers/position.mapper", () => {
  describe("ToDomain", () => {
    it("should map database row to Position entity", () => {
      const row = {
        id: ID,
        portfolioId: PORTFOLIO_ID,
        fundId: FUND_ID,
        initialBalance: "10000.000000",
        initialBalanceDate: new Date("2026-01-01T00:00:00.000Z"),
        allocation: "50.000000",
        version: 1,
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-15T12:00:00.000Z"),
      }

      const position = ToDomain(row)

      expect(position.id).toBe(EntityId.create(ID))
      expect(position.portfolioId).toBe(
        EntityId.create(PORTFOLIO_ID)
      )
      expect(position.fundId).toBe(EntityId.create(FUND_ID))
      expect(position.initialBalance!.value.toFixed(2)).toBe(
        "10000.00"
      )
      expect(position.initialBalanceDate).toEqual(
        row.initialBalanceDate
      )
      expect(position.allocation.value.toFixed(2)).toBe("50.00")
      expect(position.version).toBe(1)
      expect(position.createdAt).toEqual(row.createdAt)
      expect(position.updatedAt).toEqual(row.updatedAt)
    })

    it("should map null initial balance to null", () => {
      const row = {
        id: ID,
        portfolioId: PORTFOLIO_ID,
        fundId: FUND_ID,
        initialBalance: null,
        initialBalanceDate: null,
        allocation: "100.000000",
        version: 0,
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-01T00:00:00.000Z"),
      }

      const position = ToDomain(row)

      expect(position.initialBalance).toBeNull()
      expect(position.initialBalanceDate).toBeNull()
    })
  })

  describe("ToInsert", () => {
    it("should map Position entity to insert object without id", () => {
      const position = buildPosition({
        portfolioId: EntityId.create(PORTFOLIO_ID),
        fundId: EntityId.create(FUND_ID),
      })

      const insert = ToInsert(position)

      expect(insert).not.toHaveProperty("id")
      expect(insert.portfolioId).toBe(PORTFOLIO_ID)
      expect(insert.fundId).toBe(FUND_ID)
      expect(insert.initialBalance).toBe(
        position.initialBalance!.value.toString()
      )
      expect(insert.initialBalanceDate).toEqual(
        position.initialBalanceDate
      )
      expect(insert.allocation).toBe(
        position.allocation.value.toString()
      )
      expect(insert.version).toBe(position.version)
      expect(insert.createdAt).toEqual(position.createdAt)
      expect(insert.updatedAt).toEqual(position.updatedAt)
    })

    it("should map a missing initial balance to null", () => {
      const position = buildPosition({
        initialBalance: null,
        initialBalanceDate: null,
      })

      const insert = ToInsert(position)

      expect(insert.initialBalance).toBeNull()
      expect(insert.initialBalanceDate).toBeNull()
    })
  })

  describe("ToUpdate", () => {
    it("should map Position entity to update object without timestamps and version", () => {
      const position = buildPosition()

      const update = ToUpdate(position)

      expect(update).not.toHaveProperty("id")
      expect(update).not.toHaveProperty("createdAt")
      expect(update).not.toHaveProperty("updatedAt")
      expect(update).not.toHaveProperty("version")
      expect(update.allocation).toBe(
        position.allocation.value.toString()
      )
    })
  })

  describe("round-trip", () => {
    it("should preserve the entity through ToInsert then ToDomain", () => {
      const initialBalanceDate = new Date(
        "2026-01-01T00:00:00.000Z"
      )
      const original = Position.create(
        {
          portfolioId: EntityId.create(PORTFOLIO_ID),
          fundId: EntityId.create(FUND_ID),
          initialBalance: PositiveMoney.create("10000.00"),
          initialBalanceDate,
          allocation: SignedPercentage.create("50"),
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
      expect(restored.initialBalance!.value.toFixed(2)).toBe(
        "10000.00"
      )
      expect(restored.initialBalanceDate).toEqual(
        initialBalanceDate
      )
    })

    it("should preserve the entity through ToUpdate then ToDomain", () => {
      const original = Position.create(
        {
          portfolioId: EntityId.create(PORTFOLIO_ID),
          fundId: EntityId.create(FUND_ID),
          allocation: SignedPercentage.create("50"),
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

      const restored = ToDomain(row)

      expect(restored.equals(original)).toBe(true)
      expect(restored.initialBalance).toBeNull()
    })
  })
})
