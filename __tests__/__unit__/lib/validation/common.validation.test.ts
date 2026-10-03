import { describe, it, expect } from "vitest"
import {
  ID_SCHEMA,
  OPTIONAL_TEXT_SCHEMA,
} from "@/lib/validation/common.validation"

describe("lib/validation/common.validation", () => {
  describe("ID_SCHEMA", () => {
    it("should accept valid id string", () => {
      const result = ID_SCHEMA.safeParse("abc123")

      expect(result.success).toBe(true)
      expect(result.data).toBe("abc123")
    })

    it("should trim whitespace", () => {
      const result = ID_SCHEMA.safeParse("  abc123  ")

      expect(result.success).toBe(true)
      expect(result.data).toBe("abc123")
    })

    it("should reject empty string", () => {
      const result = ID_SCHEMA.safeParse("")
      expect(result.success).toBe(false)
    })

    it("should reject whitespace only", () => {
      const result = ID_SCHEMA.safeParse("   ")
      expect(result.success).toBe(false)
    })

    it("should reject null", () => {
      const result = ID_SCHEMA.safeParse(null)
      expect(result.success).toBe(false)
    })

    it("should reject undefined", () => {
      const result = ID_SCHEMA.safeParse(undefined)
      expect(result.success).toBe(false)
    })

    it("should reject non-string", () => {
      const result = ID_SCHEMA.safeParse(123)
      expect(result.success).toBe(false)
    })
  })

  describe("OPTIONAL_TEXT_SCHEMA", () => {
    it("should accept valid text", () => {
      const result = OPTIONAL_TEXT_SCHEMA.safeParse("some text")

      expect(result.success).toBe(true)
      expect(result.data).toBe("some text")
    })

    it("should trim whitespace", () => {
      const result =
        OPTIONAL_TEXT_SCHEMA.safeParse("  some text  ")

      expect(result.success).toBe(true)
      expect(result.data).toBe("some text")
    })

    it("should accept empty string", () => {
      const result = OPTIONAL_TEXT_SCHEMA.safeParse("")

      expect(result.success).toBe(true)
      expect(result.data).toBe("")
    })

    it("should reject string over 255 chars", () => {
      const longText = "a".repeat(256)
      const result = OPTIONAL_TEXT_SCHEMA.safeParse(longText)

      expect(result.success).toBe(false)
    })

    it("should accept exactly 255 chars", () => {
      const maxText = "a".repeat(255)
      const result = OPTIONAL_TEXT_SCHEMA.safeParse(maxText)

      expect(result.success).toBe(true)
      expect(result.data).toBe(maxText)
    })

    it("should reject null", () => {
      const result = OPTIONAL_TEXT_SCHEMA.safeParse(null)
      expect(result.success).toBe(false)
    })

    it("should reject undefined", () => {
      const result = OPTIONAL_TEXT_SCHEMA.safeParse(undefined)
      expect(result.success).toBe(false)
    })
  })
})
