import { describe, it, expect, afterEach } from "vitest"

import { UserProfileUpdated } from "@/domain/user/events/user-profile-updated.event"
import { ValidationError } from "@/errors"
import { EntityId } from "@/value-objects"
import { buildEntityId } from "__tests__/__setup__/_factories.setup"
import {
  useFixedClock,
  useRealClock,
  getFixedDate,
} from "__tests__/__setup__/_clock.setup"

describe("domain/user/events/user-profile-updated.event", () => {
  afterEach(() => {
    useRealClock()
  })

  describe("UserProfileUpdated", () => {
    describe("create", () => {
      it("should create a valid UserProfileUpdated with the user id only", () => {
        const userId = buildEntityId("user-1")
        const occurredAt = new Date("2026-05-05T12:00:00.000Z")

        const event = UserProfileUpdated.create({
          userId,
          occurredAt,
        })

        expect(event.id).toBeUndefined()
        expect(event.userId).toBe(userId)
        expect(event.name).toBeUndefined()
        expect(event.firstName).toBeUndefined()
        expect(event.lastName).toBeUndefined()
        expect(event.image).toBeUndefined()
        expect(event.occurredAt).toEqual(occurredAt)
      })

      it("should create a UserProfileUpdated with provided id", () => {
        const event = UserProfileUpdated.create(
          { userId: buildEntityId("user-1") },
          "event-user-profile-updated-1"
        )

        expect(event.id).toBe(
          EntityId.create("event-user-profile-updated-1")
        )
      })

      it("should leave the id undefined when an empty id is given", () => {
        const event = UserProfileUpdated.create(
          { userId: buildEntityId("user-1") },
          ""
        )

        expect(event.id).toBeUndefined()
      })

      it("should create a UserProfileUpdated with every optional field changed", () => {
        const event = UserProfileUpdated.create({
          userId: buildEntityId("user-1"),
          name: "Maria Souza",
          firstName: "Maria",
          lastName: "Souza",
          image: "https://cdn.test/avatar.png",
        })

        expect(event.name).toBe("Maria Souza")
        expect(event.firstName).toBe("Maria")
        expect(event.lastName).toBe("Souza")
        expect(event.image).toBe("https://cdn.test/avatar.png")
      })

      it("should carry only the fields that changed", () => {
        const event = UserProfileUpdated.create({
          userId: buildEntityId("user-1"),
          lastName: "Souza",
        })

        expect(event.lastName).toBe("Souza")
        expect(event.name).toBeUndefined()
        expect(event.firstName).toBeUndefined()
        expect(event.image).toBeUndefined()
      })

      it("should keep null for the image when cleared", () => {
        const event = UserProfileUpdated.create({
          userId: buildEntityId("user-1"),
          image: null,
        })

        expect(event.image).toBeNull()
      })

      it("should keep explicitly undefined optional fields", () => {
        const event = UserProfileUpdated.create({
          userId: buildEntityId("user-1"),
          name: undefined,
          firstName: undefined,
          lastName: undefined,
          image: undefined,
        })

        expect(event.name).toBeUndefined()
        expect(event.firstName).toBeUndefined()
        expect(event.lastName).toBeUndefined()
        expect(event.image).toBeUndefined()
      })

      it("should default occurredAt to the current time when omitted", () => {
        useFixedClock()

        const event = UserProfileUpdated.create({
          userId: buildEntityId("user-1"),
        })

        expect(event.occurredAt).toEqual(getFixedDate())
      })

      it("should keep the provided occurredAt instead of the current time", () => {
        useFixedClock()

        const occurredAt = new Date("2026-06-30T23:00:00.000Z")

        const event = UserProfileUpdated.create({
          userId: buildEntityId("user-1"),
          occurredAt,
        })

        expect(event.occurredAt).toEqual(occurredAt)
        expect(event.occurredAt).not.toEqual(getFixedDate())
      })

      it("should return a new date instance on every occurredAt read", () => {
        const event = UserProfileUpdated.create({
          userId: buildEntityId("user-1"),
        })

        expect(event.occurredAt).not.toBe(event.occurredAt)
      })

      it("should throw ValidationError when userId is missing", () => {
        expect(() =>
          UserProfileUpdated.create({
            name: "Maria Souza",
          } as Parameters<typeof UserProfileUpdated.create>[0])
        ).toThrow(ValidationError)
      })
    })

    describe("equals", () => {
      it("should return true when comparing the same instance", () => {
        const event = UserProfileUpdated.create({
          userId: buildEntityId("user-1"),
        })

        expect(event.equals(event)).toBe(true)
      })

      it("should return true for different instances with the same id", () => {
        const first = UserProfileUpdated.create(
          { userId: buildEntityId("user-1") },
          "event-shared-id"
        )

        const second = UserProfileUpdated.create(
          { userId: buildEntityId("user-1") },
          "event-shared-id"
        )

        expect(first.equals(second)).toBe(true)
      })

      it("should return false when the ids differ", () => {
        const first = UserProfileUpdated.create(
          { userId: buildEntityId("user-1") },
          "event-1"
        )

        const second = UserProfileUpdated.create(
          { userId: buildEntityId("user-1") },
          "event-2"
        )

        expect(first.equals(second)).toBe(false)
      })

      it("should return true when the id matches and a prop differs", () => {
        const first = UserProfileUpdated.create(
          { userId: buildEntityId("user-1") },
          "event-1"
        )

        const second = UserProfileUpdated.create(
          {
            userId: buildEntityId("user-2"),
            name: "Maria Souza",
          },
          "event-1"
        )

        expect(first.name).toBeUndefined()
        expect(second.name).toBe("Maria Souza")
        expect(first.equals(second)).toBe(true)
      })

      it("should return false when this event has no id", () => {
        const first = UserProfileUpdated.create({
          userId: buildEntityId("user-1"),
        })

        const second = UserProfileUpdated.create(
          { userId: buildEntityId("user-1") },
          "event-1"
        )

        expect(first.equals(second)).toBe(false)
      })

      it("should return false when the other event has no id", () => {
        const first = UserProfileUpdated.create(
          { userId: buildEntityId("user-1") },
          "event-1"
        )

        const second = UserProfileUpdated.create({
          userId: buildEntityId("user-1"),
        })

        expect(first.equals(second)).toBe(false)
      })

      it("should return false when comparing to null", () => {
        const event = UserProfileUpdated.create({
          userId: buildEntityId("user-1"),
        })

        expect(event.equals(null)).toBe(false)
      })

      it("should return false when comparing to undefined", () => {
        const event = UserProfileUpdated.create({
          userId: buildEntityId("user-1"),
        })

        expect(event.equals(undefined)).toBe(false)
      })
    })
  })
})
