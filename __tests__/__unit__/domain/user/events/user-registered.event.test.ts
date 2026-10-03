import { describe, it, expect, afterEach } from "vitest"

import { UserRegistered } from "@/domain/user/events/user-registered.event"
import { ValidationError } from "@/errors"
import { EntityId } from "@/value-objects"
import { buildEntityId } from "__tests__/__setup__/_factories.setup"
import type { UserRole } from "@/lib/auth/user-role"
import {
  useFixedClock,
  useRealClock,
  getFixedDate,
} from "__tests__/__setup__/_clock.setup"

describe("domain/user/events/user-registered.event", () => {
  afterEach(() => {
    useRealClock()
  })

  describe("UserRegistered", () => {
    describe("create", () => {
      it("should create a valid UserRegistered with required props", () => {
        const userId = buildEntityId("user-1")
        const occurredAt = new Date("2026-05-05T12:00:00.000Z")

        const event = UserRegistered.create({
          userId,
          name: "Maria Silva",
          email: "maria@example.com",
          firstName: "Maria",
          lastName: "Silva",
          maskedCpf: "123.***.***-09",
          occurredAt,
        })

        expect(event.id).toBeUndefined()
        expect(event.userId).toBe(userId)
        expect(event.name).toBe("Maria Silva")
        expect(event.email).toBe("maria@example.com")
        expect(event.firstName).toBe("Maria")
        expect(event.lastName).toBe("Silva")
        expect(event.maskedCpf).toBe("123.***.***-09")
        expect(event.occurredAt).toEqual(occurredAt)
      })

      it("should create a UserRegistered with provided id", () => {
        const event = UserRegistered.create(
          {
            userId: buildEntityId("user-1"),
            name: "Maria Silva",
            email: "maria@example.com",
            firstName: "Maria",
            lastName: "Silva",
            maskedCpf: "123.***.***-09",
          },
          "event-user-registered-1"
        )

        expect(event.id).toBe(
          EntityId.create("event-user-registered-1")
        )
      })

      it("should leave the id undefined when an empty id is given", () => {
        const event = UserRegistered.create(
          {
            userId: buildEntityId("user-1"),
            name: "Maria Silva",
            email: "maria@example.com",
            firstName: "Maria",
            lastName: "Silva",
            maskedCpf: "123.***.***-09",
          },
          ""
        )

        expect(event.id).toBeUndefined()
      })

      it("should default the role to USER and the verified flag to false", () => {
        const event = UserRegistered.create({
          userId: buildEntityId("user-1"),
          name: "Maria Silva",
          email: "maria@example.com",
          firstName: "Maria",
          lastName: "Silva",
          maskedCpf: "123.***.***-09",
        })

        expect(event.role).toBe("USER")
        expect(event.emailVerified).toBe(false)
      })

      it("should keep the provided role and verified flag", () => {
        const event = UserRegistered.create({
          userId: buildEntityId("user-1"),
          name: "Maria Silva",
          email: "maria@example.com",
          firstName: "Maria",
          lastName: "Silva",
          maskedCpf: "123.***.***-09",
          role: "MANAGER",
          emailVerified: true,
        })

        expect(event.role).toBe("MANAGER")
        expect(event.emailVerified).toBe(true)
      })

      it("should accept the USER role when explicitly provided", () => {
        const event = UserRegistered.create({
          userId: buildEntityId("user-1"),
          name: "Maria Silva",
          email: "maria@example.com",
          firstName: "Maria",
          lastName: "Silva",
          maskedCpf: "123.***.***-09",
          role: "USER",
        })

        expect(event.role).toBe("USER")
      })

      it("should default occurredAt to the current time when omitted", () => {
        useFixedClock()

        const event = UserRegistered.create({
          userId: buildEntityId("user-1"),
          name: "Maria Silva",
          email: "maria@example.com",
          firstName: "Maria",
          lastName: "Silva",
          maskedCpf: "123.***.***-09",
        })

        expect(event.occurredAt).toEqual(getFixedDate())
      })

      it("should keep the provided occurredAt instead of the current time", () => {
        useFixedClock()

        const occurredAt = new Date("2026-07-04T16:00:00.000Z")

        const event = UserRegistered.create({
          userId: buildEntityId("user-1"),
          name: "Maria Silva",
          email: "maria@example.com",
          firstName: "Maria",
          lastName: "Silva",
          maskedCpf: "123.***.***-09",
          occurredAt,
        })

        expect(event.occurredAt).toEqual(occurredAt)
        expect(event.occurredAt).not.toEqual(getFixedDate())
      })

      it("should return a new date instance on every occurredAt read", () => {
        const event = UserRegistered.create({
          userId: buildEntityId("user-1"),
          name: "Maria Silva",
          email: "maria@example.com",
          firstName: "Maria",
          lastName: "Silva",
          maskedCpf: "123.***.***-09",
        })

        expect(event.occurredAt).not.toBe(event.occurredAt)
      })

      it("should throw ValidationError when userId is missing", () => {
        expect(() =>
          UserRegistered.create({
            name: "Maria Silva",
            email: "maria@example.com",
            firstName: "Maria",
            lastName: "Silva",
            maskedCpf: "123.***.***-09",
          } as Parameters<typeof UserRegistered.create>[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when name is missing or blank", () => {
        expect(() =>
          UserRegistered.create({
            userId: buildEntityId("user-1"),
            email: "maria@example.com",
            firstName: "Maria",
            lastName: "Silva",
            maskedCpf: "123.***.***-09",
          } as Parameters<typeof UserRegistered.create>[0])
        ).toThrow(ValidationError)

        expect(() =>
          UserRegistered.create({
            userId: buildEntityId("user-1"),
            name: "",
            email: "maria@example.com",
            firstName: "Maria",
            lastName: "Silva",
            maskedCpf: "123.***.***-09",
          })
        ).toThrow(ValidationError)

        expect(() =>
          UserRegistered.create({
            userId: buildEntityId("user-1"),
            name: "   ",
            email: "maria@example.com",
            firstName: "Maria",
            lastName: "Silva",
            maskedCpf: "123.***.***-09",
          })
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when email is missing", () => {
        expect(() =>
          UserRegistered.create({
            userId: buildEntityId("user-1"),
            name: "Maria Silva",
            firstName: "Maria",
            lastName: "Silva",
            maskedCpf: "123.***.***-09",
          } as Parameters<typeof UserRegistered.create>[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when firstName is missing or blank", () => {
        expect(() =>
          UserRegistered.create({
            userId: buildEntityId("user-1"),
            name: "Maria Silva",
            email: "maria@example.com",
            lastName: "Silva",
            maskedCpf: "123.***.***-09",
          } as Parameters<typeof UserRegistered.create>[0])
        ).toThrow(ValidationError)

        expect(() =>
          UserRegistered.create({
            userId: buildEntityId("user-1"),
            name: "Maria Silva",
            email: "maria@example.com",
            firstName: "   ",
            lastName: "Silva",
            maskedCpf: "123.***.***-09",
          })
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when lastName is missing or blank", () => {
        expect(() =>
          UserRegistered.create({
            userId: buildEntityId("user-1"),
            name: "Maria Silva",
            email: "maria@example.com",
            firstName: "Maria",
            maskedCpf: "123.***.***-09",
          } as Parameters<typeof UserRegistered.create>[0])
        ).toThrow(ValidationError)

        expect(() =>
          UserRegistered.create({
            userId: buildEntityId("user-1"),
            name: "Maria Silva",
            email: "maria@example.com",
            firstName: "Maria",
            lastName: "   ",
            maskedCpf: "123.***.***-09",
          })
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when maskedCpf is missing", () => {
        expect(() =>
          UserRegistered.create({
            userId: buildEntityId("user-1"),
            name: "Maria Silva",
            email: "maria@example.com",
            firstName: "Maria",
            lastName: "Silva",
          } as Parameters<typeof UserRegistered.create>[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when the role is not a valid UserRole", () => {
        expect(() =>
          UserRegistered.create({
            userId: buildEntityId("user-1"),
            name: "Maria Silva",
            email: "maria@example.com",
            firstName: "Maria",
            lastName: "Silva",
            maskedCpf: "123.***.***-09",
            role: "ADMIN" as UserRole,
          })
        ).toThrow(ValidationError)
      })
    })

    describe("equals", () => {
      it("should return true when comparing the same instance", () => {
        const event = UserRegistered.create({
          userId: buildEntityId("user-1"),
          name: "Maria Silva",
          email: "maria@example.com",
          firstName: "Maria",
          lastName: "Silva",
          maskedCpf: "123.***.***-09",
        })

        expect(event.equals(event)).toBe(true)
      })

      it("should return true for different instances with the same id", () => {
        const first = UserRegistered.create(
          {
            userId: buildEntityId("user-1"),
            name: "Maria Silva",
            email: "maria@example.com",
            firstName: "Maria",
            lastName: "Silva",
            maskedCpf: "123.***.***-09",
          },
          "event-shared-id"
        )

        const second = UserRegistered.create(
          {
            userId: buildEntityId("user-1"),
            name: "Maria Silva",
            email: "maria@example.com",
            firstName: "Maria",
            lastName: "Silva",
            maskedCpf: "123.***.***-09",
          },
          "event-shared-id"
        )

        expect(first.equals(second)).toBe(true)
      })

      it("should return false when the ids differ", () => {
        const first = UserRegistered.create(
          {
            userId: buildEntityId("user-1"),
            name: "Maria Silva",
            email: "maria@example.com",
            firstName: "Maria",
            lastName: "Silva",
            maskedCpf: "123.***.***-09",
          },
          "event-1"
        )

        const second = UserRegistered.create(
          {
            userId: buildEntityId("user-1"),
            name: "Maria Silva",
            email: "maria@example.com",
            firstName: "Maria",
            lastName: "Silva",
            maskedCpf: "123.***.***-09",
          },
          "event-2"
        )

        expect(first.equals(second)).toBe(false)
      })

      it("should return true when the id matches and a prop differs", () => {
        const first = UserRegistered.create(
          {
            userId: buildEntityId("user-1"),
            name: "Maria Silva",
            email: "maria@example.com",
            firstName: "Maria",
            lastName: "Silva",
            maskedCpf: "123.***.***-09",
          },
          "event-1"
        )

        const second = UserRegistered.create(
          {
            userId: buildEntityId("user-9"),
            name: "João Souza",
            email: "joao@example.com",
            firstName: "João",
            lastName: "Souza",
            maskedCpf: "987.***.***-00",
            role: "MANAGER",
          },
          "event-1"
        )

        expect(first.role).toBe("USER")
        expect(second.role).toBe("MANAGER")
        expect(first.equals(second)).toBe(true)
      })

      it("should return false when this event has no id", () => {
        const first = UserRegistered.create({
          userId: buildEntityId("user-1"),
          name: "Maria Silva",
          email: "maria@example.com",
          firstName: "Maria",
          lastName: "Silva",
          maskedCpf: "123.***.***-09",
        })

        const second = UserRegistered.create(
          {
            userId: buildEntityId("user-1"),
            name: "Maria Silva",
            email: "maria@example.com",
            firstName: "Maria",
            lastName: "Silva",
            maskedCpf: "123.***.***-09",
          },
          "event-1"
        )

        expect(first.equals(second)).toBe(false)
      })

      it("should return false when the other event has no id", () => {
        const first = UserRegistered.create(
          {
            userId: buildEntityId("user-1"),
            name: "Maria Silva",
            email: "maria@example.com",
            firstName: "Maria",
            lastName: "Silva",
            maskedCpf: "123.***.***-09",
          },
          "event-1"
        )

        const second = UserRegistered.create({
          userId: buildEntityId("user-1"),
          name: "Maria Silva",
          email: "maria@example.com",
          firstName: "Maria",
          lastName: "Silva",
          maskedCpf: "123.***.***-09",
        })

        expect(first.equals(second)).toBe(false)
      })

      it("should return false when comparing to null", () => {
        const event = UserRegistered.create({
          userId: buildEntityId("user-1"),
          name: "Maria Silva",
          email: "maria@example.com",
          firstName: "Maria",
          lastName: "Silva",
          maskedCpf: "123.***.***-09",
        })

        expect(event.equals(null)).toBe(false)
      })

      it("should return false when comparing to undefined", () => {
        const event = UserRegistered.create({
          userId: buildEntityId("user-1"),
          name: "Maria Silva",
          email: "maria@example.com",
          firstName: "Maria",
          lastName: "Silva",
          maskedCpf: "123.***.***-09",
        })

        expect(event.equals(undefined)).toBe(false)
      })
    })
  })
})
