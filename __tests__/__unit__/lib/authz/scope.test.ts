import { describe, it, expect } from "vitest"
import { AssertOwnerOrManager } from "@/lib/authz/scope"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"

describe("lib/authz/scope", () => {
  describe("AssertOwnerOrManager", () => {
    it("should return true when user is manager", () => {
      const ownerId = EntityId.create("owner-1")
      const userId = EntityId.create("user-1")

      const result = AssertOwnerOrManager({
        ownerId,
        userId,
        role: "MANAGER",
      })

      expect(result).toBe(true)
    })

    it("should return true when user is owner", () => {
      const id = EntityId.create("id-1")

      const result = AssertOwnerOrManager({
        ownerId: id,
        userId: id,
        role: "USER",
      })

      expect(result).toBe(true)
    })

    it("should return true when user is owner with string ids", () => {
      const id = EntityId.create("id-2").toString()

      const result = AssertOwnerOrManager({
        ownerId: id,
        userId: id,
        role: "USER",
      })

      expect(result).toBe(true)
    })

    it("should throw NotFoundError when user is not owner and not manager", () => {
      const ownerId = EntityId.create("owner-3")
      const userId = EntityId.create("user-3")

      expect(() => {
        AssertOwnerOrManager({
          ownerId,
          userId,
          role: "USER",
        })
      }).toThrow(NotFoundError)
    })

    it("should throw NotFoundError with correct message when access denied", () => {
      const ownerId = EntityId.create("owner-4")
      const userId = EntityId.create("user-4")

      expect(() => {
        AssertOwnerOrManager({
          ownerId,
          userId,
          role: "USER",
        })
      }).toThrow("`Resource` not found.")
    })
  })
})
