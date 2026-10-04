import { describe, it, expect } from "vitest"
import { HasRole, IsManager, IsUser } from "@/lib/authz/has-role"

describe("lib/authz/has-role", () => {
  describe("HasRole", () => {
    it("should return true when user role is in allowed list", () => {
      expect(HasRole("USER", ["USER", "MANAGER"])).toBe(true)
    })

    it("should return true when user role is MANAGER and MANAGER allowed", () => {
      expect(HasRole("MANAGER", ["MANAGER"])).toBe(true)
    })

    it("should return false when user role not in allowed list", () => {
      expect(HasRole("USER", ["MANAGER"])).toBe(false)
    })

    it("should return false when user role is USER and only MANAGER allowed", () => {
      expect(HasRole("MANAGER", ["USER"])).toBe(false)
    })
  })

  describe("IsManager", () => {
    it("should return true when role is MANAGER", () => {
      expect(IsManager("MANAGER")).toBe(true)
    })

    it("should return false when role is USER", () => {
      expect(IsManager("USER")).toBe(false)
    })
  })

  describe("IsUser", () => {
    it("should return true when role is USER", () => {
      expect(IsUser("USER")).toBe(true)
    })

    it("should return false when role is MANAGER", () => {
      expect(IsUser("MANAGER")).toBe(false)
    })
  })
})
