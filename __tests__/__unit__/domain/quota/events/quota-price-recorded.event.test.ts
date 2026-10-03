import { describe, it, expect, afterEach } from "vitest"

import { QuotaPriceRecorded } from "@/domain/quota/events/quota-price-recorded.event"
import { ValidationError } from "@/errors"
import { EntityId } from "@/value-objects"
import {
  buildEntityId,
  buildQuotaPrice,
} from "__tests__/__setup__/_factories.setup"
import {
  useFixedClock,
  useRealClock,
  getFixedDate,
} from "__tests__/__setup__/_clock.setup"

describe("domain/quota/events/quota-price-recorded.event", () => {
  afterEach(() => {
    useRealClock()
  })

  describe("QuotaPriceRecorded", () => {
    describe("create", () => {
      it("should create a valid QuotaPriceRecorded with required props", () => {
        const quotaId = buildEntityId("quota-1")
        const fundId = buildEntityId("fund-1")
        const date = new Date("2026-01-10T00:00:00.000Z")
        const occurredAt = new Date("2026-01-10T21:00:00.000Z")

        const event = QuotaPriceRecorded.create({
          quotaId,
          fundId,
          date,
          price: buildQuotaPrice("4.50"),
          occurredAt,
        })

        expect(event.id).toBeUndefined()
        expect(event.quotaId).toBe(quotaId)
        expect(event.fundId).toBe(fundId)
        expect(event.date).toEqual(date)
        expect(event.price.value.toFixed(2)).toBe("4.50")
        expect(event.occurredAt).toEqual(occurredAt)
      })

      it("should create a QuotaPriceRecorded with provided id", () => {
        const event = QuotaPriceRecorded.create(
          {
            quotaId: buildEntityId("quota-1"),
            fundId: buildEntityId("fund-1"),
            date: new Date("2026-01-10T00:00:00.000Z"),
            price: buildQuotaPrice("4.50"),
          },
          "event-quota-price-1"
        )

        expect(event.id).toBe(
          EntityId.create("event-quota-price-1")
        )
      })

      it("should leave the id undefined when an empty id is given", () => {
        const event = QuotaPriceRecorded.create(
          {
            quotaId: buildEntityId("quota-1"),
            fundId: buildEntityId("fund-1"),
            date: new Date("2026-01-10T00:00:00.000Z"),
            price: buildQuotaPrice("4.50"),
          },
          ""
        )

        expect(event.id).toBeUndefined()
      })

      it("should default occurredAt to the current time when omitted", () => {
        useFixedClock()

        const event = QuotaPriceRecorded.create({
          quotaId: buildEntityId("quota-1"),
          fundId: buildEntityId("fund-1"),
          date: new Date("2026-01-10T00:00:00.000Z"),
          price: buildQuotaPrice("4.50"),
        })

        expect(event.occurredAt).toEqual(getFixedDate())
      })

      it("should keep the provided occurredAt instead of the current time", () => {
        useFixedClock()

        const occurredAt = new Date("2026-10-10T10:10:10.000Z")

        const event = QuotaPriceRecorded.create({
          quotaId: buildEntityId("quota-1"),
          fundId: buildEntityId("fund-1"),
          date: new Date("2026-01-10T00:00:00.000Z"),
          price: buildQuotaPrice("4.50"),
          occurredAt,
        })

        expect(event.occurredAt).toEqual(occurredAt)
        expect(event.occurredAt).not.toEqual(getFixedDate())
      })

      it("should copy the date prop so later mutations do not leak", () => {
        const date = new Date("2026-01-10T00:00:00.000Z")

        const event = QuotaPriceRecorded.create({
          quotaId: buildEntityId("quota-1"),
          fundId: buildEntityId("fund-1"),
          date,
          price: buildQuotaPrice("4.50"),
        })

        date.setUTCFullYear(2030)

        expect(event.date).toEqual(
          new Date("2026-01-10T00:00:00.000Z")
        )
      })

      it("should return a new date instance on every date read", () => {
        const event = QuotaPriceRecorded.create({
          quotaId: buildEntityId("quota-1"),
          fundId: buildEntityId("fund-1"),
          date: new Date("2026-01-10T00:00:00.000Z"),
          price: buildQuotaPrice("4.50"),
        })

        expect(event.date).not.toBe(event.date)
        expect(event.occurredAt).not.toBe(event.occurredAt)
      })

      it("should keep the high precision of the price", () => {
        const event = QuotaPriceRecorded.create({
          quotaId: buildEntityId("quota-1"),
          fundId: buildEntityId("fund-1"),
          date: new Date("2026-01-10T00:00:00.000Z"),
          price: buildQuotaPrice("4.123456"),
        })

        expect(event.price.value.toFixed(6)).toBe("4.123456")
      })

      it("should throw ValidationError when quotaId is missing", () => {
        expect(() =>
          QuotaPriceRecorded.create({
            fundId: buildEntityId("fund-1"),
            date: new Date("2026-01-10T00:00:00.000Z"),
            price: buildQuotaPrice("4.50"),
          } as Parameters<typeof QuotaPriceRecorded.create>[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when fundId is missing", () => {
        expect(() =>
          QuotaPriceRecorded.create({
            quotaId: buildEntityId("quota-1"),
            date: new Date("2026-01-10T00:00:00.000Z"),
            price: buildQuotaPrice("4.50"),
          } as Parameters<typeof QuotaPriceRecorded.create>[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when date is missing", () => {
        expect(() =>
          QuotaPriceRecorded.create({
            quotaId: buildEntityId("quota-1"),
            fundId: buildEntityId("fund-1"),
            price: buildQuotaPrice("4.50"),
          } as Parameters<typeof QuotaPriceRecorded.create>[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when price is missing", () => {
        expect(() =>
          QuotaPriceRecorded.create({
            quotaId: buildEntityId("quota-1"),
            fundId: buildEntityId("fund-1"),
            date: new Date("2026-01-10T00:00:00.000Z"),
          } as Parameters<typeof QuotaPriceRecorded.create>[0])
        ).toThrow(ValidationError)
      })
    })

    describe("equals", () => {
      it("should return true when comparing the same instance", () => {
        const event = QuotaPriceRecorded.create({
          quotaId: buildEntityId("quota-1"),
          fundId: buildEntityId("fund-1"),
          date: new Date("2026-01-10T00:00:00.000Z"),
          price: buildQuotaPrice("4.50"),
        })

        expect(event.equals(event)).toBe(true)
      })

      it("should return true for different instances with the same id", () => {
        const first = QuotaPriceRecorded.create(
          {
            quotaId: buildEntityId("quota-1"),
            fundId: buildEntityId("fund-1"),
            date: new Date("2026-01-10T00:00:00.000Z"),
            price: buildQuotaPrice("4.50"),
          },
          "event-shared-id"
        )

        const second = QuotaPriceRecorded.create(
          {
            quotaId: buildEntityId("quota-1"),
            fundId: buildEntityId("fund-1"),
            date: new Date("2026-01-10T00:00:00.000Z"),
            price: buildQuotaPrice("4.50"),
          },
          "event-shared-id"
        )

        expect(first.equals(second)).toBe(true)
      })

      it("should return false when the ids differ", () => {
        const first = QuotaPriceRecorded.create(
          {
            quotaId: buildEntityId("quota-1"),
            fundId: buildEntityId("fund-1"),
            date: new Date("2026-01-10T00:00:00.000Z"),
            price: buildQuotaPrice("4.50"),
          },
          "event-1"
        )

        const second = QuotaPriceRecorded.create(
          {
            quotaId: buildEntityId("quota-1"),
            fundId: buildEntityId("fund-1"),
            date: new Date("2026-01-10T00:00:00.000Z"),
            price: buildQuotaPrice("4.50"),
          },
          "event-2"
        )

        expect(first.equals(second)).toBe(false)
      })

      it("should return true when the id matches and a prop differs", () => {
        const first = QuotaPriceRecorded.create(
          {
            quotaId: buildEntityId("quota-1"),
            fundId: buildEntityId("fund-1"),
            date: new Date("2026-01-10T00:00:00.000Z"),
            price: buildQuotaPrice("4.50"),
          },
          "event-1"
        )

        const second = QuotaPriceRecorded.create(
          {
            quotaId: buildEntityId("quota-6"),
            fundId: buildEntityId("fund-6"),
            date: new Date("2026-02-10T00:00:00.000Z"),
            price: buildQuotaPrice("9.99"),
          },
          "event-1"
        )

        expect(first.price.value.toFixed(2)).toBe("4.50")
        expect(second.price.value.toFixed(2)).toBe("9.99")
        expect(first.equals(second)).toBe(true)
      })

      it("should return false when this event has no id", () => {
        const first = QuotaPriceRecorded.create({
          quotaId: buildEntityId("quota-1"),
          fundId: buildEntityId("fund-1"),
          date: new Date("2026-01-10T00:00:00.000Z"),
          price: buildQuotaPrice("4.50"),
        })

        const second = QuotaPriceRecorded.create(
          {
            quotaId: buildEntityId("quota-1"),
            fundId: buildEntityId("fund-1"),
            date: new Date("2026-01-10T00:00:00.000Z"),
            price: buildQuotaPrice("4.50"),
          },
          "event-1"
        )

        expect(first.equals(second)).toBe(false)
      })

      it("should return false when the other event has no id", () => {
        const first = QuotaPriceRecorded.create(
          {
            quotaId: buildEntityId("quota-1"),
            fundId: buildEntityId("fund-1"),
            date: new Date("2026-01-10T00:00:00.000Z"),
            price: buildQuotaPrice("4.50"),
          },
          "event-1"
        )

        const second = QuotaPriceRecorded.create({
          quotaId: buildEntityId("quota-1"),
          fundId: buildEntityId("fund-1"),
          date: new Date("2026-01-10T00:00:00.000Z"),
          price: buildQuotaPrice("4.50"),
        })

        expect(first.equals(second)).toBe(false)
      })

      it("should return false when comparing to null", () => {
        const event = QuotaPriceRecorded.create({
          quotaId: buildEntityId("quota-1"),
          fundId: buildEntityId("fund-1"),
          date: new Date("2026-01-10T00:00:00.000Z"),
          price: buildQuotaPrice("4.50"),
        })

        expect(event.equals(null)).toBe(false)
      })

      it("should return false when comparing to undefined", () => {
        const event = QuotaPriceRecorded.create({
          quotaId: buildEntityId("quota-1"),
          fundId: buildEntityId("fund-1"),
          date: new Date("2026-01-10T00:00:00.000Z"),
          price: buildQuotaPrice("4.50"),
        })

        expect(event.equals(undefined)).toBe(false)
      })
    })
  })
})
