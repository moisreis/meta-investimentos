import { describe, it, expect, afterEach } from "vitest"

import { StatementGenerated } from "@/domain/statement/events/statement-generated.event"
import { ValidationError } from "@/errors"
import { EntityId } from "@/value-objects"
import { buildEntityId } from "__tests__/__setup__/_factories.setup"
import {
  useFixedClock,
  useRealClock,
  getFixedDate,
} from "__tests__/__setup__/_clock.setup"

describe("domain/statement/events/statement-generated.event", () => {
  afterEach(() => {
    useRealClock()
  })

  describe("StatementGenerated", () => {
    describe("create", () => {
      it("should create a valid StatementGenerated with required props", () => {
        const statementId = buildEntityId("statement-1")
        const periodStart = new Date("2026-01-01T00:00:00.000Z")
        const periodEnd = new Date("2026-01-31T00:00:00.000Z")
        const occurredAt = new Date("2026-02-01T00:00:00.000Z")

        const event = StatementGenerated.create({
          statementId,
          periodStart,
          periodEnd,
          fileUrl: "https://example.com/statements/january.pdf",
          occurredAt,
        })

        expect(event.id).toBeUndefined()
        expect(event.statementId).toBe(statementId)
        expect(event.periodStart).toEqual(periodStart)
        expect(event.periodEnd).toEqual(periodEnd)
        expect(event.fileUrl).toBe(
          "https://example.com/statements/january.pdf"
        )
        expect(event.occurredAt).toEqual(occurredAt)
      })

      it("should create a StatementGenerated with provided id", () => {
        const event = StatementGenerated.create(
          {
            statementId: buildEntityId("statement-1"),
            periodStart: new Date("2026-01-01T00:00:00.000Z"),
            periodEnd: new Date("2026-01-31T00:00:00.000Z"),
            fileUrl:
              "https://example.com/statements/january.pdf",
          },
          "event-statement-generated-1"
        )

        expect(event.id).toBe(
          EntityId.create("event-statement-generated-1")
        )
      })

      it("should leave the id undefined when an empty id is given", () => {
        const event = StatementGenerated.create(
          {
            statementId: buildEntityId("statement-1"),
            periodStart: new Date("2026-01-01T00:00:00.000Z"),
            periodEnd: new Date("2026-01-31T00:00:00.000Z"),
            fileUrl:
              "https://example.com/statements/january.pdf",
          },
          ""
        )

        expect(event.id).toBeUndefined()
      })

      it("should expose the optional relations when provided", () => {
        const portfolioId = buildEntityId("portfolio-1")
        const generatedByUserId = buildEntityId("user-1")

        const event = StatementGenerated.create({
          statementId: buildEntityId("statement-1"),
          periodStart: new Date("2026-01-01T00:00:00.000Z"),
          periodEnd: new Date("2026-01-31T00:00:00.000Z"),
          fileUrl: "https://example.com/statements/january.pdf",
          portfolioId,
          generatedByUserId,
        })

        expect(event.portfolioId).toBe(portfolioId)
        expect(event.generatedByUserId).toBe(generatedByUserId)
      })

      it("should default the optional relations to null when omitted", () => {
        const event = StatementGenerated.create({
          statementId: buildEntityId("statement-1"),
          periodStart: new Date("2026-01-01T00:00:00.000Z"),
          periodEnd: new Date("2026-01-31T00:00:00.000Z"),
          fileUrl: "https://example.com/statements/january.pdf",
        })

        expect(event.portfolioId).toBeNull()
        expect(event.generatedByUserId).toBeNull()
      })

      it("should default the optional relations to null when explicitly null", () => {
        const event = StatementGenerated.create({
          statementId: buildEntityId("statement-1"),
          periodStart: new Date("2026-01-01T00:00:00.000Z"),
          periodEnd: new Date("2026-01-31T00:00:00.000Z"),
          fileUrl: "https://example.com/statements/january.pdf",
          portfolioId: null,
          generatedByUserId: null,
        })

        expect(event.portfolioId).toBeNull()
        expect(event.generatedByUserId).toBeNull()
      })

      it("should default occurredAt to the current time when omitted", () => {
        useFixedClock()

        const event = StatementGenerated.create({
          statementId: buildEntityId("statement-1"),
          periodStart: new Date("2026-01-01T00:00:00.000Z"),
          periodEnd: new Date("2026-01-31T00:00:00.000Z"),
          fileUrl: "https://example.com/statements/january.pdf",
        })

        expect(event.occurredAt).toEqual(getFixedDate())
      })

      it("should keep the provided occurredAt instead of the current time", () => {
        useFixedClock()

        const occurredAt = new Date("2026-11-11T11:11:11.000Z")

        const event = StatementGenerated.create({
          statementId: buildEntityId("statement-1"),
          periodStart: new Date("2026-01-01T00:00:00.000Z"),
          periodEnd: new Date("2026-01-31T00:00:00.000Z"),
          fileUrl: "https://example.com/statements/january.pdf",
          occurredAt,
        })

        expect(event.occurredAt).toEqual(occurredAt)
        expect(event.occurredAt).not.toEqual(getFixedDate())
      })

      it("should copy the period dates so later mutations do not leak", () => {
        const periodStart = new Date("2026-01-01T00:00:00.000Z")
        const periodEnd = new Date("2026-01-31T00:00:00.000Z")

        const event = StatementGenerated.create({
          statementId: buildEntityId("statement-1"),
          periodStart,
          periodEnd,
          fileUrl: "https://example.com/statements/january.pdf",
        })

        periodStart.setUTCFullYear(2030)
        periodEnd.setUTCFullYear(2030)

        expect(event.periodStart).toEqual(
          new Date("2026-01-01T00:00:00.000Z")
        )
        expect(event.periodEnd).toEqual(
          new Date("2026-01-31T00:00:00.000Z")
        )
      })

      it("should return new date instances on every date read", () => {
        const event = StatementGenerated.create({
          statementId: buildEntityId("statement-1"),
          periodStart: new Date("2026-01-01T00:00:00.000Z"),
          periodEnd: new Date("2026-01-31T00:00:00.000Z"),
          fileUrl: "https://example.com/statements/january.pdf",
        })

        expect(event.periodStart).not.toBe(event.periodStart)
        expect(event.periodEnd).not.toBe(event.periodEnd)
        expect(event.occurredAt).not.toBe(event.occurredAt)
      })

      it("should accept a period whose start equals its end", () => {
        const date = new Date("2026-01-01T00:00:00.000Z")

        const event = StatementGenerated.create({
          statementId: buildEntityId("statement-1"),
          periodStart: date,
          periodEnd: date,
          fileUrl: "https://example.com/statements/january.pdf",
        })

        expect(event.periodStart).toEqual(date)
        expect(event.periodEnd).toEqual(date)
      })

      it("should throw ValidationError when statementId is missing", () => {
        expect(() =>
          StatementGenerated.create({
            periodStart: new Date("2026-01-01T00:00:00.000Z"),
            periodEnd: new Date("2026-01-31T00:00:00.000Z"),
            fileUrl:
              "https://example.com/statements/january.pdf",
          } as Parameters<typeof StatementGenerated.create>[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when periodStart is missing", () => {
        expect(() =>
          StatementGenerated.create({
            statementId: buildEntityId("statement-1"),
            periodEnd: new Date("2026-01-31T00:00:00.000Z"),
            fileUrl:
              "https://example.com/statements/january.pdf",
          } as Parameters<typeof StatementGenerated.create>[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when periodEnd is missing", () => {
        expect(() =>
          StatementGenerated.create({
            statementId: buildEntityId("statement-1"),
            periodStart: new Date("2026-01-01T00:00:00.000Z"),
            fileUrl:
              "https://example.com/statements/january.pdf",
          } as Parameters<typeof StatementGenerated.create>[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when fileUrl is missing", () => {
        expect(() =>
          StatementGenerated.create({
            statementId: buildEntityId("statement-1"),
            periodStart: new Date("2026-01-01T00:00:00.000Z"),
            periodEnd: new Date("2026-01-31T00:00:00.000Z"),
          } as Parameters<typeof StatementGenerated.create>[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when fileUrl is blank", () => {
        expect(() =>
          StatementGenerated.create({
            statementId: buildEntityId("statement-1"),
            periodStart: new Date("2026-01-01T00:00:00.000Z"),
            periodEnd: new Date("2026-01-31T00:00:00.000Z"),
            fileUrl: "",
          })
        ).toThrow(ValidationError)

        expect(() =>
          StatementGenerated.create({
            statementId: buildEntityId("statement-1"),
            periodStart: new Date("2026-01-01T00:00:00.000Z"),
            periodEnd: new Date("2026-01-31T00:00:00.000Z"),
            fileUrl: "   ",
          })
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when periodStart is after periodEnd", () => {
        expect(() =>
          StatementGenerated.create({
            statementId: buildEntityId("statement-1"),
            periodStart: new Date("2026-02-01T00:00:00.000Z"),
            periodEnd: new Date("2026-01-31T00:00:00.000Z"),
            fileUrl:
              "https://example.com/statements/january.pdf",
          })
        ).toThrow(ValidationError)
      })
    })

    describe("equals", () => {
      it("should return true when comparing the same instance", () => {
        const event = StatementGenerated.create({
          statementId: buildEntityId("statement-1"),
          periodStart: new Date("2026-01-01T00:00:00.000Z"),
          periodEnd: new Date("2026-01-31T00:00:00.000Z"),
          fileUrl: "https://example.com/statements/january.pdf",
        })

        expect(event.equals(event)).toBe(true)
      })

      it("should return true for different instances with the same id", () => {
        const first = StatementGenerated.create(
          {
            statementId: buildEntityId("statement-1"),
            periodStart: new Date("2026-01-01T00:00:00.000Z"),
            periodEnd: new Date("2026-01-31T00:00:00.000Z"),
            fileUrl:
              "https://example.com/statements/january.pdf",
          },
          "event-shared-id"
        )

        const second = StatementGenerated.create(
          {
            statementId: buildEntityId("statement-1"),
            periodStart: new Date("2026-01-01T00:00:00.000Z"),
            periodEnd: new Date("2026-01-31T00:00:00.000Z"),
            fileUrl:
              "https://example.com/statements/january.pdf",
          },
          "event-shared-id"
        )

        expect(first.equals(second)).toBe(true)
      })

      it("should return false when the ids differ", () => {
        const first = StatementGenerated.create(
          {
            statementId: buildEntityId("statement-1"),
            periodStart: new Date("2026-01-01T00:00:00.000Z"),
            periodEnd: new Date("2026-01-31T00:00:00.000Z"),
            fileUrl:
              "https://example.com/statements/january.pdf",
          },
          "event-1"
        )

        const second = StatementGenerated.create(
          {
            statementId: buildEntityId("statement-1"),
            periodStart: new Date("2026-01-01T00:00:00.000Z"),
            periodEnd: new Date("2026-01-31T00:00:00.000Z"),
            fileUrl:
              "https://example.com/statements/january.pdf",
          },
          "event-2"
        )

        expect(first.equals(second)).toBe(false)
      })

      it("should return true when the id matches and a prop differs", () => {
        const first = StatementGenerated.create(
          {
            statementId: buildEntityId("statement-1"),
            periodStart: new Date("2026-01-01T00:00:00.000Z"),
            periodEnd: new Date("2026-01-31T00:00:00.000Z"),
            fileUrl:
              "https://example.com/statements/january.pdf",
          },
          "event-1"
        )

        const second = StatementGenerated.create(
          {
            statementId: buildEntityId("statement-3"),
            periodStart: new Date("2026-03-01T00:00:00.000Z"),
            periodEnd: new Date("2026-03-31T00:00:00.000Z"),
            fileUrl: "https://example.com/statements/march.pdf",
          },
          "event-1"
        )

        expect(first.fileUrl).toBe(
          "https://example.com/statements/january.pdf"
        )
        expect(second.fileUrl).toBe(
          "https://example.com/statements/march.pdf"
        )
        expect(first.equals(second)).toBe(true)
      })

      it("should return false when this event has no id", () => {
        const first = StatementGenerated.create({
          statementId: buildEntityId("statement-1"),
          periodStart: new Date("2026-01-01T00:00:00.000Z"),
          periodEnd: new Date("2026-01-31T00:00:00.000Z"),
          fileUrl: "https://example.com/statements/january.pdf",
        })

        const second = StatementGenerated.create(
          {
            statementId: buildEntityId("statement-1"),
            periodStart: new Date("2026-01-01T00:00:00.000Z"),
            periodEnd: new Date("2026-01-31T00:00:00.000Z"),
            fileUrl:
              "https://example.com/statements/january.pdf",
          },
          "event-1"
        )

        expect(first.equals(second)).toBe(false)
      })

      it("should return false when the other event has no id", () => {
        const first = StatementGenerated.create(
          {
            statementId: buildEntityId("statement-1"),
            periodStart: new Date("2026-01-01T00:00:00.000Z"),
            periodEnd: new Date("2026-01-31T00:00:00.000Z"),
            fileUrl:
              "https://example.com/statements/january.pdf",
          },
          "event-1"
        )

        const second = StatementGenerated.create({
          statementId: buildEntityId("statement-1"),
          periodStart: new Date("2026-01-01T00:00:00.000Z"),
          periodEnd: new Date("2026-01-31T00:00:00.000Z"),
          fileUrl: "https://example.com/statements/january.pdf",
        })

        expect(first.equals(second)).toBe(false)
      })

      it("should return false when comparing to null", () => {
        const event = StatementGenerated.create({
          statementId: buildEntityId("statement-1"),
          periodStart: new Date("2026-01-01T00:00:00.000Z"),
          periodEnd: new Date("2026-01-31T00:00:00.000Z"),
          fileUrl: "https://example.com/statements/january.pdf",
        })

        expect(event.equals(null)).toBe(false)
      })

      it("should return false when comparing to undefined", () => {
        const event = StatementGenerated.create({
          statementId: buildEntityId("statement-1"),
          periodStart: new Date("2026-01-01T00:00:00.000Z"),
          periodEnd: new Date("2026-01-31T00:00:00.000Z"),
          fileUrl: "https://example.com/statements/january.pdf",
        })

        expect(event.equals(undefined)).toBe(false)
      })
    })
  })
})
