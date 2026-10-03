import { describe, it, expect, afterEach } from "vitest"

import { PortfolioAllocationUpdated } from "@/domain/portfolio/events/portfolio-allocation-updated.event"
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

describe("domain/portfolio/events/portfolio-allocation-updated.event", () => {
  afterEach(() => {
    useRealClock()
  })

  describe("PortfolioAllocationUpdated", () => {
    describe("create", () => {
      it("should create a valid PortfolioAllocationUpdated with the portfolio id only", () => {
        const portfolioId = buildEntityId("portfolio-1")
        const occurredAt = new Date("2026-04-10T12:00:00.000Z")

        const event = PortfolioAllocationUpdated.create({
          portfolioId,
          occurredAt,
        })

        expect(event.id).toBeUndefined()
        expect(event.portfolioId).toBe(portfolioId)
        expect(event.minAllocation).toBeUndefined()
        expect(event.targetAllocation).toBeUndefined()
        expect(event.maxAllocation).toBeUndefined()
        expect(event.annualInterestRate).toBeUndefined()
        expect(event.occurredAt).toEqual(occurredAt)
      })

      it("should create a PortfolioAllocationUpdated with provided id", () => {
        const event = PortfolioAllocationUpdated.create(
          { portfolioId: buildEntityId("portfolio-1") },
          "event-allocation-updated-1"
        )

        expect(event.id).toBe(
          EntityId.create("event-allocation-updated-1")
        )
      })

      it("should leave the id undefined when an empty id is given", () => {
        const event = PortfolioAllocationUpdated.create(
          { portfolioId: buildEntityId("portfolio-1") },
          ""
        )

        expect(event.id).toBeUndefined()
      })

      it("should create a PortfolioAllocationUpdated with every optional field changed", () => {
        const event = PortfolioAllocationUpdated.create({
          portfolioId: buildEntityId("portfolio-1"),
          minAllocation: buildSignedPercentage("3"),
          targetAllocation: buildSignedPercentage("15"),
          maxAllocation: buildSignedPercentage("25"),
          annualInterestRate: buildSignedPercentage("10.5"),
        })

        expect(event.minAllocation?.value.toFixed(2)).toBe(
          "3.00"
        )
        expect(event.targetAllocation?.value.toFixed(2)).toBe(
          "15.00"
        )
        expect(event.maxAllocation?.value.toFixed(2)).toBe(
          "25.00"
        )
        expect(event.annualInterestRate?.value.toFixed(2)).toBe(
          "10.50"
        )
      })

      it("should carry only the fields that changed", () => {
        const event = PortfolioAllocationUpdated.create({
          portfolioId: buildEntityId("portfolio-1"),
          targetAllocation: buildSignedPercentage("18"),
        })

        expect(event.targetAllocation?.value.toFixed(2)).toBe(
          "18.00"
        )
        expect(event.minAllocation).toBeUndefined()
        expect(event.maxAllocation).toBeUndefined()
        expect(event.annualInterestRate).toBeUndefined()
      })

      it("should keep explicitly undefined optional fields", () => {
        const event = PortfolioAllocationUpdated.create({
          portfolioId: buildEntityId("portfolio-1"),
          minAllocation: undefined,
          targetAllocation: undefined,
          maxAllocation: undefined,
          annualInterestRate: undefined,
        })

        expect(event.minAllocation).toBeUndefined()
        expect(event.targetAllocation).toBeUndefined()
        expect(event.maxAllocation).toBeUndefined()
        expect(event.annualInterestRate).toBeUndefined()
      })

      it("should default occurredAt to the current time when omitted", () => {
        useFixedClock()

        const event = PortfolioAllocationUpdated.create({
          portfolioId: buildEntityId("portfolio-1"),
        })

        expect(event.occurredAt).toEqual(getFixedDate())
      })

      it("should keep the provided occurredAt instead of the current time", () => {
        useFixedClock()

        const occurredAt = new Date("2026-07-07T07:07:07.000Z")

        const event = PortfolioAllocationUpdated.create({
          portfolioId: buildEntityId("portfolio-1"),
          occurredAt,
        })

        expect(event.occurredAt).toEqual(occurredAt)
        expect(event.occurredAt).not.toEqual(getFixedDate())
      })

      it("should return a new date instance on every occurredAt read", () => {
        const event = PortfolioAllocationUpdated.create({
          portfolioId: buildEntityId("portfolio-1"),
        })

        expect(event.occurredAt).not.toBe(event.occurredAt)
      })

      it("should throw ValidationError when portfolioId is missing", () => {
        expect(() =>
          PortfolioAllocationUpdated.create({
            minAllocation: buildSignedPercentage("3"),
          } as Parameters<
            typeof PortfolioAllocationUpdated.create
          >[0])
        ).toThrow(ValidationError)
      })
    })

    describe("equals", () => {
      it("should return true when comparing the same instance", () => {
        const event = PortfolioAllocationUpdated.create({
          portfolioId: buildEntityId("portfolio-1"),
        })

        expect(event.equals(event)).toBe(true)
      })

      it("should return true for different instances with the same id", () => {
        const first = PortfolioAllocationUpdated.create(
          { portfolioId: buildEntityId("portfolio-1") },
          "event-shared-id"
        )

        const second = PortfolioAllocationUpdated.create(
          { portfolioId: buildEntityId("portfolio-1") },
          "event-shared-id"
        )

        expect(first.equals(second)).toBe(true)
      })

      it("should return false when the ids differ", () => {
        const first = PortfolioAllocationUpdated.create(
          { portfolioId: buildEntityId("portfolio-1") },
          "event-1"
        )

        const second = PortfolioAllocationUpdated.create(
          { portfolioId: buildEntityId("portfolio-1") },
          "event-2"
        )

        expect(first.equals(second)).toBe(false)
      })

      it("should return true when the id matches and a prop differs", () => {
        const first = PortfolioAllocationUpdated.create(
          {
            portfolioId: buildEntityId("portfolio-1"),
            targetAllocation: buildSignedPercentage("10"),
          },
          "event-1"
        )

        const second = PortfolioAllocationUpdated.create(
          {
            portfolioId: buildEntityId("portfolio-2"),
            targetAllocation: buildSignedPercentage("20"),
          },
          "event-1"
        )

        expect(first.targetAllocation?.value.toFixed(2)).toBe(
          "10.00"
        )
        expect(second.targetAllocation?.value.toFixed(2)).toBe(
          "20.00"
        )
        expect(first.equals(second)).toBe(true)
      })

      it("should return false when this event has no id", () => {
        const first = PortfolioAllocationUpdated.create({
          portfolioId: buildEntityId("portfolio-1"),
        })

        const second = PortfolioAllocationUpdated.create(
          { portfolioId: buildEntityId("portfolio-1") },
          "event-1"
        )

        expect(first.equals(second)).toBe(false)
      })

      it("should return false when the other event has no id", () => {
        const first = PortfolioAllocationUpdated.create(
          { portfolioId: buildEntityId("portfolio-1") },
          "event-1"
        )

        const second = PortfolioAllocationUpdated.create({
          portfolioId: buildEntityId("portfolio-1"),
        })

        expect(first.equals(second)).toBe(false)
      })

      it("should return false when comparing to null", () => {
        const event = PortfolioAllocationUpdated.create({
          portfolioId: buildEntityId("portfolio-1"),
        })

        expect(event.equals(null)).toBe(false)
      })

      it("should return false when comparing to undefined", () => {
        const event = PortfolioAllocationUpdated.create({
          portfolioId: buildEntityId("portfolio-1"),
        })

        expect(event.equals(undefined)).toBe(false)
      })
    })
  })
})
