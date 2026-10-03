import { describe, it, expect } from "vitest"

import { Statement } from "@/domain/statement/entities/statement.entity"
import { EntityId } from "@/value-objects"
import {
  ToDomain,
  ToInsert,
  ToUpdate,
} from "@/infrastructure/statement/mappers/statement.mapper"
import { buildStatement } from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000032"
const PORTFOLIO_ID = "00000000-0000-0000-0000-000000000015"
const USER_ID = "user-1"

describe("infrastructure/statement/mappers/statement.mapper", () => {
  describe("ToDomain", () => {
    it("should map database row to Statement entity", () => {
      const row = {
        id: ID,
        portfolioId: PORTFOLIO_ID,
        periodStart: "2026-01-01T00:00:00.000Z",
        periodEnd: "2026-01-31T00:00:00.000Z",
        fileUrl: "https://cdn.test/statement.pdf",
        generatedByUserId: USER_ID,
        createdAt: new Date("2026-02-01T00:00:00.000Z"),
      }

      const statement = ToDomain(row)

      expect(statement.id).toBe(EntityId.create(ID))
      expect(statement.portfolioId).toBe(
        EntityId.create(PORTFOLIO_ID)
      )
      expect(statement.periodStart).toEqual(
        new Date(row.periodStart)
      )
      expect(statement.periodEnd).toEqual(
        new Date(row.periodEnd)
      )
      expect(statement.fileUrl).toBe(
        "https://cdn.test/statement.pdf"
      )
      expect(statement.generatedByUserId).toBe(
        EntityId.create(USER_ID)
      )
      expect(statement.createdAt).toEqual(row.createdAt)
    })

    it("should map null relations to null", () => {
      const row = {
        id: ID,
        portfolioId: null,
        periodStart: "2026-01-01T00:00:00.000Z",
        periodEnd: "2026-01-31T00:00:00.000Z",
        fileUrl: "https://cdn.test/statement.pdf",
        generatedByUserId: null,
        createdAt: new Date("2026-02-01T00:00:00.000Z"),
      }

      const statement = ToDomain(row)

      expect(statement.portfolioId).toBeNull()
      expect(statement.generatedByUserId).toBeNull()
    })
  })

  describe("ToInsert", () => {
    it("should map Statement entity to insert object without id", () => {
      const statement = buildStatement({
        portfolioId: EntityId.create(PORTFOLIO_ID),
        generatedByUserId: EntityId.create(USER_ID),
      })

      const insert = ToInsert(statement)

      expect(insert).not.toHaveProperty("id")
      expect(insert.portfolioId).toBe(PORTFOLIO_ID)
      expect(insert.generatedByUserId).toBe(USER_ID)
      expect(insert.fileUrl).toBe(statement.fileUrl)
      expect(insert.createdAt).toEqual(statement.createdAt)
    })

    it("should serialize the period bounds as ISO strings", () => {
      const statement = buildStatement()

      const insert = ToInsert(statement)

      expect(insert.periodStart).toBe(
        statement.periodStart.toISOString()
      )
      expect(insert.periodEnd).toBe(
        statement.periodEnd.toISOString()
      )
    })

    it("should map absent relations to null", () => {
      const insert = ToInsert(
        buildStatement({
          portfolioId: null,
          generatedByUserId: null,
        })
      )

      expect(insert.portfolioId).toBeNull()
      expect(insert.generatedByUserId).toBeNull()
    })
  })

  describe("ToUpdate", () => {
    it("should map Statement entity to update object without createdAt", () => {
      const statement = buildStatement()

      const update = ToUpdate(statement)

      expect(update).not.toHaveProperty("id")
      expect(update).not.toHaveProperty("createdAt")
      expect(update.fileUrl).toBe(statement.fileUrl)
      expect(update.periodStart).toBe(
        statement.periodStart.toISOString()
      )
    })
  })

  describe("round-trip", () => {
    it("should preserve the entity through ToInsert then ToDomain", () => {
      const original = Statement.create(
        {
          portfolioId: EntityId.create(PORTFOLIO_ID),
          periodStart: new Date("2026-01-01T00:00:00.000Z"),
          periodEnd: new Date("2026-01-31T00:00:00.000Z"),
          fileUrl: "https://cdn.test/statement.pdf",
          generatedByUserId: EntityId.create(USER_ID),
          createdAt: new Date("2026-02-01T00:00:00.000Z"),
        },
        ID
      )

      const row = {
        ...ToInsert(original),
        id: original.id!,
      } as Parameters<typeof ToDomain>[0]
      const restored = ToDomain(row)

      expect(restored.equals(original)).toBe(true)
      expect(restored.periodStart).toEqual(original.periodStart)
      expect(restored.periodEnd).toEqual(original.periodEnd)
    })

    it("should preserve the entity through ToUpdate then ToDomain", () => {
      const original = Statement.create(
        {
          periodStart: new Date("2026-01-01T00:00:00.000Z"),
          periodEnd: new Date("2026-01-31T00:00:00.000Z"),
          fileUrl: "https://cdn.test/statement.pdf",
          createdAt: new Date("2026-02-01T00:00:00.000Z"),
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
