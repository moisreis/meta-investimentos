import { describe, it, expect, afterEach } from "vitest"

import { ApplicationRecorded } from "@/domain/application/events/application-recorded.event"
import { ValidationError } from "@/errors"
import { EntityId } from "@/value-objects"
import {
  buildEntityId,
  buildPositiveMoney,
  buildQuotaQuantity,
} from "__tests__/__setup__/_factories.setup"
import {
  useFixedClock,
  useRealClock,
  getFixedDate,
} from "__tests__/__setup__/_clock.setup"

describe("domain/application/events/application-recorded.event", () => {
  afterEach(() => {
    useRealClock()
  })

  describe("ApplicationRecorded", () => {
    describe("create", () => {
      it("should create a valid ApplicationRecorded with required props", () => {
        const applicationId = buildEntityId("application-1")
        const positionId = buildEntityId("position-1")
        const fundId = buildEntityId("fund-1")
        const date = new Date("2026-01-10T00:00:00.000Z")
        const occurredAt = new Date("2026-01-10T10:00:00.000Z")

        const event = ApplicationRecorded.create({
          applicationId,
          positionId,
          fundId,
          date,
          amount: buildPositiveMoney("1000.00"),
          quotas: buildQuotaQuantity("80.00"),
          occurredAt,
        })

        expect(event.id).toBeUndefined()
        expect(event.applicationId).toBe(applicationId)
        expect(event.positionId).toBe(positionId)
        expect(event.fundId).toBe(fundId)
        expect(event.date).toEqual(date)
        expect(event.amount.value.toFixed(2)).toBe("1000.00")
        expect(event.quotas.value.toFixed(2)).toBe("80.00")
        expect(event.occurredAt).toEqual(occurredAt)
      })

      it("should create an ApplicationRecorded with provided id", () => {
        const event = ApplicationRecorded.create(
          {
            applicationId: buildEntityId("application-1"),
            positionId: buildEntityId("position-1"),
            fundId: buildEntityId("fund-1"),
            date: new Date("2026-01-10T00:00:00.000Z"),
            amount: buildPositiveMoney("1000.00"),
            quotas: buildQuotaQuantity("80.00"),
          },
          "event-application-recorded-1"
        )

        expect(event.id).toBe(
          EntityId.create("event-application-recorded-1")
        )
      })

      it("should leave the id undefined when an empty id is given", () => {
        const event = ApplicationRecorded.create(
          {
            applicationId: buildEntityId("application-1"),
            positionId: buildEntityId("position-1"),
            fundId: buildEntityId("fund-1"),
            date: new Date("2026-01-10T00:00:00.000Z"),
            amount: buildPositiveMoney("1000.00"),
            quotas: buildQuotaQuantity("80.00"),
          },
          ""
        )

        expect(event.id).toBeUndefined()
      })

      it("should default occurredAt to the current time when omitted", () => {
        useFixedClock()

        const event = ApplicationRecorded.create({
          applicationId: buildEntityId("application-1"),
          positionId: buildEntityId("position-1"),
          fundId: buildEntityId("fund-1"),
          date: new Date("2026-01-10T00:00:00.000Z"),
          amount: buildPositiveMoney("1000.00"),
          quotas: buildQuotaQuantity("80.00"),
        })

        expect(event.occurredAt).toEqual(getFixedDate())
      })

      it("should keep the provided occurredAt instead of the current time", () => {
        useFixedClock()

        const occurredAt = new Date("2026-03-20T08:30:00.000Z")

        const event = ApplicationRecorded.create({
          applicationId: buildEntityId("application-1"),
          positionId: buildEntityId("position-1"),
          fundId: buildEntityId("fund-1"),
          date: new Date("2026-01-10T00:00:00.000Z"),
          amount: buildPositiveMoney("1000.00"),
          quotas: buildQuotaQuantity("80.00"),
          occurredAt,
        })

        expect(event.occurredAt).toEqual(occurredAt)
        expect(event.occurredAt).not.toEqual(getFixedDate())
      })

      it("should copy the date prop so later mutations do not leak", () => {
        const date = new Date("2026-01-10T00:00:00.000Z")

        const event = ApplicationRecorded.create({
          applicationId: buildEntityId("application-1"),
          positionId: buildEntityId("position-1"),
          fundId: buildEntityId("fund-1"),
          date,
          amount: buildPositiveMoney("1000.00"),
          quotas: buildQuotaQuantity("80.00"),
        })

        date.setUTCFullYear(2030)

        expect(event.date).toEqual(
          new Date("2026-01-10T00:00:00.000Z")
        )
      })

      it("should return a new date instance on every date read", () => {
        const event = ApplicationRecorded.create({
          applicationId: buildEntityId("application-1"),
          positionId: buildEntityId("position-1"),
          fundId: buildEntityId("fund-1"),
          date: new Date("2026-01-10T00:00:00.000Z"),
          amount: buildPositiveMoney("1000.00"),
          quotas: buildQuotaQuantity("80.00"),
        })

        expect(event.date).not.toBe(event.date)
        expect(event.occurredAt).not.toBe(event.occurredAt)
      })

      it("should throw ValidationError when applicationId is missing", () => {
        expect(() =>
          ApplicationRecorded.create({
            positionId: buildEntityId("position-1"),
            fundId: buildEntityId("fund-1"),
            date: new Date("2026-01-10T00:00:00.000Z"),
            amount: buildPositiveMoney("1000.00"),
            quotas: buildQuotaQuantity("80.00"),
          } as Parameters<typeof ApplicationRecorded.create>[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when positionId is missing", () => {
        expect(() =>
          ApplicationRecorded.create({
            applicationId: buildEntityId("application-1"),
            fundId: buildEntityId("fund-1"),
            date: new Date("2026-01-10T00:00:00.000Z"),
            amount: buildPositiveMoney("1000.00"),
            quotas: buildQuotaQuantity("80.00"),
          } as Parameters<typeof ApplicationRecorded.create>[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when fundId is missing", () => {
        expect(() =>
          ApplicationRecorded.create({
            applicationId: buildEntityId("application-1"),
            positionId: buildEntityId("position-1"),
            date: new Date("2026-01-10T00:00:00.000Z"),
            amount: buildPositiveMoney("1000.00"),
            quotas: buildQuotaQuantity("80.00"),
          } as Parameters<typeof ApplicationRecorded.create>[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when date is missing", () => {
        expect(() =>
          ApplicationRecorded.create({
            applicationId: buildEntityId("application-1"),
            positionId: buildEntityId("position-1"),
            fundId: buildEntityId("fund-1"),
            amount: buildPositiveMoney("1000.00"),
            quotas: buildQuotaQuantity("80.00"),
          } as Parameters<typeof ApplicationRecorded.create>[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when amount is missing", () => {
        expect(() =>
          ApplicationRecorded.create({
            applicationId: buildEntityId("application-1"),
            positionId: buildEntityId("position-1"),
            fundId: buildEntityId("fund-1"),
            date: new Date("2026-01-10T00:00:00.000Z"),
            quotas: buildQuotaQuantity("80.00"),
          } as Parameters<typeof ApplicationRecorded.create>[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when quotas is missing", () => {
        expect(() =>
          ApplicationRecorded.create({
            applicationId: buildEntityId("application-1"),
            positionId: buildEntityId("position-1"),
            fundId: buildEntityId("fund-1"),
            date: new Date("2026-01-10T00:00:00.000Z"),
            amount: buildPositiveMoney("1000.00"),
          } as Parameters<typeof ApplicationRecorded.create>[0])
        ).toThrow(ValidationError)
      })
    })

    describe("equals", () => {
      it("should return true when comparing the same instance", () => {
        const event = ApplicationRecorded.create({
          applicationId: buildEntityId("application-1"),
          positionId: buildEntityId("position-1"),
          fundId: buildEntityId("fund-1"),
          date: new Date("2026-01-10T00:00:00.000Z"),
          amount: buildPositiveMoney("1000.00"),
          quotas: buildQuotaQuantity("80.00"),
        })

        expect(event.equals(event)).toBe(true)
      })

      it("should return true for different instances with the same id", () => {
        const first = ApplicationRecorded.create(
          {
            applicationId: buildEntityId("application-1"),
            positionId: buildEntityId("position-1"),
            fundId: buildEntityId("fund-1"),
            date: new Date("2026-01-10T00:00:00.000Z"),
            amount: buildPositiveMoney("1000.00"),
            quotas: buildQuotaQuantity("80.00"),
          },
          "event-shared-id"
        )

        const second = ApplicationRecorded.create(
          {
            applicationId: buildEntityId("application-1"),
            positionId: buildEntityId("position-1"),
            fundId: buildEntityId("fund-1"),
            date: new Date("2026-01-10T00:00:00.000Z"),
            amount: buildPositiveMoney("1000.00"),
            quotas: buildQuotaQuantity("80.00"),
          },
          "event-shared-id"
        )

        expect(first.equals(second)).toBe(true)
      })

      it("should return false when the ids differ", () => {
        const first = ApplicationRecorded.create(
          {
            applicationId: buildEntityId("application-1"),
            positionId: buildEntityId("position-1"),
            fundId: buildEntityId("fund-1"),
            date: new Date("2026-01-10T00:00:00.000Z"),
            amount: buildPositiveMoney("1000.00"),
            quotas: buildQuotaQuantity("80.00"),
          },
          "event-1"
        )

        const second = ApplicationRecorded.create(
          {
            applicationId: buildEntityId("application-1"),
            positionId: buildEntityId("position-1"),
            fundId: buildEntityId("fund-1"),
            date: new Date("2026-01-10T00:00:00.000Z"),
            amount: buildPositiveMoney("1000.00"),
            quotas: buildQuotaQuantity("80.00"),
          },
          "event-2"
        )

        expect(first.equals(second)).toBe(false)
      })

      it("should return true when the id matches and a prop differs", () => {
        const first = ApplicationRecorded.create(
          {
            applicationId: buildEntityId("application-1"),
            positionId: buildEntityId("position-1"),
            fundId: buildEntityId("fund-1"),
            date: new Date("2026-01-10T00:00:00.000Z"),
            amount: buildPositiveMoney("1000.00"),
            quotas: buildQuotaQuantity("80.00"),
          },
          "event-1"
        )

        const second = ApplicationRecorded.create(
          {
            applicationId: buildEntityId("application-2"),
            positionId: buildEntityId("position-2"),
            fundId: buildEntityId("fund-2"),
            date: new Date("2026-02-10T00:00:00.000Z"),
            amount: buildPositiveMoney("2500.00"),
            quotas: buildQuotaQuantity("10.00"),
          },
          "event-1"
        )

        expect(first.amount.value.toFixed(2)).toBe("1000.00")
        expect(second.amount.value.toFixed(2)).toBe("2500.00")
        expect(first.equals(second)).toBe(true)
      })

      it("should return false when this event has no id", () => {
        const first = ApplicationRecorded.create({
          applicationId: buildEntityId("application-1"),
          positionId: buildEntityId("position-1"),
          fundId: buildEntityId("fund-1"),
          date: new Date("2026-01-10T00:00:00.000Z"),
          amount: buildPositiveMoney("1000.00"),
          quotas: buildQuotaQuantity("80.00"),
        })

        const second = ApplicationRecorded.create(
          {
            applicationId: buildEntityId("application-1"),
            positionId: buildEntityId("position-1"),
            fundId: buildEntityId("fund-1"),
            date: new Date("2026-01-10T00:00:00.000Z"),
            amount: buildPositiveMoney("1000.00"),
            quotas: buildQuotaQuantity("80.00"),
          },
          "event-1"
        )

        expect(first.equals(second)).toBe(false)
      })

      it("should return false when the other event has no id", () => {
        const first = ApplicationRecorded.create(
          {
            applicationId: buildEntityId("application-1"),
            positionId: buildEntityId("position-1"),
            fundId: buildEntityId("fund-1"),
            date: new Date("2026-01-10T00:00:00.000Z"),
            amount: buildPositiveMoney("1000.00"),
            quotas: buildQuotaQuantity("80.00"),
          },
          "event-1"
        )

        const second = ApplicationRecorded.create({
          applicationId: buildEntityId("application-1"),
          positionId: buildEntityId("position-1"),
          fundId: buildEntityId("fund-1"),
          date: new Date("2026-01-10T00:00:00.000Z"),
          amount: buildPositiveMoney("1000.00"),
          quotas: buildQuotaQuantity("80.00"),
        })

        expect(first.equals(second)).toBe(false)
      })

      it("should return false when comparing to null", () => {
        const event = ApplicationRecorded.create({
          applicationId: buildEntityId("application-1"),
          positionId: buildEntityId("position-1"),
          fundId: buildEntityId("fund-1"),
          date: new Date("2026-01-10T00:00:00.000Z"),
          amount: buildPositiveMoney("1000.00"),
          quotas: buildQuotaQuantity("80.00"),
        })

        expect(event.equals(null)).toBe(false)
      })

      it("should return false when comparing to undefined", () => {
        const event = ApplicationRecorded.create({
          applicationId: buildEntityId("application-1"),
          positionId: buildEntityId("position-1"),
          fundId: buildEntityId("fund-1"),
          date: new Date("2026-01-10T00:00:00.000Z"),
          amount: buildPositiveMoney("1000.00"),
          quotas: buildQuotaQuantity("80.00"),
        })

        expect(event.equals(undefined)).toBe(false)
      })
    })
  })
})
