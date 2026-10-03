import { describe, it, expect, afterEach } from "vitest"

import { TransactionAllocated } from "@/domain/transaction-allocation/events/transaction-allocated.event"
import { ValidationError } from "@/errors"
import { EntityId } from "@/value-objects"
import {
  buildEntityId,
  buildQuotaQuantity,
} from "__tests__/__setup__/_factories.setup"
import {
  useFixedClock,
  useRealClock,
  getFixedDate,
} from "__tests__/__setup__/_clock.setup"

describe("domain/transaction-allocation/events/transaction-allocated.event", () => {
  afterEach(() => {
    useRealClock()
  })

  describe("TransactionAllocated", () => {
    describe("create", () => {
      it("should create a valid TransactionAllocated with required props", () => {
        const allocationId = buildEntityId("allocation-1")
        const applicationId = buildEntityId("application-1")
        const withdrawId = buildEntityId("withdrawal-1")
        const occurredAt = new Date("2026-03-05T15:00:00.000Z")

        const event = TransactionAllocated.create({
          allocationId,
          applicationId,
          withdrawId,
          quotasConsumed: buildQuotaQuantity("6.123456"),
          occurredAt,
        })

        expect(event.id).toBeUndefined()
        expect(event.allocationId).toBe(allocationId)
        expect(event.applicationId).toBe(applicationId)
        expect(event.withdrawId).toBe(withdrawId)
        expect(event.quotasConsumed.value.toFixed(6)).toBe(
          "6.123456"
        )
        expect(event.occurredAt).toEqual(occurredAt)
      })

      it("should create a TransactionAllocated with provided id", () => {
        const event = TransactionAllocated.create(
          {
            allocationId: buildEntityId("allocation-1"),
            applicationId: buildEntityId("application-1"),
            withdrawId: buildEntityId("withdrawal-1"),
            quotasConsumed: buildQuotaQuantity("6.123456"),
          },
          "event-transaction-allocated-1"
        )

        expect(event.id).toBe(
          EntityId.create("event-transaction-allocated-1")
        )
      })

      it("should leave the id undefined when an empty id is given", () => {
        const event = TransactionAllocated.create(
          {
            allocationId: buildEntityId("allocation-1"),
            applicationId: buildEntityId("application-1"),
            withdrawId: buildEntityId("withdrawal-1"),
            quotasConsumed: buildQuotaQuantity("6.123456"),
          },
          ""
        )

        expect(event.id).toBeUndefined()
      })

      it("should default occurredAt to the current time when omitted", () => {
        useFixedClock()

        const event = TransactionAllocated.create({
          allocationId: buildEntityId("allocation-1"),
          applicationId: buildEntityId("application-1"),
          withdrawId: buildEntityId("withdrawal-1"),
          quotasConsumed: buildQuotaQuantity("6.123456"),
        })

        expect(event.occurredAt).toEqual(getFixedDate())
      })

      it("should keep the provided occurredAt instead of the current time", () => {
        useFixedClock()

        const occurredAt = new Date("2026-12-12T12:12:12.000Z")

        const event = TransactionAllocated.create({
          allocationId: buildEntityId("allocation-1"),
          applicationId: buildEntityId("application-1"),
          withdrawId: buildEntityId("withdrawal-1"),
          quotasConsumed: buildQuotaQuantity("6.123456"),
          occurredAt,
        })

        expect(event.occurredAt).toEqual(occurredAt)
        expect(event.occurredAt).not.toEqual(getFixedDate())
      })

      it("should return a new date instance on every occurredAt read", () => {
        const event = TransactionAllocated.create({
          allocationId: buildEntityId("allocation-1"),
          applicationId: buildEntityId("application-1"),
          withdrawId: buildEntityId("withdrawal-1"),
          quotasConsumed: buildQuotaQuantity("6.123456"),
        })

        expect(event.occurredAt).not.toBe(event.occurredAt)
      })

      it("should throw ValidationError when allocationId is missing", () => {
        expect(() =>
          TransactionAllocated.create({
            applicationId: buildEntityId("application-1"),
            withdrawId: buildEntityId("withdrawal-1"),
            quotasConsumed: buildQuotaQuantity("6.123456"),
          } as Parameters<typeof TransactionAllocated.create>[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when applicationId is missing", () => {
        expect(() =>
          TransactionAllocated.create({
            allocationId: buildEntityId("allocation-1"),
            withdrawId: buildEntityId("withdrawal-1"),
            quotasConsumed: buildQuotaQuantity("6.123456"),
          } as Parameters<typeof TransactionAllocated.create>[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when withdrawId is missing", () => {
        expect(() =>
          TransactionAllocated.create({
            allocationId: buildEntityId("allocation-1"),
            applicationId: buildEntityId("application-1"),
            quotasConsumed: buildQuotaQuantity("6.123456"),
          } as Parameters<typeof TransactionAllocated.create>[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when quotasConsumed is missing", () => {
        expect(() =>
          TransactionAllocated.create({
            allocationId: buildEntityId("allocation-1"),
            applicationId: buildEntityId("application-1"),
            withdrawId: buildEntityId("withdrawal-1"),
          } as Parameters<typeof TransactionAllocated.create>[0])
        ).toThrow(ValidationError)
      })
    })

    describe("equals", () => {
      it("should return true when comparing the same instance", () => {
        const event = TransactionAllocated.create({
          allocationId: buildEntityId("allocation-1"),
          applicationId: buildEntityId("application-1"),
          withdrawId: buildEntityId("withdrawal-1"),
          quotasConsumed: buildQuotaQuantity("6.123456"),
        })

        expect(event.equals(event)).toBe(true)
      })

      it("should return true for different instances with the same id", () => {
        const first = TransactionAllocated.create(
          {
            allocationId: buildEntityId("allocation-1"),
            applicationId: buildEntityId("application-1"),
            withdrawId: buildEntityId("withdrawal-1"),
            quotasConsumed: buildQuotaQuantity("6.123456"),
          },
          "event-shared-id"
        )

        const second = TransactionAllocated.create(
          {
            allocationId: buildEntityId("allocation-1"),
            applicationId: buildEntityId("application-1"),
            withdrawId: buildEntityId("withdrawal-1"),
            quotasConsumed: buildQuotaQuantity("6.123456"),
          },
          "event-shared-id"
        )

        expect(first.equals(second)).toBe(true)
      })

      it("should return false when the ids differ", () => {
        const first = TransactionAllocated.create(
          {
            allocationId: buildEntityId("allocation-1"),
            applicationId: buildEntityId("application-1"),
            withdrawId: buildEntityId("withdrawal-1"),
            quotasConsumed: buildQuotaQuantity("6.123456"),
          },
          "event-1"
        )

        const second = TransactionAllocated.create(
          {
            allocationId: buildEntityId("allocation-1"),
            applicationId: buildEntityId("application-1"),
            withdrawId: buildEntityId("withdrawal-1"),
            quotasConsumed: buildQuotaQuantity("6.123456"),
          },
          "event-2"
        )

        expect(first.equals(second)).toBe(false)
      })

      it("should return true when the id matches and a prop differs", () => {
        const first = TransactionAllocated.create(
          {
            allocationId: buildEntityId("allocation-1"),
            applicationId: buildEntityId("application-1"),
            withdrawId: buildEntityId("withdrawal-1"),
            quotasConsumed: buildQuotaQuantity("6.123456"),
          },
          "event-1"
        )

        const second = TransactionAllocated.create(
          {
            allocationId: buildEntityId("allocation-7"),
            applicationId: buildEntityId("application-7"),
            withdrawId: buildEntityId("withdrawal-7"),
            quotasConsumed: buildQuotaQuantity("1.000000"),
          },
          "event-1"
        )

        expect(first.quotasConsumed.value.toFixed(6)).toBe(
          "6.123456"
        )
        expect(second.quotasConsumed.value.toFixed(6)).toBe(
          "1.000000"
        )
        expect(first.equals(second)).toBe(true)
      })

      it("should return false when this event has no id", () => {
        const first = TransactionAllocated.create({
          allocationId: buildEntityId("allocation-1"),
          applicationId: buildEntityId("application-1"),
          withdrawId: buildEntityId("withdrawal-1"),
          quotasConsumed: buildQuotaQuantity("6.123456"),
        })

        const second = TransactionAllocated.create(
          {
            allocationId: buildEntityId("allocation-1"),
            applicationId: buildEntityId("application-1"),
            withdrawId: buildEntityId("withdrawal-1"),
            quotasConsumed: buildQuotaQuantity("6.123456"),
          },
          "event-1"
        )

        expect(first.equals(second)).toBe(false)
      })

      it("should return false when the other event has no id", () => {
        const first = TransactionAllocated.create(
          {
            allocationId: buildEntityId("allocation-1"),
            applicationId: buildEntityId("application-1"),
            withdrawId: buildEntityId("withdrawal-1"),
            quotasConsumed: buildQuotaQuantity("6.123456"),
          },
          "event-1"
        )

        const second = TransactionAllocated.create({
          allocationId: buildEntityId("allocation-1"),
          applicationId: buildEntityId("application-1"),
          withdrawId: buildEntityId("withdrawal-1"),
          quotasConsumed: buildQuotaQuantity("6.123456"),
        })

        expect(first.equals(second)).toBe(false)
      })

      it("should return false when comparing to null", () => {
        const event = TransactionAllocated.create({
          allocationId: buildEntityId("allocation-1"),
          applicationId: buildEntityId("application-1"),
          withdrawId: buildEntityId("withdrawal-1"),
          quotasConsumed: buildQuotaQuantity("6.123456"),
        })

        expect(event.equals(null)).toBe(false)
      })

      it("should return false when comparing to undefined", () => {
        const event = TransactionAllocated.create({
          allocationId: buildEntityId("allocation-1"),
          applicationId: buildEntityId("application-1"),
          withdrawId: buildEntityId("withdrawal-1"),
          quotasConsumed: buildQuotaQuantity("6.123456"),
        })

        expect(event.equals(undefined)).toBe(false)
      })
    })
  })
})
