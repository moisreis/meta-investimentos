import { describe, it, expect, afterEach } from "vitest"

import { PositionOpened } from "@/domain/position/events/position-opened.event"
import { ValidationError } from "@/errors"
import { EntityId } from "@/value-objects"
import { buildEntityId } from "__tests__/__setup__/_factories.setup"
import {
  useFixedClock,
  useRealClock,
  getFixedDate,
} from "__tests__/__setup__/_clock.setup"

describe("domain/position/events/position-opened.event", () => {
  afterEach(() => {
    useRealClock()
  })

  describe("PositionOpened", () => {
    describe("create", () => {
      it("should create a valid PositionOpened with required props", () => {
        const positionId = buildEntityId("position-1")
        const portfolioId = buildEntityId("portfolio-1")
        const fundId = buildEntityId("fund-1")
        const occurredAt = new Date("2026-02-01T12:00:00.000Z")

        const event = PositionOpened.create({
          positionId,
          portfolioId,
          fundId,
          occurredAt,
        })

        expect(event.id).toBeUndefined()
        expect(event.positionId).toBe(positionId)
        expect(event.portfolioId).toBe(portfolioId)
        expect(event.fundId).toBe(fundId)
        expect(event.occurredAt).toEqual(occurredAt)
      })

      it("should create a PositionOpened with provided id", () => {
        const event = PositionOpened.create(
          {
            positionId: buildEntityId("position-1"),
            portfolioId: buildEntityId("portfolio-1"),
            fundId: buildEntityId("fund-1"),
          },
          "event-position-opened-1"
        )

        expect(event.id).toBe(
          EntityId.create("event-position-opened-1")
        )
      })

      it("should leave the id undefined when an empty id is given", () => {
        const event = PositionOpened.create(
          {
            positionId: buildEntityId("position-1"),
            portfolioId: buildEntityId("portfolio-1"),
            fundId: buildEntityId("fund-1"),
          },
          ""
        )

        expect(event.id).toBeUndefined()
      })

      it("should default occurredAt to the current time when omitted", () => {
        useFixedClock()

        const event = PositionOpened.create({
          positionId: buildEntityId("position-1"),
          portfolioId: buildEntityId("portfolio-1"),
          fundId: buildEntityId("fund-1"),
        })

        expect(event.occurredAt).toEqual(getFixedDate())
      })

      it("should keep the provided occurredAt instead of the current time", () => {
        useFixedClock()

        const occurredAt = new Date("2026-09-09T09:09:09.000Z")

        const event = PositionOpened.create({
          positionId: buildEntityId("position-1"),
          portfolioId: buildEntityId("portfolio-1"),
          fundId: buildEntityId("fund-1"),
          occurredAt,
        })

        expect(event.occurredAt).toEqual(occurredAt)
        expect(event.occurredAt).not.toEqual(getFixedDate())
      })

      it("should return a new date instance on every occurredAt read", () => {
        const event = PositionOpened.create({
          positionId: buildEntityId("position-1"),
          portfolioId: buildEntityId("portfolio-1"),
          fundId: buildEntityId("fund-1"),
        })

        expect(event.occurredAt).not.toBe(event.occurredAt)
      })

      it("should throw ValidationError when positionId is missing", () => {
        expect(() =>
          PositionOpened.create({
            portfolioId: buildEntityId("portfolio-1"),
            fundId: buildEntityId("fund-1"),
          } as Parameters<typeof PositionOpened.create>[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when portfolioId is missing", () => {
        expect(() =>
          PositionOpened.create({
            positionId: buildEntityId("position-1"),
            fundId: buildEntityId("fund-1"),
          } as Parameters<typeof PositionOpened.create>[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when fundId is missing", () => {
        expect(() =>
          PositionOpened.create({
            positionId: buildEntityId("position-1"),
            portfolioId: buildEntityId("portfolio-1"),
          } as Parameters<typeof PositionOpened.create>[0])
        ).toThrow(ValidationError)
      })
    })

    describe("equals", () => {
      it("should return true when comparing the same instance", () => {
        const event = PositionOpened.create({
          positionId: buildEntityId("position-1"),
          portfolioId: buildEntityId("portfolio-1"),
          fundId: buildEntityId("fund-1"),
        })

        expect(event.equals(event)).toBe(true)
      })

      it("should return true for different instances with the same id", () => {
        const first = PositionOpened.create(
          {
            positionId: buildEntityId("position-1"),
            portfolioId: buildEntityId("portfolio-1"),
            fundId: buildEntityId("fund-1"),
          },
          "event-shared-id"
        )

        const second = PositionOpened.create(
          {
            positionId: buildEntityId("position-1"),
            portfolioId: buildEntityId("portfolio-1"),
            fundId: buildEntityId("fund-1"),
          },
          "event-shared-id"
        )

        expect(first.equals(second)).toBe(true)
      })

      it("should return false when the ids differ", () => {
        const first = PositionOpened.create(
          {
            positionId: buildEntityId("position-1"),
            portfolioId: buildEntityId("portfolio-1"),
            fundId: buildEntityId("fund-1"),
          },
          "event-1"
        )

        const second = PositionOpened.create(
          {
            positionId: buildEntityId("position-1"),
            portfolioId: buildEntityId("portfolio-1"),
            fundId: buildEntityId("fund-1"),
          },
          "event-2"
        )

        expect(first.equals(second)).toBe(false)
      })

      it("should return true when the id matches and a prop differs", () => {
        const first = PositionOpened.create(
          {
            positionId: buildEntityId("position-1"),
            portfolioId: buildEntityId("portfolio-1"),
            fundId: buildEntityId("fund-1"),
          },
          "event-1"
        )

        const second = PositionOpened.create(
          {
            positionId: buildEntityId("position-5"),
            portfolioId: buildEntityId("portfolio-5"),
            fundId: buildEntityId("fund-5"),
          },
          "event-1"
        )

        expect(first.fundId).toBe(EntityId.create("fund-1"))
        expect(second.fundId).toBe(EntityId.create("fund-5"))
        expect(first.equals(second)).toBe(true)
      })

      it("should return false when this event has no id", () => {
        const first = PositionOpened.create({
          positionId: buildEntityId("position-1"),
          portfolioId: buildEntityId("portfolio-1"),
          fundId: buildEntityId("fund-1"),
        })

        const second = PositionOpened.create(
          {
            positionId: buildEntityId("position-1"),
            portfolioId: buildEntityId("portfolio-1"),
            fundId: buildEntityId("fund-1"),
          },
          "event-1"
        )

        expect(first.equals(second)).toBe(false)
      })

      it("should return false when the other event has no id", () => {
        const first = PositionOpened.create(
          {
            positionId: buildEntityId("position-1"),
            portfolioId: buildEntityId("portfolio-1"),
            fundId: buildEntityId("fund-1"),
          },
          "event-1"
        )

        const second = PositionOpened.create({
          positionId: buildEntityId("position-1"),
          portfolioId: buildEntityId("portfolio-1"),
          fundId: buildEntityId("fund-1"),
        })

        expect(first.equals(second)).toBe(false)
      })

      it("should return false when comparing to null", () => {
        const event = PositionOpened.create({
          positionId: buildEntityId("position-1"),
          portfolioId: buildEntityId("portfolio-1"),
          fundId: buildEntityId("fund-1"),
        })

        expect(event.equals(null)).toBe(false)
      })

      it("should return false when comparing to undefined", () => {
        const event = PositionOpened.create({
          positionId: buildEntityId("position-1"),
          portfolioId: buildEntityId("portfolio-1"),
          fundId: buildEntityId("fund-1"),
        })

        expect(event.equals(undefined)).toBe(false)
      })
    })
  })
})
