import { describe, it, expect } from "vitest"
import { RequireRole } from "@/lib/authz/require-role"

describe("lib/authz/require-role", () => {
  describe("RequireRole", () => {
    it("should return success when user role is allowed", () => {
      const result = RequireRole("USER", ["USER", "MANAGER"])

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBeNull()
      }
    })

    it("should return success when MANAGER is allowed", () => {
      const result = RequireRole("MANAGER", ["MANAGER"])

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBeNull()
      }
    })

    it("should return failure when user role not allowed", () => {
      const result = RequireRole("USER", ["MANAGER"])

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe("Acesso negado.")
      }
    })

    it("should return failure when MANAGER tries with only USER allowed", () => {
      const result = RequireRole("MANAGER", ["USER"])

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe("Acesso negado.")
      }
    })
  })
})
