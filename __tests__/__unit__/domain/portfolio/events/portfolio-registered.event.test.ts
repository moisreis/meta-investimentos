import { describe, it, expect, afterEach } from "vitest"

import { PortfolioRegistered } from "@/domain/portfolio/events/portfolio-registered.event"
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

describe("domain/portfolio/events/portfolio-registered.event", () => {
  afterEach(() => {
    useRealClock()
  })

  describe("PortfolioRegistered", () => {
    describe("create", () => {
      it("should create a valid PortfolioRegistered with required props", () => {
        const portfolioId = buildEntityId("portfolio-1")
        const userId = buildEntityId("user-1")
        const occurredAt = new Date("2026-04-10T12:00:00.000Z")

        const event = PortfolioRegistered.create({
          portfolioId,
          userId,
          acronym: "FIA",
          name: "Fundo de Investimento em Ações",
          annualInterestRate: buildSignedPercentage("10.5"),
          minAllocation: buildSignedPercentage("5"),
          targetAllocation: buildSignedPercentage("12"),
          maxAllocation: buildSignedPercentage("20"),
          occurredAt,
        })

        expect(event.id).toBeUndefined()
        expect(event.portfolioId).toBe(portfolioId)
        expect(event.userId).toBe(userId)
        expect(event.acronym).toBe("FIA")
        expect(event.name).toBe("Fundo de Investimento em Ações")
        expect(event.annualInterestRate.value.toFixed(2)).toBe(
          "10.50"
        )
        expect(event.minAllocation.value.toFixed(2)).toBe("5.00")
        expect(event.targetAllocation.value.toFixed(2)).toBe(
          "12.00"
        )
        expect(event.maxAllocation.value.toFixed(2)).toBe(
          "20.00"
        )
        expect(event.occurredAt).toEqual(occurredAt)
      })

      it("should create a PortfolioRegistered with provided id", () => {
        const event = PortfolioRegistered.create(
          {
            portfolioId: buildEntityId("portfolio-1"),
            userId: buildEntityId("user-1"),
            acronym: "FIA",
            name: "Fundo de Investimento em Ações",
            annualInterestRate: buildSignedPercentage("10.5"),
            minAllocation: buildSignedPercentage("5"),
            targetAllocation: buildSignedPercentage("12"),
            maxAllocation: buildSignedPercentage("20"),
          },
          "event-portfolio-registered-1"
        )

        expect(event.id).toBe(
          EntityId.create("event-portfolio-registered-1")
        )
      })

      it("should leave the id undefined when an empty id is given", () => {
        const event = PortfolioRegistered.create(
          {
            portfolioId: buildEntityId("portfolio-1"),
            userId: buildEntityId("user-1"),
            acronym: "FIA",
            name: "Fundo de Investimento em Ações",
            annualInterestRate: buildSignedPercentage("10.5"),
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

        const event = PortfolioRegistered.create({
          portfolioId: buildEntityId("portfolio-1"),
          userId: buildEntityId("user-1"),
          acronym: "FIA",
          name: "Fundo de Investimento em Ações",
          annualInterestRate: buildSignedPercentage("10.5"),
          minAllocation: buildSignedPercentage("5"),
          targetAllocation: buildSignedPercentage("12"),
          maxAllocation: buildSignedPercentage("20"),
        })

        expect(event.occurredAt).toEqual(getFixedDate())
      })

      it("should keep the provided occurredAt instead of the current time", () => {
        useFixedClock()

        const occurredAt = new Date("2026-08-08T08:08:08.000Z")

        const event = PortfolioRegistered.create({
          portfolioId: buildEntityId("portfolio-1"),
          userId: buildEntityId("user-1"),
          acronym: "FIA",
          name: "Fundo de Investimento em Ações",
          annualInterestRate: buildSignedPercentage("10.5"),
          minAllocation: buildSignedPercentage("5"),
          targetAllocation: buildSignedPercentage("12"),
          maxAllocation: buildSignedPercentage("20"),
          occurredAt,
        })

        expect(event.occurredAt).toEqual(occurredAt)
        expect(event.occurredAt).not.toEqual(getFixedDate())
      })

      it("should return a new date instance on every occurredAt read", () => {
        const event = PortfolioRegistered.create({
          portfolioId: buildEntityId("portfolio-1"),
          userId: buildEntityId("user-1"),
          acronym: "FIA",
          name: "Fundo de Investimento em Ações",
          annualInterestRate: buildSignedPercentage("10.5"),
          minAllocation: buildSignedPercentage("5"),
          targetAllocation: buildSignedPercentage("12"),
          maxAllocation: buildSignedPercentage("20"),
        })

        expect(event.occurredAt).not.toBe(event.occurredAt)
      })

      it("should accept equal allocation bounds", () => {
        const event = PortfolioRegistered.create({
          portfolioId: buildEntityId("portfolio-1"),
          userId: buildEntityId("user-1"),
          acronym: "FIA",
          name: "Fundo de Investimento em Ações",
          annualInterestRate: buildSignedPercentage("10.5"),
          minAllocation: buildSignedPercentage("15"),
          targetAllocation: buildSignedPercentage("15"),
          maxAllocation: buildSignedPercentage("15"),
        })

        expect(event.minAllocation.value.toFixed(2)).toBe(
          "15.00"
        )
        expect(event.targetAllocation.value.toFixed(2)).toBe(
          "15.00"
        )
        expect(event.maxAllocation.value.toFixed(2)).toBe(
          "15.00"
        )
      })

      it("should throw ValidationError when portfolioId is missing", () => {
        expect(() =>
          PortfolioRegistered.create({
            userId: buildEntityId("user-1"),
            acronym: "FIA",
            name: "Fundo de Investimento em Ações",
            annualInterestRate: buildSignedPercentage("10.5"),
            minAllocation: buildSignedPercentage("5"),
            targetAllocation: buildSignedPercentage("12"),
            maxAllocation: buildSignedPercentage("20"),
          } as Parameters<typeof PortfolioRegistered.create>[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when userId is missing", () => {
        expect(() =>
          PortfolioRegistered.create({
            portfolioId: buildEntityId("portfolio-1"),
            acronym: "FIA",
            name: "Fundo de Investimento em Ações",
            annualInterestRate: buildSignedPercentage("10.5"),
            minAllocation: buildSignedPercentage("5"),
            targetAllocation: buildSignedPercentage("12"),
            maxAllocation: buildSignedPercentage("20"),
          } as Parameters<typeof PortfolioRegistered.create>[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when acronym is missing", () => {
        expect(() =>
          PortfolioRegistered.create({
            portfolioId: buildEntityId("portfolio-1"),
            userId: buildEntityId("user-1"),
            name: "Fundo de Investimento em Ações",
            annualInterestRate: buildSignedPercentage("10.5"),
            minAllocation: buildSignedPercentage("5"),
            targetAllocation: buildSignedPercentage("12"),
            maxAllocation: buildSignedPercentage("20"),
          } as Parameters<typeof PortfolioRegistered.create>[0])
        ).toThrow(ValidationError)

        expect(() =>
          PortfolioRegistered.create({
            portfolioId: buildEntityId("portfolio-1"),
            userId: buildEntityId("user-1"),
            acronym: "",
            name: "Fundo de Investimento em Ações",
            annualInterestRate: buildSignedPercentage("10.5"),
            minAllocation: buildSignedPercentage("5"),
            targetAllocation: buildSignedPercentage("12"),
            maxAllocation: buildSignedPercentage("20"),
          })
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when name is missing", () => {
        expect(() =>
          PortfolioRegistered.create({
            portfolioId: buildEntityId("portfolio-1"),
            userId: buildEntityId("user-1"),
            acronym: "FIA",
            annualInterestRate: buildSignedPercentage("10.5"),
            minAllocation: buildSignedPercentage("5"),
            targetAllocation: buildSignedPercentage("12"),
            maxAllocation: buildSignedPercentage("20"),
          } as Parameters<typeof PortfolioRegistered.create>[0])
        ).toThrow(ValidationError)

        expect(() =>
          PortfolioRegistered.create({
            portfolioId: buildEntityId("portfolio-1"),
            userId: buildEntityId("user-1"),
            acronym: "FIA",
            name: "",
            annualInterestRate: buildSignedPercentage("10.5"),
            minAllocation: buildSignedPercentage("5"),
            targetAllocation: buildSignedPercentage("12"),
            maxAllocation: buildSignedPercentage("20"),
          })
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when annualInterestRate is missing", () => {
        expect(() =>
          PortfolioRegistered.create({
            portfolioId: buildEntityId("portfolio-1"),
            userId: buildEntityId("user-1"),
            acronym: "FIA",
            name: "Fundo de Investimento em Ações",
            minAllocation: buildSignedPercentage("5"),
            targetAllocation: buildSignedPercentage("12"),
            maxAllocation: buildSignedPercentage("20"),
          } as Parameters<typeof PortfolioRegistered.create>[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when minAllocation is missing", () => {
        expect(() =>
          PortfolioRegistered.create({
            portfolioId: buildEntityId("portfolio-1"),
            userId: buildEntityId("user-1"),
            acronym: "FIA",
            name: "Fundo de Investimento em Ações",
            annualInterestRate: buildSignedPercentage("10.5"),
            targetAllocation: buildSignedPercentage("12"),
            maxAllocation: buildSignedPercentage("20"),
          } as Parameters<typeof PortfolioRegistered.create>[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when targetAllocation is missing", () => {
        expect(() =>
          PortfolioRegistered.create({
            portfolioId: buildEntityId("portfolio-1"),
            userId: buildEntityId("user-1"),
            acronym: "FIA",
            name: "Fundo de Investimento em Ações",
            annualInterestRate: buildSignedPercentage("10.5"),
            minAllocation: buildSignedPercentage("5"),
            maxAllocation: buildSignedPercentage("20"),
          } as Parameters<typeof PortfolioRegistered.create>[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when maxAllocation is missing", () => {
        expect(() =>
          PortfolioRegistered.create({
            portfolioId: buildEntityId("portfolio-1"),
            userId: buildEntityId("user-1"),
            acronym: "FIA",
            name: "Fundo de Investimento em Ações",
            annualInterestRate: buildSignedPercentage("10.5"),
            minAllocation: buildSignedPercentage("5"),
            targetAllocation: buildSignedPercentage("12"),
          } as Parameters<typeof PortfolioRegistered.create>[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when minAllocation is above targetAllocation", () => {
        expect(() =>
          PortfolioRegistered.create({
            portfolioId: buildEntityId("portfolio-1"),
            userId: buildEntityId("user-1"),
            acronym: "FIA",
            name: "Fundo de Investimento em Ações",
            annualInterestRate: buildSignedPercentage("10.5"),
            minAllocation: buildSignedPercentage("30"),
            targetAllocation: buildSignedPercentage("12"),
            maxAllocation: buildSignedPercentage("40"),
          })
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when targetAllocation is above maxAllocation", () => {
        expect(() =>
          PortfolioRegistered.create({
            portfolioId: buildEntityId("portfolio-1"),
            userId: buildEntityId("user-1"),
            acronym: "FIA",
            name: "Fundo de Investimento em Ações",
            annualInterestRate: buildSignedPercentage("10.5"),
            minAllocation: buildSignedPercentage("5"),
            targetAllocation: buildSignedPercentage("45"),
            maxAllocation: buildSignedPercentage("40"),
          })
        ).toThrow(ValidationError)
      })
    })

    describe("equals", () => {
      it("should return true when comparing the same instance", () => {
        const event = PortfolioRegistered.create({
          portfolioId: buildEntityId("portfolio-1"),
          userId: buildEntityId("user-1"),
          acronym: "FIA",
          name: "Fundo de Investimento em Ações",
          annualInterestRate: buildSignedPercentage("10.5"),
          minAllocation: buildSignedPercentage("5"),
          targetAllocation: buildSignedPercentage("12"),
          maxAllocation: buildSignedPercentage("20"),
        })

        expect(event.equals(event)).toBe(true)
      })

      it("should return true for different instances with the same id", () => {
        const first = PortfolioRegistered.create(
          {
            portfolioId: buildEntityId("portfolio-1"),
            userId: buildEntityId("user-1"),
            acronym: "FIA",
            name: "Fundo de Investimento em Ações",
            annualInterestRate: buildSignedPercentage("10.5"),
            minAllocation: buildSignedPercentage("5"),
            targetAllocation: buildSignedPercentage("12"),
            maxAllocation: buildSignedPercentage("20"),
          },
          "event-shared-id"
        )

        const second = PortfolioRegistered.create(
          {
            portfolioId: buildEntityId("portfolio-1"),
            userId: buildEntityId("user-1"),
            acronym: "FIA",
            name: "Fundo de Investimento em Ações",
            annualInterestRate: buildSignedPercentage("10.5"),
            minAllocation: buildSignedPercentage("5"),
            targetAllocation: buildSignedPercentage("12"),
            maxAllocation: buildSignedPercentage("20"),
          },
          "event-shared-id"
        )

        expect(first.equals(second)).toBe(true)
      })

      it("should return false when the ids differ", () => {
        const first = PortfolioRegistered.create(
          {
            portfolioId: buildEntityId("portfolio-1"),
            userId: buildEntityId("user-1"),
            acronym: "FIA",
            name: "Fundo de Investimento em Ações",
            annualInterestRate: buildSignedPercentage("10.5"),
            minAllocation: buildSignedPercentage("5"),
            targetAllocation: buildSignedPercentage("12"),
            maxAllocation: buildSignedPercentage("20"),
          },
          "event-1"
        )

        const second = PortfolioRegistered.create(
          {
            portfolioId: buildEntityId("portfolio-1"),
            userId: buildEntityId("user-1"),
            acronym: "FIA",
            name: "Fundo de Investimento em Ações",
            annualInterestRate: buildSignedPercentage("10.5"),
            minAllocation: buildSignedPercentage("5"),
            targetAllocation: buildSignedPercentage("12"),
            maxAllocation: buildSignedPercentage("20"),
          },
          "event-2"
        )

        expect(first.equals(second)).toBe(false)
      })

      it("should return true when the id matches and a prop differs", () => {
        const first = PortfolioRegistered.create(
          {
            portfolioId: buildEntityId("portfolio-1"),
            userId: buildEntityId("user-1"),
            acronym: "FIA",
            name: "Fundo de Investimento em Ações",
            annualInterestRate: buildSignedPercentage("10.5"),
            minAllocation: buildSignedPercentage("5"),
            targetAllocation: buildSignedPercentage("12"),
            maxAllocation: buildSignedPercentage("20"),
          },
          "event-1"
        )

        const second = PortfolioRegistered.create(
          {
            portfolioId: buildEntityId("portfolio-4"),
            userId: buildEntityId("user-4"),
            acronym: "FIQ",
            name: "Fundo de Investimento em Quotas",
            annualInterestRate: buildSignedPercentage("9.25"),
            minAllocation: buildSignedPercentage("1"),
            targetAllocation: buildSignedPercentage("2"),
            maxAllocation: buildSignedPercentage("3"),
          },
          "event-1"
        )

        expect(first.acronym).toBe("FIA")
        expect(second.acronym).toBe("FIQ")
        expect(first.equals(second)).toBe(true)
      })

      it("should return false when this event has no id", () => {
        const first = PortfolioRegistered.create({
          portfolioId: buildEntityId("portfolio-1"),
          userId: buildEntityId("user-1"),
          acronym: "FIA",
          name: "Fundo de Investimento em Ações",
          annualInterestRate: buildSignedPercentage("10.5"),
          minAllocation: buildSignedPercentage("5"),
          targetAllocation: buildSignedPercentage("12"),
          maxAllocation: buildSignedPercentage("20"),
        })

        const second = PortfolioRegistered.create(
          {
            portfolioId: buildEntityId("portfolio-1"),
            userId: buildEntityId("user-1"),
            acronym: "FIA",
            name: "Fundo de Investimento em Ações",
            annualInterestRate: buildSignedPercentage("10.5"),
            minAllocation: buildSignedPercentage("5"),
            targetAllocation: buildSignedPercentage("12"),
            maxAllocation: buildSignedPercentage("20"),
          },
          "event-1"
        )

        expect(first.equals(second)).toBe(false)
      })

      it("should return false when the other event has no id", () => {
        const first = PortfolioRegistered.create(
          {
            portfolioId: buildEntityId("portfolio-1"),
            userId: buildEntityId("user-1"),
            acronym: "FIA",
            name: "Fundo de Investimento em Ações",
            annualInterestRate: buildSignedPercentage("10.5"),
            minAllocation: buildSignedPercentage("5"),
            targetAllocation: buildSignedPercentage("12"),
            maxAllocation: buildSignedPercentage("20"),
          },
          "event-1"
        )

        const second = PortfolioRegistered.create({
          portfolioId: buildEntityId("portfolio-1"),
          userId: buildEntityId("user-1"),
          acronym: "FIA",
          name: "Fundo de Investimento em Ações",
          annualInterestRate: buildSignedPercentage("10.5"),
          minAllocation: buildSignedPercentage("5"),
          targetAllocation: buildSignedPercentage("12"),
          maxAllocation: buildSignedPercentage("20"),
        })

        expect(first.equals(second)).toBe(false)
      })

      it("should return false when comparing to null", () => {
        const event = PortfolioRegistered.create({
          portfolioId: buildEntityId("portfolio-1"),
          userId: buildEntityId("user-1"),
          acronym: "FIA",
          name: "Fundo de Investimento em Ações",
          annualInterestRate: buildSignedPercentage("10.5"),
          minAllocation: buildSignedPercentage("5"),
          targetAllocation: buildSignedPercentage("12"),
          maxAllocation: buildSignedPercentage("20"),
        })

        expect(event.equals(null)).toBe(false)
      })

      it("should return false when comparing to undefined", () => {
        const event = PortfolioRegistered.create({
          portfolioId: buildEntityId("portfolio-1"),
          userId: buildEntityId("user-1"),
          acronym: "FIA",
          name: "Fundo de Investimento em Ações",
          annualInterestRate: buildSignedPercentage("10.5"),
          minAllocation: buildSignedPercentage("5"),
          targetAllocation: buildSignedPercentage("12"),
          maxAllocation: buildSignedPercentage("20"),
        })

        expect(event.equals(undefined)).toBe(false)
      })
    })
  })
})
