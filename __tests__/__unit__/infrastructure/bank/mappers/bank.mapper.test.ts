import { describe, it, expect } from "vitest"
import { Bank } from "@/domain/bank/entities/bank.entity"
import { EntityId } from "@/value-objects"
import {
  ToDomain,
  ToInsert,
  ToUpdate,
} from "@/infrastructure/bank/mappers/bank.mapper"
import { buildBank } from "__tests__/__setup__/_factories.setup"
import {
  useFixedClock,
  getFixedDate,
} from "__tests__/__setup__/_clock.setup"

describe("infrastructure/bank/mappers/bank.mapper", () => {
  describe("ToDomain", () => {
    it("should map database row to Bank entity", () => {
      useFixedClock()
      const fixedDate = getFixedDate()

      const row = {
        id: "00000000-0000-0000-0000-000000000001",
        code: "001",
        name: "Banco do Brasil",
        createdAt: fixedDate,
        updatedAt: fixedDate,
      }

      const bank = ToDomain(row)

      expect(bank.id).toBe(
        EntityId.create("00000000-0000-0000-0000-000000000001")
      )
      expect(bank.code).toBe("001")
      expect(bank.name).toBe("Banco do Brasil")
      expect(bank.createdAt).toEqual(fixedDate)
      expect(bank.updatedAt).toEqual(fixedDate)
    })

    it("should handle row with id", () => {
      const row = {
        id: "test-id-1234-5678-9012-345678901234",
        code: "237",
        name: "Banco Bradesco",
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-15T12:00:00.000Z"),
      }

      const bank = ToDomain(row)
      expect(bank.id).toBe(
        EntityId.create("test-id-1234-5678-9012-345678901234")
      )
      expect(bank.code).toBe("237")
      expect(bank.name).toBe("Banco Bradesco")
    })
  })

  describe("ToInsert", () => {
    it("should map Bank entity to insert object without id", () => {
      const bank = buildBank({
        code: "001",
        name: "Banco do Brasil",
      })

      const insert = ToInsert(bank)

      expect(insert).not.toHaveProperty("id")
      expect(insert.code).toBe("001")
      expect(insert.name).toBe("Banco do Brasil")
      expect(insert.createdAt).toEqual(bank.createdAt)
      expect(insert.updatedAt).toEqual(bank.updatedAt)
    })
  })

  describe("ToUpdate", () => {
    it("should map Bank entity to update object with only code and name", () => {
      const bank = buildBank({
        code: "001",
        name: "Banco do Brasil",
      })

      const update = ToUpdate(bank)

      expect(update).not.toHaveProperty("id")
      expect(update).not.toHaveProperty("createdAt")
      expect(update).not.toHaveProperty("updatedAt")
      expect(update.code).toBe("001")
      expect(update.name).toBe("Banco do Brasil")
    })
  })

  describe("round-trip", () => {
    it("should preserve entity through ToInsert -> ToDomain", () => {
      const original = buildBank({
        code: "001",
        name: "Banco do Brasil",
      })
      const originalWithId = Bank.create(
        {
          code: original.code,
          name: original.name,
          createdAt: original.createdAt,
          updatedAt: original.updatedAt,
        },
        "00000000-0000-0000-0000-000000000001"
      )

      const insert = ToInsert(originalWithId)
      const row = {
        ...insert,
        id: originalWithId.id,
      } as Parameters<typeof ToDomain>[0]
      const restored = ToDomain(row)

      expect(restored.equals(originalWithId)).toBe(true)
      expect(restored.code).toBe(original.code)
      expect(restored.name).toBe(original.name)
    })

    it("should preserve entity through ToUpdate -> ToDomain", () => {
      const original = buildBank({
        code: "001",
        name: "Banco do Brasil",
      })
      const originalWithId = Bank.create(
        {
          code: original.code,
          name: original.name,
          createdAt: original.createdAt,
          updatedAt: original.updatedAt,
        },
        "00000000-0000-0000-0000-000000000001"
      )

      const update = ToUpdate(originalWithId)
      const row = {
        ...update,
        id: originalWithId.id,
        createdAt: originalWithId.createdAt,
        updatedAt: originalWithId.updatedAt,
      } as Parameters<typeof ToDomain>[0]
      const restored = ToDomain(row)

      expect(restored.equals(originalWithId)).toBe(true)
      expect(restored.code).toBe(original.code)
      expect(restored.name).toBe(original.name)
    })
  })
})
