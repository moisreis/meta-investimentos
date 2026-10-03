import { describe, it, expect, afterEach } from "vitest"

import { FundRegistered } from "@/domain/fund/events/fund-registered.event"
import { ValidationError } from "@/errors"
import { EntityId } from "@/value-objects"
import {
  buildCnpj,
  buildEntityId,
  buildSignedPercentage,
  buildUniqueCnpj,
} from "__tests__/__setup__/_factories.setup"
import {
  useFixedClock,
  useRealClock,
  getFixedDate,
} from "__tests__/__setup__/_clock.setup"

describe("domain/fund/events/fund-registered.event", () => {
  afterEach(() => {
    useRealClock()
  })

  describe("FundRegistered", () => {
    describe("create", () => {
      it("should create a valid FundRegistered with required props", () => {
        const fundId = buildEntityId("fund-1")
        const bankId = buildEntityId("bank-1")
        const occurredAt = new Date("2026-03-01T12:00:00.000Z")

        const event = FundRegistered.create({
          fundId,
          cnpj: buildCnpj("11222333000181"),
          name: "Fundo Multi Mercado",
          bankId,
          occurredAt,
        })

        expect(event.id).toBeUndefined()
        expect(event.fundId).toBe(fundId)
        expect(event.cnpj.value).toBe("11222333000181")
        expect(event.name).toBe("Fundo Multi Mercado")
        expect(event.bankId).toBe(bankId)
        expect(event.occurredAt).toEqual(occurredAt)
      })

      it("should create a FundRegistered with provided id", () => {
        const event = FundRegistered.create(
          {
            fundId: buildEntityId("fund-1"),
            cnpj: buildCnpj("11222333000181"),
            name: "Fundo Multi Mercado",
            bankId: buildEntityId("bank-1"),
          },
          "event-fund-registered-1"
        )

        expect(event.id).toBe(
          EntityId.create("event-fund-registered-1")
        )
      })

      it("should leave the id undefined when an empty id is given", () => {
        const event = FundRegistered.create(
          {
            fundId: buildEntityId("fund-1"),
            cnpj: buildCnpj("11222333000181"),
            name: "Fundo Multi Mercado",
            bankId: buildEntityId("bank-1"),
          },
          ""
        )

        expect(event.id).toBeUndefined()
      })

      it("should expose every optional relation when provided", () => {
        const benchmarkId = buildEntityId("benchmark-1")
        const categoryId = buildEntityId("category-1")

        const event = FundRegistered.create({
          fundId: buildEntityId("fund-1"),
          cnpj: buildCnpj("11222333000181"),
          name: "Fundo Multi Mercado",
          bankId: buildEntityId("bank-1"),
          administrationFee: buildSignedPercentage("1.00"),
          performanceFee: buildSignedPercentage("20.00"),
          benchmarkId,
          categoryId,
        })

        expect(event.administrationFee?.value.toFixed(2)).toBe(
          "1.00"
        )
        expect(event.performanceFee?.value.toFixed(2)).toBe(
          "20.00"
        )
        expect(event.benchmarkId).toBe(benchmarkId)
        expect(event.categoryId).toBe(categoryId)
      })

      it("should default the optional fees and relations to null when omitted", () => {
        const event = FundRegistered.create({
          fundId: buildEntityId("fund-1"),
          cnpj: buildCnpj("11222333000181"),
          name: "Fundo Multi Mercado",
          bankId: buildEntityId("bank-1"),
        })

        expect(event.administrationFee).toBeNull()
        expect(event.performanceFee).toBeNull()
        expect(event.benchmarkId).toBeNull()
        expect(event.categoryId).toBeNull()
      })

      it("should default the optional fields to null when explicitly null", () => {
        const event = FundRegistered.create({
          fundId: buildEntityId("fund-1"),
          cnpj: buildCnpj("11222333000181"),
          name: "Fundo Multi Mercado",
          bankId: buildEntityId("bank-1"),
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

      it("should default occurredAt to the current time when omitted", () => {
        useFixedClock()

        const event = FundRegistered.create({
          fundId: buildEntityId("fund-1"),
          cnpj: buildCnpj("11222333000181"),
          name: "Fundo Multi Mercado",
          bankId: buildEntityId("bank-1"),
        })

        expect(event.occurredAt).toEqual(getFixedDate())
      })

      it("should keep the provided occurredAt instead of the current time", () => {
        useFixedClock()

        const occurredAt = new Date("2026-06-01T00:00:00.000Z")

        const event = FundRegistered.create({
          fundId: buildEntityId("fund-1"),
          cnpj: buildCnpj("11222333000181"),
          name: "Fundo Multi Mercado",
          bankId: buildEntityId("bank-1"),
          occurredAt,
        })

        expect(event.occurredAt).toEqual(occurredAt)
        expect(event.occurredAt).not.toEqual(getFixedDate())
      })

      it("should return a new date instance on every occurredAt read", () => {
        const event = FundRegistered.create({
          fundId: buildEntityId("fund-1"),
          cnpj: buildCnpj("11222333000181"),
          name: "Fundo Multi Mercado",
          bankId: buildEntityId("bank-1"),
        })

        expect(event.occurredAt).not.toBe(event.occurredAt)
      })

      it("should throw ValidationError when fundId is missing", () => {
        expect(() =>
          FundRegistered.create({
            cnpj: buildCnpj("11222333000181"),
            name: "Fundo Multi Mercado",
            bankId: buildEntityId("bank-1"),
          } as Parameters<typeof FundRegistered.create>[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when cnpj is missing", () => {
        expect(() =>
          FundRegistered.create({
            fundId: buildEntityId("fund-1"),
            name: "Fundo Multi Mercado",
            bankId: buildEntityId("bank-1"),
          } as Parameters<typeof FundRegistered.create>[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when name is missing", () => {
        expect(() =>
          FundRegistered.create({
            fundId: buildEntityId("fund-1"),
            cnpj: buildCnpj("11222333000181"),
            bankId: buildEntityId("bank-1"),
          } as Parameters<typeof FundRegistered.create>[0])
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when name is blank", () => {
        expect(() =>
          FundRegistered.create({
            fundId: buildEntityId("fund-1"),
            cnpj: buildCnpj("11222333000181"),
            name: "",
            bankId: buildEntityId("bank-1"),
          })
        ).toThrow(ValidationError)

        expect(() =>
          FundRegistered.create({
            fundId: buildEntityId("fund-1"),
            cnpj: buildCnpj("11222333000181"),
            name: "   ",
            bankId: buildEntityId("bank-1"),
          })
        ).toThrow(ValidationError)
      })

      it("should throw ValidationError when bankId is missing", () => {
        expect(() =>
          FundRegistered.create({
            fundId: buildEntityId("fund-1"),
            cnpj: buildCnpj("11222333000181"),
            name: "Fundo Multi Mercado",
          } as Parameters<typeof FundRegistered.create>[0])
        ).toThrow(ValidationError)
      })
    })

    describe("equals", () => {
      it("should return true when comparing the same instance", () => {
        const event = FundRegistered.create({
          fundId: buildEntityId("fund-1"),
          cnpj: buildCnpj("11222333000181"),
          name: "Fundo Multi Mercado",
          bankId: buildEntityId("bank-1"),
        })

        expect(event.equals(event)).toBe(true)
      })

      it("should return true for different instances with the same id", () => {
        const first = FundRegistered.create(
          {
            fundId: buildEntityId("fund-1"),
            cnpj: buildCnpj("11222333000181"),
            name: "Fundo Multi Mercado",
            bankId: buildEntityId("bank-1"),
          },
          "event-shared-id"
        )

        const second = FundRegistered.create(
          {
            fundId: buildEntityId("fund-1"),
            cnpj: buildCnpj("11222333000181"),
            name: "Fundo Multi Mercado",
            bankId: buildEntityId("bank-1"),
          },
          "event-shared-id"
        )

        expect(first.equals(second)).toBe(true)
      })

      it("should return false when the ids differ", () => {
        const first = FundRegistered.create(
          {
            fundId: buildEntityId("fund-1"),
            cnpj: buildCnpj("11222333000181"),
            name: "Fundo Multi Mercado",
            bankId: buildEntityId("bank-1"),
          },
          "event-1"
        )

        const second = FundRegistered.create(
          {
            fundId: buildEntityId("fund-1"),
            cnpj: buildCnpj("11222333000181"),
            name: "Fundo Multi Mercado",
            bankId: buildEntityId("bank-1"),
          },
          "event-2"
        )

        expect(first.equals(second)).toBe(false)
      })

      it("should return true when the id matches and a prop differs", () => {
        const first = FundRegistered.create(
          {
            fundId: buildEntityId("fund-1"),
            cnpj: buildCnpj("11222333000181"),
            name: "Fundo Multi Mercado",
            bankId: buildEntityId("bank-1"),
          },
          "event-1"
        )

        const second = FundRegistered.create(
          {
            fundId: buildEntityId("fund-2"),
            cnpj: buildUniqueCnpj("445556660001"),
            name: "Outro Fundo",
            bankId: buildEntityId("bank-2"),
          },
          "event-1"
        )

        expect(first.name).toBe("Fundo Multi Mercado")
        expect(second.name).toBe("Outro Fundo")
        expect(first.equals(second)).toBe(true)
      })

      it("should return false when this event has no id", () => {
        const first = FundRegistered.create({
          fundId: buildEntityId("fund-1"),
          cnpj: buildCnpj("11222333000181"),
          name: "Fundo Multi Mercado",
          bankId: buildEntityId("bank-1"),
        })

        const second = FundRegistered.create(
          {
            fundId: buildEntityId("fund-1"),
            cnpj: buildCnpj("11222333000181"),
            name: "Fundo Multi Mercado",
            bankId: buildEntityId("bank-1"),
          },
          "event-1"
        )

        expect(first.equals(second)).toBe(false)
      })

      it("should return false when the other event has no id", () => {
        const first = FundRegistered.create(
          {
            fundId: buildEntityId("fund-1"),
            cnpj: buildCnpj("11222333000181"),
            name: "Fundo Multi Mercado",
            bankId: buildEntityId("bank-1"),
          },
          "event-1"
        )

        const second = FundRegistered.create({
          fundId: buildEntityId("fund-1"),
          cnpj: buildCnpj("11222333000181"),
          name: "Fundo Multi Mercado",
          bankId: buildEntityId("bank-1"),
        })

        expect(first.equals(second)).toBe(false)
      })

      it("should return false when comparing to null", () => {
        const event = FundRegistered.create({
          fundId: buildEntityId("fund-1"),
          cnpj: buildCnpj("11222333000181"),
          name: "Fundo Multi Mercado",
          bankId: buildEntityId("bank-1"),
        })

        expect(event.equals(null)).toBe(false)
      })

      it("should return false when comparing to undefined", () => {
        const event = FundRegistered.create({
          fundId: buildEntityId("fund-1"),
          cnpj: buildCnpj("11222333000181"),
          name: "Fundo Multi Mercado",
          bankId: buildEntityId("bank-1"),
        })

        expect(event.equals(undefined)).toBe(false)
      })
    })
  })
})
