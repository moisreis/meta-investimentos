import { describe, it, expect, afterEach } from "vitest"

import { WithdrawalRecorded } from "@/domain/withdrawal/events/withdrawal-recorded.event"
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

describe("domain/withdrawal/events/withdrawal-recorded.event", () => {
  afterEach(() => {
    useRealClock()
  })

  describe("WithdrawalRecorded", () => {
    describe("create", () => {
      it("should create a valid WithdrawalRecorded with required props", () => {
        const withdrawalId = buildEntityId("withdrawal-1")
        const positionId = buildEntityId("position-1")
        const fundId = buildEntityId("fund-1")
        const date = new Date("2026-02-20T00:00:00.000Z")
        const occurredAt = new Date("2026-02-20T14:00:00.000Z")

        const event = WithdrawalRecorded.create({
          withdrawalId,
          positionId,
          fundId,
          date,
          amount: buildPositiveMoney("500.00"),
          quotas: buildQuotaQuantity("50.00"),
          occurredAt,
        })

        expect(event.id).toBeUndefined()
        expect(event.withdrawalId).toBe(withdrawalId)
        expect(event.positionId).toBe(positionId)
        expect(event.fundId).toBe(fundId)
        expect(event.date).toEqual(date)
        expect(event.amount.value.toFixed(2)).toBe("500.00")
        expect(event.quotas.value.toFixed(2)).toBe("50.00")
        expect(event.occurredAt).toEqual(occurredAt)
      })

      it("should create a WithdrawalRecorded with provided id", () => {
        const event = WithdrawalRecorded.create(
          {
            withdrawalId: buildEntityId("withdrawal-1"),
            positionId: buildEntityId("position-1"),
            fundId: buildEntityId("fund-1"),
            date: new Date("2026-02-20T00:00:00.000Z"),
            amount: buildPositiveMoney("500.00"),
            quotas: buildQuotaQuantity("50.00"),
          },
          "event-withdrawal-recorded-1"
        )

        expect(event.id).toBe(
          EntityId.create("event-withdrawal-recorded-1")
        )
      })

      it("should leave the id undefined when an empty id is given", () => {
        const event = WithdrawalRecorded.create(
          {
            withdrawalId: buildEntityId("withdrawal-1"),
            positionId: buildEntityId("position-1"),
            fundId: buildEntityId("fund-1"),
            date: new Date("2026-02-20T00:00:00.000Z"),
            amount: buildPositiveMoney("500.00"),
            quotas: buildQuotaQuantity("50.00"),
          },
          ""
        )

        expect(event.id).toBeUndefined()
      })

      it("should default occurredAt to the current time when omitted", () => {
        useFixedClock()

        const event = WithdrawalRecorded.create({
          withdrawalId: buildEntityId("withdrawal-1"),
          positionId: buildEntityId("position-1"),
          fundId: buildEntityId("fund-1"),
          date: new Date("2026-02-20T00:00:00.000Z"),
          amount: buildPositiveMoney("500.00"),
          quotas: buildQuotaQuantity("50.00"),
        })

        expect(event.occurredAt).toEqual(getFixedDate())
      })

      it("should keep the provided occurredAt instead of the current time", () => {
        useFixedClock()

        const occurredAt = new Date("2026-03-31T23:59:59.000Z")

        const event = WithdrawalRecorded.create({
          withdrawalId: buildEntityId("withdrawal-1"),
          positionId: buildEntityId("position-1"),
          fundId: buildEntityId("fund-1"),
          date: new Date("2026-02-20T00:00:00.000Z"),
          amount: buildPositiveMoney("500.00"),
          quotas: buildQuotaQuantity("50.00"),
          occurredAt,
        })

        expect(event.occurredAt).toEqual(occurredAt)
        expect(event.occurredAt).not.toEqual(getFixedDate())
      })

      it("should copy the date prop so later mutations do not leak", () => {
        const date = new Date("2026-02-20T00:00:00.000Z")

        const event = WithdrawalRecorded.create({
          withdrawalId: buildEntityId("withdrawal-1"),
          positionId: buildEntityId("position-1"),
          fundId: buildEntityId("fund-1"),
          date,
          amount: buildPositiveMoney("500.00"),
          quotas: buildQuotaQuantity("50.00"),
        })

        date.setUTCFullYear(2030)

        expect(event.date).toEqual(
          new Date("2026-02-20T00:00:00.000Z")
        )
      })

      it("should return a new date instance on every date read", () => {
        const event = WithdrawalRecorded.create({
          withdrawalId: buildEntityId("withdrawal-1"),
          positionId: buildEntityId("position-1"),
          fundId: buildEntityId("fund-1"),
          date: new Date("2026-02-20T00:00:00.000Z"),
          amount: buildPositiveMoney("500.00"),
          quotas: buildQuotaQuantity("50.00"),
        })

        expect(event.date).not.toBe(event.date)
        expect(event.occurredAt).not.toBe(event.occurredAt)
      })

      it("should throw ValidationError when withdrawalId is missing", () => {
        expect(() =>
          WithdrawalRecorded.create({
            positionId: buildEntityId("position-1"),
            fundId: buildEntityId("fund-1"),
            date: new Date("2026-02-20T00:00:00.000Z"),
            amount: buildPositiveMoney("500.00"),
            quotas: buildQuotaQuantity("50.00"),
          } as Parameters<typeof WithdrawalRecorded.create>[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when positionId is missing", () => {
        expect(() =>
          WithdrawalRecorded.create({
            withdrawalId: buildEntityId("withdrawal-1"),
            fundId: buildEntityId("fund-1"),
            date: new Date("2026-02-20T00:00:00.000Z"),
            amount: buildPositiveMoney("500.00"),
            quotas: buildQuotaQuantity("50.00"),
          } as Parameters<typeof WithdrawalRecorded.create>[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when fundId is missing", () => {
        expect(() =>
          WithdrawalRecorded.create({
            withdrawalId: buildEntityId("withdrawal-1"),
            positionId: buildEntityId("position-1"),
            date: new Date("2026-02-20T00:00:00.000Z"),
            amount: buildPositiveMoney("500.00"),
            quotas: buildQuotaQuantity("50.00"),
          } as Parameters<typeof WithdrawalRecorded.create>[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when date is missing", () => {
        expect(() =>
          WithdrawalRecorded.create({
            withdrawalId: buildEntityId("withdrawal-1"),
            positionId: buildEntityId("position-1"),
            fundId: buildEntityId("fund-1"),
            amount: buildPositiveMoney("500.00"),
            quotas: buildQuotaQuantity("50.00"),
          } as Parameters<typeof WithdrawalRecorded.create>[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when amount is missing", () => {
        expect(() =>
          WithdrawalRecorded.create({
            withdrawalId: buildEntityId("withdrawal-1"),
            positionId: buildEntityId("position-1"),
            fundId: buildEntityId("fund-1"),
            date: new Date("2026-02-20T00:00:00.000Z"),
            quotas: buildQuotaQuantity("50.00"),
          } as Parameters<typeof WithdrawalRecorded.create>[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when quotas is missing", () => {
        expect(() =>
          WithdrawalRecorded.create({
            withdrawalId: buildEntityId("withdrawal-1"),
            positionId: buildEntityId("position-1"),
            fundId: buildEntityId("fund-1"),
            date: new Date("2026-02-20T00:00:00.000Z"),
            amount: buildPositiveMoney("500.00"),
          } as Parameters<typeof WithdrawalRecorded.create>[0])
        ).toThrow(ValidationError)
      })
    })

    describe("equals", () => {
      it("should return true when comparing the same instance", () => {
        const event = WithdrawalRecorded.create({
          withdrawalId: buildEntityId("withdrawal-1"),
          positionId: buildEntityId("position-1"),
          fundId: buildEntityId("fund-1"),
          date: new Date("2026-02-20T00:00:00.000Z"),
          amount: buildPositiveMoney("500.00"),
          quotas: buildQuotaQuantity("50.00"),
        })

        expect(event.equals(event)).toBe(true)
      })

      it("should return true for different instances with the same id", () => {
        const first = WithdrawalRecorded.create(
          {
            withdrawalId: buildEntityId("withdrawal-1"),
            positionId: buildEntityId("position-1"),
            fundId: buildEntityId("fund-1"),
            date: new Date("2026-02-20T00:00:00.000Z"),
            amount: buildPositiveMoney("500.00"),
            quotas: buildQuotaQuantity("50.00"),
          },
          "event-shared-id"
        )

        const second = WithdrawalRecorded.create(
          {
            withdrawalId: buildEntityId("withdrawal-1"),
            positionId: buildEntityId("position-1"),
            fundId: buildEntityId("fund-1"),
            date: new Date("2026-02-20T00:00:00.000Z"),
            amount: buildPositiveMoney("500.00"),
            quotas: buildQuotaQuantity("50.00"),
          },
          "event-shared-id"
        )

        expect(first.equals(second)).toBe(true)
      })

      it("should return false when the ids differ", () => {
        const first = WithdrawalRecorded.create(
          {
            withdrawalId: buildEntityId("withdrawal-1"),
            positionId: buildEntityId("position-1"),
            fundId: buildEntityId("fund-1"),
            date: new Date("2026-02-20T00:00:00.000Z"),
            amount: buildPositiveMoney("500.00"),
            quotas: buildQuotaQuantity("50.00"),
          },
          "event-1"
        )

        const second = WithdrawalRecorded.create(
          {
            withdrawalId: buildEntityId("withdrawal-1"),
            positionId: buildEntityId("position-1"),
            fundId: buildEntityId("fund-1"),
            date: new Date("2026-02-20T00:00:00.000Z"),
            amount: buildPositiveMoney("500.00"),
            quotas: buildQuotaQuantity("50.00"),
          },
          "event-2"
        )

        expect(first.equals(second)).toBe(false)
      })

      it("should return true when the id matches and a prop differs", () => {
        const first = WithdrawalRecorded.create(
          {
            withdrawalId: buildEntityId("withdrawal-1"),
            positionId: buildEntityId("position-1"),
            fundId: buildEntityId("fund-1"),
            date: new Date("2026-02-20T00:00:00.000Z"),
            amount: buildPositiveMoney("500.00"),
            quotas: buildQuotaQuantity("50.00"),
          },
          "event-1"
        )

        const second = WithdrawalRecorded.create(
          {
            withdrawalId: buildEntityId("withdrawal-4"),
            positionId: buildEntityId("position-4"),
            fundId: buildEntityId("fund-4"),
            date: new Date("2026-04-04T00:00:00.000Z"),
            amount: buildPositiveMoney("1500.00"),
            quotas: buildQuotaQuantity("150.00"),
          },
          "event-1"
        )

        expect(first.amount.value.toFixed(2)).toBe("500.00")
        expect(second.amount.value.toFixed(2)).toBe("1500.00")
        expect(first.equals(second)).toBe(true)
      })

      it("should return false when this event has no id", () => {
        const first = WithdrawalRecorded.create({
          withdrawalId: buildEntityId("withdrawal-1"),
          positionId: buildEntityId("position-1"),
          fundId: buildEntityId("fund-1"),
          date: new Date("2026-02-20T00:00:00.000Z"),
          amount: buildPositiveMoney("500.00"),
          quotas: buildQuotaQuantity("50.00"),
        })

        const second = WithdrawalRecorded.create(
          {
            withdrawalId: buildEntityId("withdrawal-1"),
            positionId: buildEntityId("position-1"),
            fundId: buildEntityId("fund-1"),
            date: new Date("2026-02-20T00:00:00.000Z"),
            amount: buildPositiveMoney("500.00"),
            quotas: buildQuotaQuantity("50.00"),
          },
          "event-1"
        )

        expect(first.equals(second)).toBe(false)
      })

      it("should return false when the other event has no id", () => {
        const first = WithdrawalRecorded.create(
          {
            withdrawalId: buildEntityId("withdrawal-1"),
            positionId: buildEntityId("position-1"),
            fundId: buildEntityId("fund-1"),
            date: new Date("2026-02-20T00:00:00.000Z"),
            amount: buildPositiveMoney("500.00"),
            quotas: buildQuotaQuantity("50.00"),
          },
          "event-1"
        )

        const second = WithdrawalRecorded.create({
          withdrawalId: buildEntityId("withdrawal-1"),
          positionId: buildEntityId("position-1"),
          fundId: buildEntityId("fund-1"),
          date: new Date("2026-02-20T00:00:00.000Z"),
          amount: buildPositiveMoney("500.00"),
          quotas: buildQuotaQuantity("50.00"),
        })

        expect(first.equals(second)).toBe(false)
      })

      it("should return false when comparing to null", () => {
        const event = WithdrawalRecorded.create({
          withdrawalId: buildEntityId("withdrawal-1"),
          positionId: buildEntityId("position-1"),
          fundId: buildEntityId("fund-1"),
          date: new Date("2026-02-20T00:00:00.000Z"),
          amount: buildPositiveMoney("500.00"),
          quotas: buildQuotaQuantity("50.00"),
        })

        expect(event.equals(null)).toBe(false)
      })

      it("should return false when comparing to undefined", () => {
        const event = WithdrawalRecorded.create({
          withdrawalId: buildEntityId("withdrawal-1"),
          positionId: buildEntityId("position-1"),
          fundId: buildEntityId("fund-1"),
          date: new Date("2026-02-20T00:00:00.000Z"),
          amount: buildPositiveMoney("500.00"),
          quotas: buildQuotaQuantity("50.00"),
        })

        expect(event.equals(undefined)).toBe(false)
      })
    })
  })
})
