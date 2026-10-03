import { describe, it, expect } from "vitest"
import { EntityId } from "@/value-objects/entity-id.vo"
import { ValidationError } from "@/errors"

describe("value-objects/entity-id.vo", () => {
  describe("create", () => {
    it("should create valid EntityId from string", () => {
      const id = EntityId.create(
        "a3f6c9d2e0b14a2f9c6e7a1b2c3d4e5f"
      )

      expect(typeof id).toBe("string")
      expect(id).toBe("a3f6c9d2e0b14a2f9c6e7a1b2c3d4e5f")
    })

    it("should trim whitespace before creating", () => {
      const id = EntityId.create("  abc123  ")

      expect(id).toBe("abc123")
    })

    it("should throw ValidationError when value is undefined", () => {
      expect(() =>
        EntityId.create(undefined as unknown as string)
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when value is null", () => {
      expect(() =>
        EntityId.create(null as unknown as string)
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when value is blank", () => {
      expect(() => EntityId.create("")).toThrow(ValidationError)
      expect(() => EntityId.create("   ")).toThrow(
        ValidationError
      )
    })

    it("should accept UUID-like strings", () => {
      const id = EntityId.create(
        "00000000-0000-0000-0000-000000000000"
      )

      expect(id).toBe("00000000-0000-0000-0000-000000000000")
    })

    it("should accept Better-Auth style opaque ids", () => {
      const id = EntityId.create("k1x2m3n4o5p6q7r8s9t0")

      expect(id).toBe("k1x2m3n4o5p6q7r8s9t0")
    })
  })

  describe("equals", () => {
    it("should return true for equal EntityIds", () => {
      const a = EntityId.create("abc123")
      const b = EntityId.create("abc123")

      expect(EntityId.equals(a, b)).toBe(true)
    })

    it("should return false for different EntityIds", () => {
      const a = EntityId.create("abc123")
      const b = EntityId.create("def456")

      expect(EntityId.equals(a, b)).toBe(false)
    })

    it("should be case-sensitive", () => {
      const a = EntityId.create("ABC123")
      const b = EntityId.create("abc123")

      expect(EntityId.equals(a, b)).toBe(false)
    })
  })
})
