import { describe, it, expect } from "vitest"

import { Application } from "@/domain/application/entities/application.entity"
import { ValidationError } from "@/errors"
import { EntityId } from "@/value-objects"
import { PositiveMoney } from "@/value-objects/positive-money.vo"
import { QuotaQuantity } from "@/value-objects/quota-quantity.vo"
import { buildApplication } from "__tests__/__setup__/_factories.setup"

const PERSISTED_ID = EntityId.create("application-123")
const NOW = new Date("2026-06-15T10:00:00.000Z")

describe("Application", () => {
  describe("create", () => {
    it("should create a valid Application with required props", () => {
      const date = new Date("2026-01-15")

      const application = Application.create({
        positionId: EntityId.create("position-1"),
        date,
        amount: PositiveMoney.create("1000.00"),
        quotas: QuotaQuantity.create("100.00"),
      })

      expect(application.positionId).toBe(
        EntityId.create("position-1")
      )
      expect(application.date).toEqual(date)
      expect(application.amount.value.toFixed(2)).toBe("1000.00")
      expect(application.quotas.value.toFixed(2)).toBe("100.00")
      expect(application.reversedAt).toBeNull()
      expect(application.reversedByUserId).toBeNull()
      expect(application.version).toBe(0)
      expect(application.id).toBeUndefined()
    })

    it("should create an Application with provided id", () => {
      const application = Application.create(
        {
          positionId: EntityId.create("position-1"),
          date: new Date("2026-01-15"),
          amount: PositiveMoney.create("1000.00"),
          quotas: QuotaQuantity.create("100.00"),
        },
        PERSISTED_ID
      )

      expect(application.id).toBe(PERSISTED_ID)
    })

    it("should create an Application with optional reversal props", () => {
      const reversedAt = new Date("2026-02-01T00:00:00.000Z")

      const application = Application.create({
        positionId: EntityId.create("position-1"),
        date: new Date("2026-01-15"),
        amount: PositiveMoney.create("1000.00"),
        quotas: QuotaQuantity.create("100.00"),
        reversedAt,
        reversedByUserId: EntityId.create("user-1"),
      })

      expect(application.reversedAt).toEqual(reversedAt)
      expect(application.reversedByUserId).toBe(
        EntityId.create("user-1")
      )
    })

    it("should throw ValidationError when positionId is blank", () => {
      expect(() =>
        Application.create({
          positionId: EntityId.create("   "),
          date: new Date("2026-01-15"),
          amount: PositiveMoney.create("1000.00"),
          quotas: QuotaQuantity.create("100.00"),
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when date is missing", () => {
      expect(() =>
        Application.create({
          positionId: EntityId.create("position-1"),
          amount: PositiveMoney.create("1000.00"),
          quotas: QuotaQuantity.create("100.00"),
        } as Parameters<typeof Application.create>[0])
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when amount is missing", () => {
      expect(() =>
        Application.create({
          positionId: EntityId.create("position-1"),
          date: new Date("2026-01-15"),
          quotas: QuotaQuantity.create("100.00"),
        } as Parameters<typeof Application.create>[0])
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when quotas is missing", () => {
      expect(() =>
        Application.create({
          positionId: EntityId.create("position-1"),
          date: new Date("2026-01-15"),
          amount: PositiveMoney.create("1000.00"),
        } as Parameters<typeof Application.create>[0])
      ).toThrow(ValidationError)
    })
  })

  describe("reverse", () => {
    it("should return new Application with reversal data when persisted", () => {
      const application = buildApplication({ id: PERSISTED_ID })

      const reversed = application.reverse(
        EntityId.create("user-1"),
        NOW
      )

      expect(reversed.reversedAt).toEqual(NOW)
      expect(reversed.reversedByUserId).toBe(
        EntityId.create("user-1")
      )
      expect(reversed.updatedAt).toEqual(NOW)
      expect(reversed.id).toBe(PERSISTED_ID)
    })

    it("should keep the original Application unchanged", () => {
      const application = buildApplication({ id: PERSISTED_ID })

      application.reverse(EntityId.create("user-1"), NOW)

      expect(application.reversedAt).toBeNull()
      expect(application.reversedByUserId).toBeNull()
    })

    it("should throw ValidationError when not persisted", () => {
      const application = buildApplication()

      expect(() =>
        application.reverse(EntityId.create("user-1"), NOW)
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when already reversed", () => {
      const application = buildApplication({
        id: PERSISTED_ID,
        reversedAt: new Date("2026-02-01T00:00:00.000Z"),
      })

      expect(() =>
        application.reverse(EntityId.create("user-1"), NOW)
      ).toThrow(ValidationError)
    })
  })

  describe("equals", () => {
    it("should return true when comparing the same instance", () => {
      const application = buildApplication()

      expect(application.equals(application)).toBe(true)
    })

    it("should return true when instances share the same id", () => {
      const first = buildApplication({ id: PERSISTED_ID })
      const second = buildApplication({ id: PERSISTED_ID })

      expect(first.equals(second)).toBe(true)
    })

    it("should return false when ids differ", () => {
      const first = buildApplication({
        id: EntityId.create("application-1"),
      })
      const second = buildApplication({
        id: EntityId.create("application-2"),
      })

      expect(first.equals(second)).toBe(false)
    })

    it("should return false when this has no id", () => {
      const first = buildApplication()
      const second = buildApplication({ id: PERSISTED_ID })

      expect(first.equals(second)).toBe(false)
    })

    it("should return false when other has no id", () => {
      const first = buildApplication({ id: PERSISTED_ID })
      const second = buildApplication()

      expect(first.equals(second)).toBe(false)
    })

    it("should return false when other is null", () => {
      const application = buildApplication()

      expect(application.equals(null)).toBe(false)
    })

    it("should return false when other is undefined", () => {
      const application = buildApplication()

      expect(application.equals(undefined)).toBe(false)
    })
  })

  describe("immutability", () => {
    it("should not allow direct property mutation", () => {
      const application = buildApplication()

      expect(() => {
        // @ts-expect-error - exercising runtime immutability
        application.amount = PositiveMoney.create("9999.00")
      }).toThrow(TypeError)
    })

    it("should return new instances on mutations", () => {
      const application = buildApplication({ id: PERSISTED_ID })

      const reversed = application.reverse(
        EntityId.create("user-1"),
        NOW
      )

      expect(reversed).not.toBe(application)
    })
  })
})
