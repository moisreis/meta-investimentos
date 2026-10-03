import { describe, it, expect } from "vitest"

import { Verification } from "@/domain/verification/entities/verification.entity"
import { EntityId } from "@/value-objects"
import {
  ToDomain,
  ToInsert,
  ToUpdate,
} from "@/infrastructure/verification/mappers/verification.mapper"
import { buildVerification } from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000038"
const EXPIRES_AT = new Date("2026-12-31T23:59:59.000Z")

describe("infrastructure/verification/mappers/verification.mapper", () => {
  describe("ToDomain", () => {
    it("should map database row to Verification entity", () => {
      const row = {
        id: ID,
        identifier: "test@example.com",
        value: "123456",
        expiresAt: EXPIRES_AT,
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-15T12:00:00.000Z"),
      }

      const verification = ToDomain(row)

      expect(verification.id).toBe(EntityId.create(ID))
      expect(verification.identifier).toBe("test@example.com")
      expect(verification.value).toBe("123456")
      expect(verification.expiresAt).toEqual(EXPIRES_AT)
      expect(verification.createdAt).toEqual(row.createdAt)
      expect(verification.updatedAt).toEqual(row.updatedAt)
    })
  })

  describe("ToInsert", () => {
    it("should map Verification entity to insert object without id", () => {
      const verification = buildVerification()

      const insert = ToInsert(verification)

      expect(insert).not.toHaveProperty("id")
      expect(insert.identifier).toBe("test@example.com")
      expect(insert.value).toBe("123456")
      expect(insert.expiresAt).toEqual(EXPIRES_AT)
      expect(insert.createdAt).toEqual(verification.createdAt)
      expect(insert.updatedAt).toEqual(verification.updatedAt)
    })
  })

  describe("ToUpdate", () => {
    it("should map Verification entity to update object without timestamps", () => {
      const verification = buildVerification()

      const update = ToUpdate(verification)

      expect(update).not.toHaveProperty("id")
      expect(update).not.toHaveProperty("createdAt")
      expect(update).not.toHaveProperty("updatedAt")
      expect(update.identifier).toBe("test@example.com")
      expect(update.value).toBe("123456")
    })
  })

  describe("round-trip", () => {
    it("should preserve the entity through ToInsert then ToDomain", () => {
      const original = Verification.create(
        {
          identifier: "test@example.com",
          value: "654321",
          expiresAt: EXPIRES_AT,
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
          updatedAt: new Date("2026-01-01T00:00:00.000Z"),
        },
        ID
      )

      const row = {
        ...ToInsert(original),
        id: original.id!,
      } as Parameters<typeof ToDomain>[0]

      expect(ToDomain(row).equals(original)).toBe(true)
    })

    it("should preserve the entity through ToUpdate then ToDomain", () => {
      const original = Verification.create(
        {
          identifier: "test@example.com",
          value: "123456",
          expiresAt: EXPIRES_AT,
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
