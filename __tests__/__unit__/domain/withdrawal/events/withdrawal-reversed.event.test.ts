import { describe, it, expect, afterEach } from "vitest"

import { WithdrawalReversed } from "@/domain/withdrawal/events/withdrawal-reversed.event"
import { ValidationError } from "@/errors"
import { EntityId } from "@/value-objects"
import { buildEntityId } from "__tests__/__setup__/_factories.setup"
import {
  useFixedClock,
  useRealClock,
  getFixedDate,
} from "__tests__/__setup__/_clock.setup"

describe("domain/withdrawal/events/withdrawal-reversed.event", () => {
  afterEach(() => {
    useRealClock()
  })

  describe("WithdrawalReversed", () => {
    describe("create", () => {
      it("should create a valid WithdrawalReversed with required props", () => {
        const withdrawalId = buildEntityId("withdrawal-1")
        const positionId = buildEntityId("position-1")
        const reversedByUserId = buildEntityId("user-1")
        const reversedAt = new Date("2026-02-21T00:00:00.000Z")
        const occurredAt = new Date("2026-02-21T09:00:00.000Z")

        const event = WithdrawalReversed.create({
          withdrawalId,
          positionId,
          reversedAt,
          reversedByUserId,
          occurredAt,
        })

        expect(event.id).toBeUndefined()
        expect(event.withdrawalId).toBe(withdrawalId)
        expect(event.positionId).toBe(positionId)
        expect(event.reversedAt).toEqual(reversedAt)
        expect(event.reversedByUserId).toBe(reversedByUserId)
        expect(event.occurredAt).toEqual(occurredAt)
      })

      it("should create a WithdrawalReversed with provided id", () => {
        const event = WithdrawalReversed.create(
          {
            withdrawalId: buildEntityId("withdrawal-1"),
            positionId: buildEntityId("position-1"),
            reversedAt: new Date("2026-02-21T00:00:00.000Z"),
            reversedByUserId: buildEntityId("user-1"),
          },
          "event-withdrawal-reversed-1"
        )

        expect(event.id).toBe(
          EntityId.create("event-withdrawal-reversed-1")
        )
      })

      it("should leave the id undefined when an empty id is given", () => {
        const event = WithdrawalReversed.create(
          {
            withdrawalId: buildEntityId("withdrawal-1"),
            positionId: buildEntityId("position-1"),
            reversedAt: new Date("2026-02-21T00:00:00.000Z"),
            reversedByUserId: buildEntityId("user-1"),
          },
          ""
        )

        expect(event.id).toBeUndefined()
      })

      it("should default occurredAt to the current time when omitted", () => {
        useFixedClock()

        const event = WithdrawalReversed.create({
          withdrawalId: buildEntityId("withdrawal-1"),
          positionId: buildEntityId("position-1"),
          reversedAt: new Date("2026-02-21T00:00:00.000Z"),
          reversedByUserId: buildEntityId("user-1"),
        })

        expect(event.occurredAt).toEqual(getFixedDate())
      })

      it("should keep the provided occurredAt instead of the current time", () => {
        useFixedClock()

        const occurredAt = new Date("2026-04-01T07:45:00.000Z")

        const event = WithdrawalReversed.create({
          withdrawalId: buildEntityId("withdrawal-1"),
          positionId: buildEntityId("position-1"),
          reversedAt: new Date("2026-02-21T00:00:00.000Z"),
          reversedByUserId: buildEntityId("user-1"),
          occurredAt,
        })

        expect(event.occurredAt).toEqual(occurredAt)
        expect(event.occurredAt).not.toEqual(getFixedDate())
      })

      it("should copy the reversedAt prop so later mutations do not leak", () => {
        const reversedAt = new Date("2026-02-21T00:00:00.000Z")

        const event = WithdrawalReversed.create({
          withdrawalId: buildEntityId("withdrawal-1"),
          positionId: buildEntityId("position-1"),
          reversedAt,
          reversedByUserId: buildEntityId("user-1"),
        })

        reversedAt.setUTCFullYear(2030)

        expect(event.reversedAt).toEqual(
          new Date("2026-02-21T00:00:00.000Z")
        )
      })

      it("should return a new date instance on every reversedAt read", () => {
        const event = WithdrawalReversed.create({
          withdrawalId: buildEntityId("withdrawal-1"),
          positionId: buildEntityId("position-1"),
          reversedAt: new Date("2026-02-21T00:00:00.000Z"),
          reversedByUserId: buildEntityId("user-1"),
        })

        expect(event.reversedAt).not.toBe(event.reversedAt)
        expect(event.occurredAt).not.toBe(event.occurredAt)
      })

      it("should throw ValidationError when withdrawalId is missing", () => {
        expect(() =>
          WithdrawalReversed.create({
            positionId: buildEntityId("position-1"),
            reversedAt: new Date("2026-02-21T00:00:00.000Z"),
            reversedByUserId: buildEntityId("user-1"),
          } as Parameters<typeof WithdrawalReversed.create>[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when positionId is missing", () => {
        expect(() =>
          WithdrawalReversed.create({
            withdrawalId: buildEntityId("withdrawal-1"),
            reversedAt: new Date("2026-02-21T00:00:00.000Z"),
            reversedByUserId: buildEntityId("user-1"),
          } as Parameters<typeof WithdrawalReversed.create>[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when reversedAt is missing", () => {
        expect(() =>
          WithdrawalReversed.create({
            withdrawalId: buildEntityId("withdrawal-1"),
            positionId: buildEntityId("position-1"),
            reversedByUserId: buildEntityId("user-1"),
          } as Parameters<typeof WithdrawalReversed.create>[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when reversedByUserId is missing", () => {
        expect(() =>
          WithdrawalReversed.create({
            withdrawalId: buildEntityId("withdrawal-1"),
            positionId: buildEntityId("position-1"),
            reversedAt: new Date("2026-02-21T00:00:00.000Z"),
          } as Parameters<typeof WithdrawalReversed.create>[0])
        ).toThrow(ValidationError)
      })
    })

    describe("equals", () => {
      it("should return true when comparing the same instance", () => {
        const event = WithdrawalReversed.create({
          withdrawalId: buildEntityId("withdrawal-1"),
          positionId: buildEntityId("position-1"),
          reversedAt: new Date("2026-02-21T00:00:00.000Z"),
          reversedByUserId: buildEntityId("user-1"),
        })

        expect(event.equals(event)).toBe(true)
      })

      it("should return true for different instances with the same id", () => {
        const first = WithdrawalReversed.create(
          {
            withdrawalId: buildEntityId("withdrawal-1"),
            positionId: buildEntityId("position-1"),
            reversedAt: new Date("2026-02-21T00:00:00.000Z"),
            reversedByUserId: buildEntityId("user-1"),
          },
          "event-shared-id"
        )

        const second = WithdrawalReversed.create(
          {
            withdrawalId: buildEntityId("withdrawal-1"),
            positionId: buildEntityId("position-1"),
            reversedAt: new Date("2026-02-21T00:00:00.000Z"),
            reversedByUserId: buildEntityId("user-1"),
          },
          "event-shared-id"
        )

        expect(first.equals(second)).toBe(true)
      })

      it("should return false when the ids differ", () => {
        const first = WithdrawalReversed.create(
          {
            withdrawalId: buildEntityId("withdrawal-1"),
            positionId: buildEntityId("position-1"),
            reversedAt: new Date("2026-02-21T00:00:00.000Z"),
            reversedByUserId: buildEntityId("user-1"),
          },
          "event-1"
        )

        const second = WithdrawalReversed.create(
          {
            withdrawalId: buildEntityId("withdrawal-1"),
            positionId: buildEntityId("position-1"),
            reversedAt: new Date("2026-02-21T00:00:00.000Z"),
            reversedByUserId: buildEntityId("user-1"),
          },
          "event-2"
        )

        expect(first.equals(second)).toBe(false)
      })

      it("should return true when the id matches and a prop differs", () => {
        const first = WithdrawalReversed.create(
          {
            withdrawalId: buildEntityId("withdrawal-1"),
            positionId: buildEntityId("position-1"),
            reversedAt: new Date("2026-02-21T00:00:00.000Z"),
            reversedByUserId: buildEntityId("user-1"),
          },
          "event-1"
        )

        const second = WithdrawalReversed.create(
          {
            withdrawalId: buildEntityId("withdrawal-9"),
            positionId: buildEntityId("position-9"),
            reversedAt: new Date("2026-05-20T00:00:00.000Z"),
            reversedByUserId: buildEntityId("user-9"),
          },
          "event-1"
        )

        expect(first.reversedByUserId).toBe(
          EntityId.create("user-1")
        )
        expect(second.reversedByUserId).toBe(
          EntityId.create("user-9")
        )
        expect(first.equals(second)).toBe(true)
      })

      it("should return false when this event has no id", () => {
        const first = WithdrawalReversed.create({
          withdrawalId: buildEntityId("withdrawal-1"),
          positionId: buildEntityId("position-1"),
          reversedAt: new Date("2026-02-21T00:00:00.000Z"),
          reversedByUserId: buildEntityId("user-1"),
        })

        const second = WithdrawalReversed.create(
          {
            withdrawalId: buildEntityId("withdrawal-1"),
            positionId: buildEntityId("position-1"),
            reversedAt: new Date("2026-02-21T00:00:00.000Z"),
            reversedByUserId: buildEntityId("user-1"),
          },
          "event-1"
        )

        expect(first.equals(second)).toBe(false)
      })

      it("should return false when the other event has no id", () => {
        const first = WithdrawalReversed.create(
          {
            withdrawalId: buildEntityId("withdrawal-1"),
            positionId: buildEntityId("position-1"),
            reversedAt: new Date("2026-02-21T00:00:00.000Z"),
            reversedByUserId: buildEntityId("user-1"),
          },
          "event-1"
        )

        const second = WithdrawalReversed.create({
          withdrawalId: buildEntityId("withdrawal-1"),
          positionId: buildEntityId("position-1"),
          reversedAt: new Date("2026-02-21T00:00:00.000Z"),
          reversedByUserId: buildEntityId("user-1"),
        })

        expect(first.equals(second)).toBe(false)
      })

      it("should return false when comparing to null", () => {
        const event = WithdrawalReversed.create({
          withdrawalId: buildEntityId("withdrawal-1"),
          positionId: buildEntityId("position-1"),
          reversedAt: new Date("2026-02-21T00:00:00.000Z"),
          reversedByUserId: buildEntityId("user-1"),
        })

        expect(event.equals(null)).toBe(false)
      })

      it("should return false when comparing to undefined", () => {
        const event = WithdrawalReversed.create({
          withdrawalId: buildEntityId("withdrawal-1"),
          positionId: buildEntityId("position-1"),
          reversedAt: new Date("2026-02-21T00:00:00.000Z"),
          reversedByUserId: buildEntityId("user-1"),
        })

        expect(event.equals(undefined)).toBe(false)
      })
    })
  })
})
