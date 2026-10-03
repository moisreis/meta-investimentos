import { describe, it, expect, afterEach } from "vitest"

import { NormAttachedToPortfolio } from "@/domain/norms-portfolio/events/norm-attached-to-portfolio.event"
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

describe("domain/norms-portfolio/events/norm-attached-to-portfolio.event", () => {
  afterEach(() => {
    useRealClock()
  })

  describe("NormAttachedToPortfolio", () => {
    describe("create", () => {
      it("should create a valid NormAttachedToPortfolio with required props", () => {
        const normId = buildEntityId("norm-1")
        const portfolioId = buildEntityId("portfolio-1")
        const occurredAt = new Date("2026-04-10T12:00:00.000Z")

        const event = NormAttachedToPortfolio.create({
          normId,
          portfolioId,
          minAllocation: buildSignedPercentage("5"),
          targetAllocation: buildSignedPercentage("12"),
          maxAllocation: buildSignedPercentage("20"),
          occurredAt,
        })

        expect(event.id).toBeUndefined()
        expect(event.normId).toBe(normId)
        expect(event.portfolioId).toBe(portfolioId)
        expect(event.minAllocation.value.toFixed(2)).toBe("5.00")
        expect(event.targetAllocation.value.toFixed(2)).toBe(
          "12.00"
        )
        expect(event.maxAllocation.value.toFixed(2)).toBe(
          "20.00"
        )
        expect(event.occurredAt).toEqual(occurredAt)
      })

      it("should create a NormAttachedToPortfolio with provided id", () => {
        const event = NormAttachedToPortfolio.create(
          {
            normId: buildEntityId("norm-1"),
            portfolioId: buildEntityId("portfolio-1"),
            minAllocation: buildSignedPercentage("5"),
            targetAllocation: buildSignedPercentage("12"),
            maxAllocation: buildSignedPercentage("20"),
          },
          "event-norm-attached-1"
        )

        expect(event.id).toBe(
          EntityId.create("event-norm-attached-1")
        )
      })

      it("should leave the id undefined when an empty id is given", () => {
        const event = NormAttachedToPortfolio.create(
          {
            normId: buildEntityId("norm-1"),
            portfolioId: buildEntityId("portfolio-1"),
            minAllocation: buildSignedPercentage("5"),
            targetAllocation: buildSignedPercentage("12"),
            maxAllocation: buildSignedPercentage("20"),
          },
          ""
        )

        expect(event.id).toBeUndefined()
      })

      it("should default occurredAt to the current time when omitted", () => {
        useFixedClock()

        const event = NormAttachedToPortfolio.create({
          normId: buildEntityId("norm-1"),
          portfolioId: buildEntityId("portfolio-1"),
          minAllocation: buildSignedPercentage("5"),
          targetAllocation: buildSignedPercentage("12"),
          maxAllocation: buildSignedPercentage("20"),
        })

        expect(event.occurredAt).toEqual(getFixedDate())
      })

      it("should keep the provided occurredAt instead of the current time", () => {
        useFixedClock()

        const occurredAt = new Date("2026-05-05T05:05:05.000Z")

        const event = NormAttachedToPortfolio.create({
          normId: buildEntityId("norm-1"),
          portfolioId: buildEntityId("portfolio-1"),
          minAllocation: buildSignedPercentage("5"),
          targetAllocation: buildSignedPercentage("12"),
          maxAllocation: buildSignedPercentage("20"),
          occurredAt,
        })

        expect(event.occurredAt).toEqual(occurredAt)
        expect(event.occurredAt).not.toEqual(getFixedDate())
      })

      it("should return a new date instance on every occurredAt read", () => {
        const event = NormAttachedToPortfolio.create({
          normId: buildEntityId("norm-1"),
          portfolioId: buildEntityId("portfolio-1"),
          minAllocation: buildSignedPercentage("5"),
          targetAllocation: buildSignedPercentage("12"),
          maxAllocation: buildSignedPercentage("20"),
        })

        expect(event.occurredAt).not.toBe(event.occurredAt)
      })

      it("should accept equal allocation bounds", () => {
        const event = NormAttachedToPortfolio.create({
          normId: buildEntityId("norm-1"),
          portfolioId: buildEntityId("portfolio-1"),
          minAllocation: buildSignedPercentage("10"),
          targetAllocation: buildSignedPercentage("10"),
          maxAllocation: buildSignedPercentage("10"),
        })

        expect(event.minAllocation.value.toFixed(2)).toBe(
          "10.00"
        )
        expect(event.targetAllocation.value.toFixed(2)).toBe(
          "10.00"
        )
        expect(event.maxAllocation.value.toFixed(2)).toBe(
          "10.00"
        )
      })

      it("should throw ValidationError when normId is missing", () => {
        expect(() =>
          NormAttachedToPortfolio.create({
            portfolioId: buildEntityId("portfolio-1"),
            minAllocation: buildSignedPercentage("5"),
            targetAllocation: buildSignedPercentage("12"),
            maxAllocation: buildSignedPercentage("20"),
          } as Parameters<
            typeof NormAttachedToPortfolio.create
          >[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when portfolioId is missing", () => {
        expect(() =>
          NormAttachedToPortfolio.create({
            normId: buildEntityId("norm-1"),
            minAllocation: buildSignedPercentage("5"),
            targetAllocation: buildSignedPercentage("12"),
            maxAllocation: buildSignedPercentage("20"),
          } as Parameters<
            typeof NormAttachedToPortfolio.create
          >[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when minAllocation is missing", () => {
        expect(() =>
          NormAttachedToPortfolio.create({
            normId: buildEntityId("norm-1"),
            portfolioId: buildEntityId("portfolio-1"),
            targetAllocation: buildSignedPercentage("12"),
            maxAllocation: buildSignedPercentage("20"),
          } as Parameters<
            typeof NormAttachedToPortfolio.create
          >[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when targetAllocation is missing", () => {
        expect(() =>
          NormAttachedToPortfolio.create({
            normId: buildEntityId("norm-1"),
            portfolioId: buildEntityId("portfolio-1"),
            minAllocation: buildSignedPercentage("5"),
            maxAllocation: buildSignedPercentage("20"),
          } as Parameters<
            typeof NormAttachedToPortfolio.create
          >[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when maxAllocation is missing", () => {
        expect(() =>
          NormAttachedToPortfolio.create({
            normId: buildEntityId("norm-1"),
            portfolioId: buildEntityId("portfolio-1"),
            minAllocation: buildSignedPercentage("5"),
            targetAllocation: buildSignedPercentage("12"),
          } as Parameters<
            typeof NormAttachedToPortfolio.create
          >[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when minAllocation is above targetAllocation", () => {
        expect(() =>
          NormAttachedToPortfolio.create({
            normId: buildEntityId("norm-1"),
            portfolioId: buildEntityId("portfolio-1"),
            minAllocation: buildSignedPercentage("30"),
            targetAllocation: buildSignedPercentage("12"),
            maxAllocation: buildSignedPercentage("40"),
          })
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when targetAllocation is above maxAllocation", () => {
        expect(() =>
          NormAttachedToPortfolio.create({
            normId: buildEntityId("norm-1"),
            portfolioId: buildEntityId("portfolio-1"),
            minAllocation: buildSignedPercentage("5"),
            targetAllocation: buildSignedPercentage("45"),
            maxAllocation: buildSignedPercentage("40"),
          })
        ).toThrow(ValidationError)
      })
    })

    describe("equals", () => {
      it("should return true when comparing the same instance", () => {
        const event = NormAttachedToPortfolio.create({
          normId: buildEntityId("norm-1"),
          portfolioId: buildEntityId("portfolio-1"),
          minAllocation: buildSignedPercentage("5"),
          targetAllocation: buildSignedPercentage("12"),
          maxAllocation: buildSignedPercentage("20"),
        })

        expect(event.equals(event)).toBe(true)
      })

      it("should return true for different instances with the same id", () => {
        const first = NormAttachedToPortfolio.create(
          {
            normId: buildEntityId("norm-1"),
            portfolioId: buildEntityId("portfolio-1"),
            minAllocation: buildSignedPercentage("5"),
            targetAllocation: buildSignedPercentage("12"),
            maxAllocation: buildSignedPercentage("20"),
          },
          "event-shared-id"
        )

        const second = NormAttachedToPortfolio.create(
          {
            normId: buildEntityId("norm-1"),
            portfolioId: buildEntityId("portfolio-1"),
            minAllocation: buildSignedPercentage("5"),
            targetAllocation: buildSignedPercentage("12"),
            maxAllocation: buildSignedPercentage("20"),
          },
          "event-shared-id"
        )

        expect(first.equals(second)).toBe(true)
      })

      it("should return false when the ids differ", () => {
        const first = NormAttachedToPortfolio.create(
          {
            normId: buildEntityId("norm-1"),
            portfolioId: buildEntityId("portfolio-1"),
            minAllocation: buildSignedPercentage("5"),
            targetAllocation: buildSignedPercentage("12"),
            maxAllocation: buildSignedPercentage("20"),
          },
          "event-1"
        )

        const second = NormAttachedToPortfolio.create(
          {
            normId: buildEntityId("norm-1"),
            portfolioId: buildEntityId("portfolio-1"),
            minAllocation: buildSignedPercentage("5"),
            targetAllocation: buildSignedPercentage("12"),
            maxAllocation: buildSignedPercentage("20"),
          },
          "event-2"
        )

        expect(first.equals(second)).toBe(false)
      })

      it("should return true when the id matches and a prop differs", () => {
        const first = NormAttachedToPortfolio.create(
          {
            normId: buildEntityId("norm-1"),
            portfolioId: buildEntityId("portfolio-1"),
            minAllocation: buildSignedPercentage("5"),
            targetAllocation: buildSignedPercentage("12"),
            maxAllocation: buildSignedPercentage("20"),
          },
          "event-1"
        )

        const second = NormAttachedToPortfolio.create(
          {
            normId: buildEntityId("norm-8"),
            portfolioId: buildEntityId("portfolio-8"),
            minAllocation: buildSignedPercentage("1"),
            targetAllocation: buildSignedPercentage("2"),
            maxAllocation: buildSignedPercentage("3"),
          },
          "event-1"
        )

        expect(first.targetAllocation.value.toFixed(2)).toBe(
          "12.00"
        )
        expect(second.targetAllocation.value.toFixed(2)).toBe(
          "2.00"
        )
        expect(first.equals(second)).toBe(true)
      })

      it("should return false when this event has no id", () => {
        const first = NormAttachedToPortfolio.create({
          normId: buildEntityId("norm-1"),
          portfolioId: buildEntityId("portfolio-1"),
          minAllocation: buildSignedPercentage("5"),
          targetAllocation: buildSignedPercentage("12"),
          maxAllocation: buildSignedPercentage("20"),
        })

        const second = NormAttachedToPortfolio.create(
          {
            normId: buildEntityId("norm-1"),
            portfolioId: buildEntityId("portfolio-1"),
            minAllocation: buildSignedPercentage("5"),
            targetAllocation: buildSignedPercentage("12"),
            maxAllocation: buildSignedPercentage("20"),
          },
          "event-1"
        )

        expect(first.equals(second)).toBe(false)
      })

      it("should return false when the other event has no id", () => {
        const first = NormAttachedToPortfolio.create(
          {
            normId: buildEntityId("norm-1"),
            portfolioId: buildEntityId("portfolio-1"),
            minAllocation: buildSignedPercentage("5"),
            targetAllocation: buildSignedPercentage("12"),
            maxAllocation: buildSignedPercentage("20"),
          },
          "event-1"
        )

        const second = NormAttachedToPortfolio.create({
          normId: buildEntityId("norm-1"),
          portfolioId: buildEntityId("portfolio-1"),
          minAllocation: buildSignedPercentage("5"),
          targetAllocation: buildSignedPercentage("12"),
          maxAllocation: buildSignedPercentage("20"),
        })

        expect(first.equals(second)).toBe(false)
      })

      it("should return false when comparing to null", () => {
        const event = NormAttachedToPortfolio.create({
          normId: buildEntityId("norm-1"),
          portfolioId: buildEntityId("portfolio-1"),
          minAllocation: buildSignedPercentage("5"),
          targetAllocation: buildSignedPercentage("12"),
          maxAllocation: buildSignedPercentage("20"),
        })

        expect(event.equals(null)).toBe(false)
      })

      it("should return false when comparing to undefined", () => {
        const event = NormAttachedToPortfolio.create({
          normId: buildEntityId("norm-1"),
          portfolioId: buildEntityId("portfolio-1"),
          minAllocation: buildSignedPercentage("5"),
          targetAllocation: buildSignedPercentage("12"),
          maxAllocation: buildSignedPercentage("20"),
        })

        expect(event.equals(undefined)).toBe(false)
      })
    })
  })
})
