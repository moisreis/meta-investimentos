import { describe, it, expect } from "vitest"

import { Session } from "@/domain/session/entities/session.entity"
import { ValidationError } from "@/errors"
import { EntityId } from "@/value-objects"
import { buildSession } from "__tests__/__setup__/_factories.setup"

const PERSISTED_ID = EntityId.create("session-123")
const EXPIRES_AT = new Date("2026-12-31T23:59:59.000Z")

describe("Session", () => {
  describe("create", () => {
    it("should create a valid Session with required props", () => {
      const session = Session.create({
        userId: EntityId.create("user-1"),
        token: "session-token",
        expiresAt: EXPIRES_AT,
      })

      expect(session.userId).toBe(EntityId.create("user-1"))
      expect(session.token).toBe("session-token")
      expect(session.expiresAt).toEqual(EXPIRES_AT)
      expect(session.ipAddress).toBeNull()
      expect(session.userAgent).toBeNull()
      expect(session.id).toBeUndefined()
    })

    it("should create a Session with provided id", () => {
      const session = Session.create(
        {
          userId: EntityId.create("user-1"),
          token: "session-token",
          expiresAt: EXPIRES_AT,
        },
        PERSISTED_ID
      )

      expect(session.id).toBe(PERSISTED_ID)
    })

    it("should create a Session with optional props", () => {
      const session = Session.create({
        userId: EntityId.create("user-1"),
        token: "session-token",
        expiresAt: EXPIRES_AT,
        ipAddress: "10.0.0.1",
        userAgent: "vitest",
      })

      expect(session.ipAddress).toBe("10.0.0.1")
      expect(session.userAgent).toBe("vitest")
    })

    it("should create a Session with custom timestamps", () => {
      const createdAt = new Date("2026-01-01T00:00:00.000Z")

      const session = Session.create({
        userId: EntityId.create("user-1"),
        token: "session-token",
        expiresAt: EXPIRES_AT,
        createdAt,
      })

      expect(session.createdAt).toEqual(createdAt)
    })

    it("should throw ValidationError when userId is blank", () => {
      expect(() =>
        Session.create({
          userId: EntityId.create("   "),
          token: "session-token",
          expiresAt: EXPIRES_AT,
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when token is blank", () => {
      expect(() =>
        Session.create({
          userId: EntityId.create("user-1"),
          token: "   ",
          expiresAt: EXPIRES_AT,
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when expiresAt is missing", () => {
      expect(() =>
        Session.create({
          userId: EntityId.create("user-1"),
          token: "session-token",
        } as Parameters<typeof Session.create>[0])
      ).toThrow(ValidationError)
    })
  })

  describe("equals", () => {
    it("should return true when comparing the same instance", () => {
      const session = buildSession()

      expect(session.equals(session)).toBe(true)
    })

    it("should return true when instances share the same id", () => {
      const first = buildSession({ id: PERSISTED_ID })
      const second = buildSession({ id: PERSISTED_ID })

      expect(first.equals(second)).toBe(true)
    })

    it("should return false when ids differ", () => {
      const first = buildSession({
        id: EntityId.create("session-1"),
      })
      const second = buildSession({
        id: EntityId.create("session-2"),
      })

      expect(first.equals(second)).toBe(false)
    })

    it("should return false when this has no id", () => {
      const first = buildSession()
      const second = buildSession({ id: PERSISTED_ID })

      expect(first.equals(second)).toBe(false)
    })

    it("should return false when other has no id", () => {
      const first = buildSession({ id: PERSISTED_ID })
      const second = buildSession()

      expect(first.equals(second)).toBe(false)
    })

    it("should return false when other is null", () => {
      const session = buildSession()

      expect(session.equals(null)).toBe(false)
    })

    it("should return false when other is undefined", () => {
      const session = buildSession()

      expect(session.equals(undefined)).toBe(false)
    })
  })

  describe("immutability", () => {
    it("should not allow direct property mutation", () => {
      const session = buildSession()

      expect(() => {
        // @ts-expect-error - exercising runtime immutability
        session.token = "other-token"
      }).toThrow(TypeError)
    })
  })
})
