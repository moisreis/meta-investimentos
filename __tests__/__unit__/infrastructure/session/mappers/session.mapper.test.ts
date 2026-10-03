import { describe, it, expect } from "vitest"

import { Session } from "@/domain/session/entities/session.entity"
import { EntityId } from "@/value-objects"
import {
  ToDomain,
  ToInsert,
  ToUpdate,
} from "@/infrastructure/session/mappers/session.mapper"
import { buildSession } from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000037"
const USER_ID = "user-1"
const EXPIRES_AT = new Date("2026-12-31T23:59:59.000Z")

describe("infrastructure/session/mappers/session.mapper", () => {
  describe("ToDomain", () => {
    it("should map database row to Session entity", () => {
      const row = {
        id: ID,
        userId: USER_ID,
        token: "session-token",
        expiresAt: EXPIRES_AT,
        ipAddress: "10.0.0.1",
        userAgent: "vitest",
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-15T12:00:00.000Z"),
      }

      const session = ToDomain(row)

      expect(session.id).toBe(EntityId.create(ID))
      expect(session.userId).toBe(EntityId.create(USER_ID))
      expect(session.token).toBe("session-token")
      expect(session.expiresAt).toEqual(EXPIRES_AT)
      expect(session.ipAddress).toBe("10.0.0.1")
      expect(session.userAgent).toBe("vitest")
      expect(session.createdAt).toEqual(row.createdAt)
      expect(session.updatedAt).toEqual(row.updatedAt)
    })

    it("should map null optional columns to null", () => {
      const session = ToDomain({
        id: ID,
        userId: USER_ID,
        token: "session-token",
        expiresAt: EXPIRES_AT,
        ipAddress: null,
        userAgent: null,
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-01T00:00:00.000Z"),
      })

      expect(session.ipAddress).toBeNull()
      expect(session.userAgent).toBeNull()
    })
  })

  describe("ToInsert", () => {
    it("should map Session entity to insert object without id", () => {
      const session = buildSession()

      const insert = ToInsert(session)

      expect(insert).not.toHaveProperty("id")
      expect(insert.userId).toBe(USER_ID)
      expect(insert.token).toBe("session-token")
      expect(insert.expiresAt).toEqual(session.expiresAt)
      expect(insert.createdAt).toEqual(session.createdAt)
      expect(insert.updatedAt).toEqual(session.updatedAt)
    })

    it("should map absent optional columns to null", () => {
      const insert = ToInsert(
        buildSession({ ipAddress: null, userAgent: null })
      )

      expect(insert.ipAddress).toBeNull()
      expect(insert.userAgent).toBeNull()
    })
  })

  describe("ToUpdate", () => {
    it("should map Session entity to update object without timestamps", () => {
      const session = buildSession()

      const update = ToUpdate(session)

      expect(update).not.toHaveProperty("id")
      expect(update).not.toHaveProperty("createdAt")
      expect(update).not.toHaveProperty("updatedAt")
      expect(update.token).toBe("session-token")
    })
  })

  describe("round-trip", () => {
    it("should preserve the entity through ToInsert then ToDomain", () => {
      const original = Session.create(
        {
          userId: EntityId.create(USER_ID),
          token: "session-token",
          expiresAt: EXPIRES_AT,
          ipAddress: "10.0.0.1",
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
      expect(restored.ipAddress).toBe("10.0.0.1")
      expect(restored.userAgent).toBeNull()
    })
  })
})
