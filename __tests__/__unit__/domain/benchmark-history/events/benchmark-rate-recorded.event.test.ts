import { describe, it, expect, afterEach } from "vitest"

import { BenchmarkRateRecorded } from "@/domain/benchmark-history/events/benchmark-rate-recorded.event"
import { ValidationError } from "@/errors"
import { EntityId } from "@/value-objects"
import {
  buildEntityId,
  buildSignedPercentage,
} from "__tests__/__setup__/_factories.setup"
import {
  useFixedClock,
  useRealClock,
  getFixedDate,
} from "__tests__/__setup__/_clock.setup"

describe("domain/benchmark-history/events/benchmark-rate-recorded.event", () => {
  afterEach(() => {
    useRealClock()
  })

  describe("BenchmarkRateRecorded", () => {
    describe("create", () => {
      it("should create a valid BenchmarkRateRecorded with required props", () => {
        const historyId = buildEntityId("history-1")
        const benchmarkId = buildEntityId("benchmark-1")
        const date = new Date("2026-01-10T00:00:00.000Z")
        const occurredAt = new Date("2026-01-10T18:00:00.000Z")

        const event = BenchmarkRateRecorded.create({
          historyId,
          benchmarkId,
          date,
          rate: buildSignedPercentage("12.34"),
          occurredAt,
        })

        expect(event.id).toBeUndefined()
        expect(event.historyId).toBe(historyId)
        expect(event.benchmarkId).toBe(benchmarkId)
        expect(event.date).toEqual(date)
        expect(event.rate.value.toFixed(2)).toBe("12.34")
        expect(event.occurredAt).toEqual(occurredAt)
      })

      it("should create a BenchmarkRateRecorded with provided id", () => {
        const event = BenchmarkRateRecorded.create(
          {
            historyId: buildEntityId("history-1"),
            benchmarkId: buildEntityId("benchmark-1"),
            date: new Date("2026-01-10T00:00:00.000Z"),
            rate: buildSignedPercentage("12.34"),
          },
          "event-benchmark-rate-1"
        )

        expect(event.id).toBe(
          EntityId.create("event-benchmark-rate-1")
        )
      })

      it("should leave the id undefined when an empty id is given", () => {
        const event = BenchmarkRateRecorded.create(
          {
            historyId: buildEntityId("history-1"),
            benchmarkId: buildEntityId("benchmark-1"),
            date: new Date("2026-01-10T00:00:00.000Z"),
            rate: buildSignedPercentage("12.34"),
          },
          ""
        )

        expect(event.id).toBeUndefined()
      })

      it("should default occurredAt to the current time when omitted", () => {
        useFixedClock()

        const event = BenchmarkRateRecorded.create({
          historyId: buildEntityId("history-1"),
          benchmarkId: buildEntityId("benchmark-1"),
          date: new Date("2026-01-10T00:00:00.000Z"),
          rate: buildSignedPercentage("12.34"),
        })

        expect(event.occurredAt).toEqual(getFixedDate())
      })

      it("should keep the provided occurredAt instead of the current time", () => {
        useFixedClock()

        const occurredAt = new Date("2026-02-28T23:59:59.000Z")

        const event = BenchmarkRateRecorded.create({
          historyId: buildEntityId("history-1"),
          benchmarkId: buildEntityId("benchmark-1"),
          date: new Date("2026-01-10T00:00:00.000Z"),
          rate: buildSignedPercentage("12.34"),
          occurredAt,
        })

        expect(event.occurredAt).toEqual(occurredAt)
        expect(event.occurredAt).not.toEqual(getFixedDate())
      })

      it("should copy the date prop so later mutations do not leak", () => {
        const date = new Date("2026-01-10T00:00:00.000Z")

        const event = BenchmarkRateRecorded.create({
          historyId: buildEntityId("history-1"),
          benchmarkId: buildEntityId("benchmark-1"),
          date,
          rate: buildSignedPercentage("12.34"),
        })

        date.setUTCFullYear(2030)

        expect(event.date).toEqual(
          new Date("2026-01-10T00:00:00.000Z")
        )
      })

      it("should return a new date instance on every date read", () => {
        const event = BenchmarkRateRecorded.create({
          historyId: buildEntityId("history-1"),
          benchmarkId: buildEntityId("benchmark-1"),
          date: new Date("2026-01-10T00:00:00.000Z"),
          rate: buildSignedPercentage("12.34"),
        })

        expect(event.date).not.toBe(event.date)
        expect(event.occurredAt).not.toBe(event.occurredAt)
      })

      it("should keep a negative rate untouched", () => {
        const event = BenchmarkRateRecorded.create({
          historyId: buildEntityId("history-1"),
          benchmarkId: buildEntityId("benchmark-1"),
          date: new Date("2026-01-10T00:00:00.000Z"),
          rate: buildSignedPercentage("-4.25"),
        })

        expect(event.rate.value.toFixed(2)).toBe("-4.25")
      })

      it("should throw ValidationError when historyId is missing", () => {
        expect(() =>
          BenchmarkRateRecorded.create({
            benchmarkId: buildEntityId("benchmark-1"),
            date: new Date("2026-01-10T00:00:00.000Z"),
            rate: buildSignedPercentage("12.34"),
          } as Parameters<
            typeof BenchmarkRateRecorded.create
          >[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when benchmarkId is missing", () => {
        expect(() =>
          BenchmarkRateRecorded.create({
            historyId: buildEntityId("history-1"),
            date: new Date("2026-01-10T00:00:00.000Z"),
            rate: buildSignedPercentage("12.34"),
          } as Parameters<
            typeof BenchmarkRateRecorded.create
          >[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when date is missing", () => {
        expect(() =>
          BenchmarkRateRecorded.create({
            historyId: buildEntityId("history-1"),
            benchmarkId: buildEntityId("benchmark-1"),
            rate: buildSignedPercentage("12.34"),
          } as Parameters<
            typeof BenchmarkRateRecorded.create
          >[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when rate is missing", () => {
        expect(() =>
          BenchmarkRateRecorded.create({
            historyId: buildEntityId("history-1"),
            benchmarkId: buildEntityId("benchmark-1"),
            date: new Date("2026-01-10T00:00:00.000Z"),
          } as Parameters<
            typeof BenchmarkRateRecorded.create
          >[0])
        ).toThrow(ValidationError)
      })
    })

    describe("equals", () => {
      it("should return true when comparing the same instance", () => {
        const event = BenchmarkRateRecorded.create({
          historyId: buildEntityId("history-1"),
          benchmarkId: buildEntityId("benchmark-1"),
          date: new Date("2026-01-10T00:00:00.000Z"),
          rate: buildSignedPercentage("12.34"),
        })

        expect(event.equals(event)).toBe(true)
      })

      it("should return true for different instances with the same id", () => {
        const first = BenchmarkRateRecorded.create(
          {
            historyId: buildEntityId("history-1"),
            benchmarkId: buildEntityId("benchmark-1"),
            date: new Date("2026-01-10T00:00:00.000Z"),
            rate: buildSignedPercentage("12.34"),
          },
          "event-shared-id"
        )

        const second = BenchmarkRateRecorded.create(
          {
            historyId: buildEntityId("history-1"),
            benchmarkId: buildEntityId("benchmark-1"),
            date: new Date("2026-01-10T00:00:00.000Z"),
            rate: buildSignedPercentage("12.34"),
          },
          "event-shared-id"
        )

        expect(first.equals(second)).toBe(true)
      })

      it("should return false when the ids differ", () => {
        const first = BenchmarkRateRecorded.create(
          {
            historyId: buildEntityId("history-1"),
            benchmarkId: buildEntityId("benchmark-1"),
            date: new Date("2026-01-10T00:00:00.000Z"),
            rate: buildSignedPercentage("12.34"),
          },
          "event-1"
        )

        const second = BenchmarkRateRecorded.create(
          {
            historyId: buildEntityId("history-1"),
            benchmarkId: buildEntityId("benchmark-1"),
            date: new Date("2026-01-10T00:00:00.000Z"),
            rate: buildSignedPercentage("12.34"),
          },
          "event-2"
        )

        expect(first.equals(second)).toBe(false)
      })

      it("should return true when the id matches and a prop differs", () => {
        const first = BenchmarkRateRecorded.create(
          {
            historyId: buildEntityId("history-1"),
            benchmarkId: buildEntityId("benchmark-1"),
            date: new Date("2026-01-10T00:00:00.000Z"),
            rate: buildSignedPercentage("12.34"),
          },
          "event-1"
        )

        const second = BenchmarkRateRecorded.create(
          {
            historyId: buildEntityId("history-7"),
            benchmarkId: buildEntityId("benchmark-7"),
            date: new Date("2026-03-01T00:00:00.000Z"),
            rate: buildSignedPercentage("-1.00"),
          },
          "event-1"
        )

        expect(first.rate.value.toFixed(2)).toBe("12.34")
        expect(second.rate.value.toFixed(2)).toBe("-1.00")
        expect(first.equals(second)).toBe(true)
      })

      it("should return false when this event has no id", () => {
        const first = BenchmarkRateRecorded.create({
          historyId: buildEntityId("history-1"),
          benchmarkId: buildEntityId("benchmark-1"),
          date: new Date("2026-01-10T00:00:00.000Z"),
          rate: buildSignedPercentage("12.34"),
        })

        const second = BenchmarkRateRecorded.create(
          {
            historyId: buildEntityId("history-1"),
            benchmarkId: buildEntityId("benchmark-1"),
            date: new Date("2026-01-10T00:00:00.000Z"),
            rate: buildSignedPercentage("12.34"),
          },
          "event-1"
        )

        expect(first.equals(second)).toBe(false)
      })

      it("should return false when the other event has no id", () => {
        const first = BenchmarkRateRecorded.create(
          {
            historyId: buildEntityId("history-1"),
            benchmarkId: buildEntityId("benchmark-1"),
            date: new Date("2026-01-10T00:00:00.000Z"),
            rate: buildSignedPercentage("12.34"),
          },
          "event-1"
        )

        const second = BenchmarkRateRecorded.create({
          historyId: buildEntityId("history-1"),
          benchmarkId: buildEntityId("benchmark-1"),
          date: new Date("2026-01-10T00:00:00.000Z"),
          rate: buildSignedPercentage("12.34"),
        })

        expect(first.equals(second)).toBe(false)
      })

      it("should return false when comparing to null", () => {
        const event = BenchmarkRateRecorded.create({
          historyId: buildEntityId("history-1"),
          benchmarkId: buildEntityId("benchmark-1"),
          date: new Date("2026-01-10T00:00:00.000Z"),
          rate: buildSignedPercentage("12.34"),
        })

        expect(event.equals(null)).toBe(false)
      })

      it("should return false when comparing to undefined", () => {
        const event = BenchmarkRateRecorded.create({
          historyId: buildEntityId("history-1"),
          benchmarkId: buildEntityId("benchmark-1"),
          date: new Date("2026-01-10T00:00:00.000Z"),
          rate: buildSignedPercentage("12.34"),
        })

        expect(event.equals(undefined)).toBe(false)
      })
    })
  })
})
