import { describe, it, expect } from "vitest"

import { Quota } from "@/domain/quota/entities/quota.entity"
import { ValidationError } from "@/errors"
import { EntityId } from "@/value-objects"
import { QuotaPrice } from "@/value-objects/quota-price.vo"
import { buildQuota } from "__tests__/__setup__/_factories.setup"

const PERSISTED_ID = EntityId.create("quota-123")

describe("Quota", () => {
  describe("create", () => {
    it("should create a valid Quota with required props", () => {
      const date = new Date("2026-01-15")
      const quota = Quota.create({
        fundId: EntityId.create("fund-1"),
        date,
        price: QuotaPrice.create("10.50"),
      })

      expect(quota.fundId).toBe(EntityId.create("fund-1"))
      expect(quota.date).toEqual(date)
      expect(quota.price.value.toFixed(2)).toBe("10.50")
      expect(quota.id).toBeUndefined()
    })

    it("should create a Quota with provided id", () => {
      const quota = Quota.create(
        {
          fundId: EntityId.create("fund-1"),
          date: new Date("2026-01-15"),
          price: QuotaPrice.create("10.50"),
        },
        PERSISTED_ID
      )

      expect(quota.id).toBe(PERSISTED_ID)
    })

    it("should create a Quota with custom createdAt", () => {
      const createdAt = new Date("2026-01-01T00:00:00.000Z")
      const quota = Quota.create({
        fundId: EntityId.create("fund-1"),
        date: new Date("2026-01-15"),
        price: QuotaPrice.create("10.50"),
        createdAt,
      })

      expect(quota.createdAt).toEqual(createdAt)
    })

    it("should throw ValidationError when fundId is blank", () => {
      expect(() =>
        Quota.create({
          fundId: EntityId.create("   "),
          date: new Date("2026-01-15"),
          price: QuotaPrice.create("10.50"),
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when date is missing", () => {
      expect(() =>
        Quota.create({
          fundId: EntityId.create("fund-1"),
          price: QuotaPrice.create("10.50"),
        } as Parameters<typeof Quota.create>[0])
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when price is missing", () => {
      expect(() =>
        Quota.create({
          fundId: EntityId.create("fund-1"),
          date: new Date("2026-01-15"),
        } as Parameters<typeof Quota.create>[0])
      ).toThrow(ValidationError)
    })
  })

  describe("updatePrice", () => {
    it("should return new Quota with updated price", () => {
      const quota = buildQuota({ id: PERSISTED_ID })

      const updated = quota.updatePrice(
        QuotaPrice.create("12.75")
      )

      expect(updated.price.value.toFixed(2)).toBe("12.75")
      expect(updated.id).toBe(PERSISTED_ID)
    })

    it("should keep the original Quota unchanged", () => {
      const quota = buildQuota({
        id: PERSISTED_ID,
        price: QuotaPrice.create("10.50"),
      })

      quota.updatePrice(QuotaPrice.create("12.75"))

      expect(quota.price.value.toFixed(2)).toBe("10.50")
    })

    it("should throw ValidationError when price is missing", () => {
      const quota = buildQuota()

      expect(() =>
        quota.updatePrice(null as unknown as QuotaPrice)
      ).toThrow(ValidationError)
    })
  })

  describe("equals", () => {
    it("should return true when comparing the same instance", () => {
      const quota = buildQuota()

      expect(quota.equals(quota)).toBe(true)
    })

    it("should return true when instances share the same id", () => {
      const first = buildQuota({ id: PERSISTED_ID })
      const second = buildQuota({ id: PERSISTED_ID })

      expect(first.equals(second)).toBe(true)
    })

    it("should return false when ids differ", () => {
      const first = buildQuota({
        id: EntityId.create("quota-1"),
      })
      const second = buildQuota({
        id: EntityId.create("quota-2"),
      })

      expect(first.equals(second)).toBe(false)
    })

    it("should return false when this has no id", () => {
      const first = buildQuota()
      const second = buildQuota({ id: PERSISTED_ID })

      expect(first.equals(second)).toBe(false)
    })

    it("should return false when other has no id", () => {
      const first = buildQuota({ id: PERSISTED_ID })
      const second = buildQuota()

      expect(first.equals(second)).toBe(false)
    })

    it("should return false when other is null", () => {
      const quota = buildQuota()

      expect(quota.equals(null)).toBe(false)
    })

    it("should return false when other is undefined", () => {
      const quota = buildQuota()

      expect(quota.equals(undefined)).toBe(false)
    })
  })

  describe("immutability", () => {
    it("should not allow direct property mutation", () => {
      const quota = buildQuota()

      expect(() => {
        // @ts-expect-error - exercising runtime immutability
        quota.price = QuotaPrice.create("99.99")
      }).toThrow(TypeError)
    })

    it("should return new instances on mutations", () => {
      const quota = buildQuota({ id: PERSISTED_ID })

      const updated = quota.updatePrice(
        QuotaPrice.create("12.75")
      )

      expect(updated).not.toBe(quota)
    })
  })
})
