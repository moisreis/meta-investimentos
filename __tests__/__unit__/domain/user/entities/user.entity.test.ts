import { describe, it, expect } from "vitest"

import { User } from "@/domain/user/entities/user.entity"
import { ValidationError } from "@/errors"
import { EntityId } from "@/value-objects"
import { CPF } from "@/value-objects/cpf.vo"
import {
  buildCpf,
  buildUser,
} from "__tests__/__setup__/_factories.setup"

const PERSISTED_ID = EntityId.create("user-123")
const NOW = new Date("2026-06-15T10:00:00.000Z")

/**
 * Builds a valid prop bag for `User.create`.
 *
 * @param overrides - Props to override.
 * @returns Complete User props.
 */
function createProps(): {
  name: string
  email: string
  firstName: string
  lastName: string
  cpf: CPF
} {
  return {
    name: "Test User",
    email: "test@example.com",
    firstName: "Test",
    lastName: "User",
    cpf: buildCpf(),
  }
}

describe("User", () => {
  describe("create", () => {
    it("should create a valid User with required props", () => {
      const user = User.create(createProps())

      expect(user.name).toBe("Test User")
      expect(user.email).toBe("test@example.com")
      expect(user.firstName).toBe("Test")
      expect(user.lastName).toBe("User")
      expect(user.cpf.value).toBe("52998224725")
      expect(user.role).toBe("USER")
      expect(user.emailVerified).toBe(false)
      expect(user.image).toBeNull()
      expect(user.id).toBeUndefined()
    })

    it("should create a User with provided id", () => {
      const user = User.create(createProps(), PERSISTED_ID)

      expect(user.id).toBe(PERSISTED_ID)
    })

    it("should create a User with optional props", () => {
      const createdAt = new Date("2026-01-01T00:00:00.000Z")
      const user = User.create({
        ...createProps(),
        role: "MANAGER",
        emailVerified: true,
        image: "https://cdn.test/avatar.png",
        createdAt,
      })

      expect(user.role).toBe("MANAGER")
      expect(user.emailVerified).toBe(true)
      expect(user.image).toBe("https://cdn.test/avatar.png")
      expect(user.createdAt).toEqual(createdAt)
    })

    it("should throw ValidationError when name is blank", () => {
      expect(() =>
        User.create({ ...createProps(), name: "   " })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when email is malformed", () => {
      expect(() =>
        User.create({ ...createProps(), email: "not-an-email" })
      ).toThrow(ValidationError)
      expect(() =>
        User.create({ ...createProps(), email: "missing@tld" })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when firstName is blank", () => {
      expect(() =>
        User.create({ ...createProps(), firstName: "" })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when lastName is blank", () => {
      expect(() =>
        User.create({ ...createProps(), lastName: "  " })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when cpf is missing", () => {
      expect(() =>
        User.create({
          ...createProps(),
          cpf: undefined as unknown as CPF,
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when role is unknown", () => {
      expect(() =>
        User.create({
          ...createProps(),
          role: "ADMIN" as never,
        })
      ).toThrow(ValidationError)
    })
  })

  describe("maskedCpf", () => {
    it("should mask the middle digits of the cpf", () => {
      const user = buildUser({ cpf: buildCpf("52998224725") })

      expect(user.maskedCpf).toBe("529.***.***-25")
    })
  })

  describe("updateProfile", () => {
    it("should return new User with updated fields", () => {
      const user = buildUser({
        id: PERSISTED_ID,
        name: "Old Name",
        firstName: "Old",
        lastName: "Name",
      })

      const updated = user.updateProfile(
        { name: "New Name", firstName: "New", lastName: "Name" },
        NOW
      )

      expect(updated.name).toBe("New Name")
      expect(updated.firstName).toBe("New")
      expect(updated.id).toBe(PERSISTED_ID)
      expect(updated.updatedAt).toEqual(NOW)
    })

    it("should keep untouched fields", () => {
      const user = buildUser({
        id: PERSISTED_ID,
        firstName: "Old",
      })

      const updated = user.updateProfile(
        { lastName: "Changed" },
        NOW
      )

      expect(updated.firstName).toBe("Old")
      expect(updated.lastName).toBe("Changed")
    })

    it("should allow clearing the image", () => {
      const user = buildUser({
        id: PERSISTED_ID,
        image: "https://cdn.test/avatar.png",
      })

      const updated = user.updateProfile({ image: null }, NOW)

      expect(updated.image).toBeNull()
    })

    it("should keep the original User unchanged", () => {
      const user = buildUser({
        id: PERSISTED_ID,
        name: "Old Name",
      })

      user.updateProfile({ name: "New Name" }, NOW)

      expect(user.name).toBe("Old Name")
    })

    it("should throw ValidationError when name is blank", () => {
      const user = buildUser({ id: PERSISTED_ID })

      expect(() =>
        user.updateProfile({ name: "  " }, NOW)
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when firstName is blank", () => {
      const user = buildUser({ id: PERSISTED_ID })

      expect(() =>
        user.updateProfile({ firstName: "" }, NOW)
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when lastName is blank", () => {
      const user = buildUser({ id: PERSISTED_ID })

      expect(() =>
        user.updateProfile({ lastName: " " }, NOW)
      ).toThrow(ValidationError)
    })
  })

  describe("equals", () => {
    it("should return true when comparing the same instance", () => {
      const user = buildUser()

      expect(user.equals(user)).toBe(true)
    })

    it("should return true when instances share the same id", () => {
      const first = buildUser({ id: PERSISTED_ID })
      const second = buildUser({ id: PERSISTED_ID })

      expect(first.equals(second)).toBe(true)
    })

    it("should return false when ids differ", () => {
      const first = buildUser({ id: EntityId.create("user-1") })
      const second = buildUser({ id: EntityId.create("user-2") })

      expect(first.equals(second)).toBe(false)
    })

    it("should return false when this has no id", () => {
      const first = buildUser()
      const second = buildUser({ id: PERSISTED_ID })

      expect(first.equals(second)).toBe(false)
    })

    it("should return false when other has no id", () => {
      const first = buildUser({ id: PERSISTED_ID })
      const second = buildUser()

      expect(first.equals(second)).toBe(false)
    })

    it("should return false when other is null", () => {
      const user = buildUser()

      expect(user.equals(null)).toBe(false)
    })

    it("should return false when other is undefined", () => {
      const user = buildUser()

      expect(user.equals(undefined)).toBe(false)
    })
  })

  describe("immutability", () => {
    it("should not allow direct property mutation", () => {
      const user = buildUser()

      expect(() => {
        // @ts-expect-error - exercising runtime immutability
        user.email = "other@example.com"
      }).toThrow(TypeError)
    })

    it("should return new instances on mutations", () => {
      const user = buildUser({ id: PERSISTED_ID })

      const updated = user.updateProfile({ name: "Novo" }, NOW)

      expect(updated).not.toBe(user)
    })
  })
})
