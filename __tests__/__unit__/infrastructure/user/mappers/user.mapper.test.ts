import { describe, it, expect } from "vitest"

import { User } from "@/domain/user/entities/user.entity"
import { CPF } from "@/value-objects/cpf.vo"
import {
  ToDomain,
  ToInsert,
  ToUpdate,
} from "@/infrastructure/user/mappers/user.mapper"
import { buildUser } from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-00000000003a"

describe("infrastructure/user/mappers/user.mapper", () => {
  describe("ToDomain", () => {
    it("should map database row to User entity", () => {
      const row = {
        id: ID,
        name: "Test User",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        cpf: "52998224725",
        role: "MANAGER" as const,
        emailVerified: true,
        image: "https://cdn.test/avatar.png",
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-15T12:00:00.000Z"),
      }

      const user = ToDomain(row)

      expect(user.id).toBe(ID)
      expect(user.name).toBe("Test User")
      expect(user.email).toBe("test@example.com")
      expect(user.firstName).toBe("Test")
      expect(user.lastName).toBe("User")
      expect(user.cpf.value).toBe("52998224725")
      expect(user.role).toBe("MANAGER")
      expect(user.emailVerified).toBe(true)
      expect(user.image).toBe("https://cdn.test/avatar.png")
      expect(user.createdAt).toEqual(row.createdAt)
      expect(user.updatedAt).toEqual(row.updatedAt)
    })

    it("should map a null image to null", () => {
      const user = ToDomain({
        id: ID,
        name: "Test User",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        cpf: "52998224725",
        role: "USER" as const,
        emailVerified: false,
        image: null,
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-01T00:00:00.000Z"),
      })

      expect(user.image).toBeNull()
      expect(user.emailVerified).toBe(false)
    })
  })

  describe("ToInsert", () => {
    it("should map User entity to insert object without id", () => {
      const user = buildUser()

      const insert = ToInsert(user)

      expect(insert).not.toHaveProperty("id")
      expect(insert.name).toBe("Test User")
      expect(insert.email).toBe("test@example.com")
      expect(insert.cpf).toBe("52998224725")
      expect(insert.role).toBe("USER")
      expect(insert.createdAt).toEqual(user.createdAt)
      expect(insert.updatedAt).toEqual(user.updatedAt)
    })

    it("should map an absent image to null", () => {
      const insert = ToInsert(buildUser({ image: null }))

      expect(insert.image).toBeNull()
    })
  })

  describe("ToUpdate", () => {
    it("should map User entity to update object without timestamps", () => {
      const user = buildUser()

      const update = ToUpdate(user)

      expect(update).not.toHaveProperty("id")
      expect(update).not.toHaveProperty("createdAt")
      expect(update).not.toHaveProperty("updatedAt")
      expect(update.email).toBe("test@example.com")
      expect(update.cpf).toBe("52998224725")
    })
  })

  describe("round-trip", () => {
    it("should preserve the entity through ToInsert then ToDomain", () => {
      const original = User.create(
        {
          name: "Test User",
          email: "test@example.com",
          firstName: "Test",
          lastName: "User",
          cpf: CPF.create("52998224725"),
          role: "MANAGER",
          emailVerified: true,
          image: "https://cdn.test/avatar.png",
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
      expect(restored.role).toBe("MANAGER")
      expect(restored.emailVerified).toBe(true)
    })

    it("should preserve the entity through ToUpdate then ToDomain", () => {
      const original = User.create(
        {
          name: "Test User",
          email: "test@example.com",
          firstName: "Test",
          lastName: "User",
          cpf: CPF.create("52998224725"),
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
