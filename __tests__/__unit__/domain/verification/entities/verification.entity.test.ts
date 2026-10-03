import { describe, it, expect } from "vitest"

import { Verification } from "@/domain/verification/entities/verification.entity"
import { ValidationError } from "@/errors"
import { EntityId } from "@/value-objects"
import { buildVerification } from "__tests__/__setup__/_factories.setup"

const PERSISTED_ID = EntityId.create("verification-123")
const EXPIRES_AT = new Date("2026-12-31T23:59:59.000Z")

describe("Verification", () => {
  describe("create", () => {
    it("should create a valid Verification with required props", () => {
      const verification = Verification.create({
        identifier: "test@example.com",
        value: "123456",
        expiresAt: EXPIRES_AT,
      })

      expect(verification.identifier).toBe("test@example.com")
      expect(verification.value).toBe("123456")
      expect(verification.expiresAt).toEqual(EXPIRES_AT)
      expect(verification.id).toBeUndefined()
    })

    it("should create a Verification with provided id", () => {
      const verification = Verification.create(
        {
          identifier: "test@example.com",
          value: "123456",
          expiresAt: EXPIRES_AT,
        },
        PERSISTED_ID
      )

      expect(verification.id).toBe(PERSISTED_ID)
    })

    it("should create a Verification with custom timestamps", () => {
      const createdAt = new Date("2026-01-01T00:00:00.000Z")

      const verification = Verification.create({
        identifier: "test@example.com",
        value: "123456",
        expiresAt: EXPIRES_AT,
        createdAt,
      })

      expect(verification.createdAt).toEqual(createdAt)
    })

    it("should throw ValidationError when identifier is blank", () => {
      expect(() =>
        Verification.create({
          identifier: "   ",
          value: "123456",
          expiresAt: EXPIRES_AT,
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when value is blank", () => {
      expect(() =>
        Verification.create({
          identifier: "test@example.com",
          value: "  ",
          expiresAt: EXPIRES_AT,
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when expiresAt is missing", () => {
      expect(() =>
        Verification.create({
          identifier: "test@example.com",
          value: "123456",
        } as Parameters<typeof Verification.create>[0])
      ).toThrow(ValidationError)
    })
  })

  describe("equals", () => {
    it("should return true when comparing the same instance", () => {
      const verification = buildVerification()

      expect(verification.equals(verification)).toBe(true)
    })

    it("should return true when instances share the same id", () => {
      const first = buildVerification({ id: PERSISTED_ID })
      const second = buildVerification({ id: PERSISTED_ID })

      expect(first.equals(second)).toBe(true)
    })

    it("should return false when ids differ", () => {
      const first = buildVerification({
        id: EntityId.create("verification-1"),
      })
      const second = buildVerification({
        id: EntityId.create("verification-2"),
      })

      expect(first.equals(second)).toBe(false)
    })

    it("should return false when this has no id", () => {
      const first = buildVerification()
      const second = buildVerification({ id: PERSISTED_ID })

      expect(first.equals(second)).toBe(false)
    })

    it("should return false when other has no id", () => {
      const first = buildVerification({ id: PERSISTED_ID })
      const second = buildVerification()

      expect(first.equals(second)).toBe(false)
    })

    it("should return false when other is null", () => {
      const verification = buildVerification()

      expect(verification.equals(null)).toBe(false)
    })

    it("should return false when other is undefined", () => {
      const verification = buildVerification()

      expect(verification.equals(undefined)).toBe(false)
    })
  })

  describe("immutability", () => {
    it("should not allow direct property mutation", () => {
      const verification = buildVerification()

      expect(() => {
        // @ts-expect-error - exercising runtime immutability
        verification.value = "654321"
      }).toThrow(TypeError)
    })
  })
})
