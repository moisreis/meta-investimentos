import { describe, it, expect, afterEach } from "vitest"

import { FundUpdated } from "@/domain/fund/events/fund-updated.event"
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

describe("domain/fund/events/fund-updated.event", () => {
  afterEach(() => {
    useRealClock()
  })

  describe("FundUpdated", () => {
    describe("create", () => {
      it("should create a valid FundUpdated with the fund id only", () => {
        const fundId = buildEntityId("fund-1")
        const occurredAt = new Date("2026-03-02T12:00:00.000Z")

        const event = FundUpdated.create({ fundId, occurredAt })

        expect(event.id).toBeUndefined()
        expect(event.fundId).toBe(fundId)
        expect(event.name).toBeUndefined()
        expect(event.administrationFee).toBeUndefined()
        expect(event.performanceFee).toBeUndefined()
        expect(event.benchmarkId).toBeUndefined()
        expect(event.categoryId).toBeUndefined()
        expect(event.occurredAt).toEqual(occurredAt)
      })

      it("should create a FundUpdated with provided id", () => {
        const event = FundUpdated.create(
          { fundId: buildEntityId("fund-1") },
          "event-fund-updated-1"
        )

        expect(event.id).toBe(
          EntityId.create("event-fund-updated-1")
        )
      })

      it("should leave the id undefined when an empty id is given", () => {
        const event = FundUpdated.create(
          { fundId: buildEntityId("fund-1") },
          ""
        )

        expect(event.id).toBeUndefined()
      })

      it("should create a FundUpdated with every optional field changed", () => {
        const benchmarkId = buildEntityId("benchmark-1")
        const categoryId = buildEntityId("category-1")

        const event = FundUpdated.create({
          fundId: buildEntityId("fund-1"),
          name: "Fundo Multi Mercado II",
          administrationFee: buildSignedPercentage("1.50"),
          performanceFee: buildSignedPercentage("15.00"),
          benchmarkId,
          categoryId,
        })

        expect(event.name).toBe("Fundo Multi Mercado II")
        expect(event.administrationFee?.value.toFixed(2)).toBe(
          "1.50"
        )
        expect(event.performanceFee?.value.toFixed(2)).toBe(
          "15.00"
        )
        expect(event.benchmarkId).toBe(benchmarkId)
        expect(event.categoryId).toBe(categoryId)
      })

      it("should keep null for the optional relations when cleared", () => {
        const event = FundUpdated.create({
          fundId: buildEntityId("fund-1"),
          administrationFee: null,
          performanceFee: null,
          benchmarkId: null,
          categoryId: null,
        })

        expect(event.administrationFee).toBeNull()
        expect(event.performanceFee).toBeNull()
        expect(event.benchmarkId).toBeNull()
        expect(event.categoryId).toBeNull()
      })

      it("should keep an explicitly undefined name", () => {
        const event = FundUpdated.create({
          fundId: buildEntityId("fund-1"),
          name: undefined,
        })

        expect(event.name).toBeUndefined()
      })

      it("should default occurredAt to the current time when omitted", () => {
        useFixedClock()

        const event = FundUpdated.create({
          fundId: buildEntityId("fund-1"),
        })

        expect(event.occurredAt).toEqual(getFixedDate())
      })

      it("should keep the provided occurredAt instead of the current time", () => {
        useFixedClock()

        const occurredAt = new Date("2026-06-01T00:00:00.000Z")

        const event = FundUpdated.create({
          fundId: buildEntityId("fund-1"),
          occurredAt,
        })

        expect(event.occurredAt).toEqual(occurredAt)
        expect(event.occurredAt).not.toEqual(getFixedDate())
      })

      it("should return a new date instance on every occurredAt read", () => {
        const event = FundUpdated.create({
          fundId: buildEntityId("fund-1"),
        })

        expect(event.occurredAt).not.toBe(event.occurredAt)
      })

      it("should throw ValidationError when fundId is missing", () => {
        expect(() =>
          FundUpdated.create({
            name: "Fundo Multi Mercado II",
          } as Parameters<typeof FundUpdated.create>[0])
        ).toThrow(ValidationError)
      })
    })

    describe("equals", () => {
      it("should return true when comparing the same instance", () => {
        const event = FundUpdated.create({
          fundId: buildEntityId("fund-1"),
        })

        expect(event.equals(event)).toBe(true)
      })

      it("should return true for different instances with the same id", () => {
        const first = FundUpdated.create(
          { fundId: buildEntityId("fund-1") },
          "event-shared-id"
        )

        const second = FundUpdated.create(
          { fundId: buildEntityId("fund-1") },
          "event-shared-id"
        )

        expect(first.equals(second)).toBe(true)
      })

      it("should return false when the ids differ", () => {
        const first = FundUpdated.create(
          { fundId: buildEntityId("fund-1") },
          "event-1"
        )

        const second = FundUpdated.create(
          { fundId: buildEntityId("fund-1") },
          "event-2"
        )

        expect(first.equals(second)).toBe(false)
      })

      it("should return true when the id matches and a prop differs", () => {
        const first = FundUpdated.create(
          { fundId: buildEntityId("fund-1") },
          "event-1"
        )

        const second = FundUpdated.create(
          {
            fundId: buildEntityId("fund-2"),
            name: "Fundo Multi Mercado II",
          },
          "event-1"
        )

        expect(first.name).toBeUndefined()
        expect(second.name).toBe("Fundo Multi Mercado II")
        expect(first.equals(second)).toBe(true)
      })

      it("should return false when this event has no id", () => {
        const first = FundUpdated.create({
          fundId: buildEntityId("fund-1"),
        })

        const second = FundUpdated.create(
          { fundId: buildEntityId("fund-1") },
          "event-1"
        )

        expect(first.equals(second)).toBe(false)
      })

      it("should return false when the other event has no id", () => {
        const first = FundUpdated.create(
          { fundId: buildEntityId("fund-1") },
          "event-1"
        )

        const second = FundUpdated.create({
          fundId: buildEntityId("fund-1"),
        })

        expect(first.equals(second)).toBe(false)
      })

      it("should return false when comparing to null", () => {
        const event = FundUpdated.create({
          fundId: buildEntityId("fund-1"),
        })

        expect(event.equals(null)).toBe(false)
      })

      it("should return false when comparing to undefined", () => {
        const event = FundUpdated.create({
          fundId: buildEntityId("fund-1"),
        })

        expect(event.equals(undefined)).toBe(false)
      })
    })
  })
})
