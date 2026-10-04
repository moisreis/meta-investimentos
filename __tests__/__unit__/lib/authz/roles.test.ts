import { describe, it, expect } from "vitest"
import { ROLES } from "@/lib/authz/roles"

describe("lib/authz/roles", () => {
  describe("ROLES", () => {
    it("should define USER role", () => {
      expect(ROLES.USER).toBe("USER")
    })

    it("should define MANAGER role", () => {
      expect(ROLES.MANAGER).toBe("MANAGER")
    })

    it("should have readonly structure", () => {
      expect(Object.keys(ROLES)).toHaveLength(2)
    })
  })
})
