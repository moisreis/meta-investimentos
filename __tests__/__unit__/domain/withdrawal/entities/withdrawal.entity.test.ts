import { describe, it, expect } from "vitest"

import { Withdrawal } from "@/domain/withdrawal/entities/withdrawal.entity"
import { ValidationError } from "@/errors"
import { EntityId } from "@/value-objects"
import { PositiveMoney } from "@/value-objects/positive-money.vo"
import { QuotaQuantity } from "@/value-objects/quota-quantity.vo"
import { buildWithdrawal } from "__tests__/__setup__/_factories.setup"

const PERSISTED_ID = EntityId.create("withdrawal-123")
const NOW = new Date("2026-06-15T10:00:00.000Z")

describe("Withdrawal", () => {
  describe("create", () => {
    it("should create a valid Withdrawal with required props", () => {
      const date = new Date("2026-02-15")

      const withdrawal = Withdrawal.create({
        positionId: EntityId.create("position-1"),
        date,
        amount: PositiveMoney.create("500.00"),
        quotas: QuotaQuantity.create("50.00"),
      })

      expect(withdrawal.positionId).toBe(
        EntityId.create("position-1")
      )
      expect(withdrawal.date).toEqual(date)
      expect(withdrawal.amount.value.toFixed(2)).toBe("500.00")
      expect(withdrawal.quotas.value.toFixed(2)).toBe("50.00")
      expect(withdrawal.reversedAt).toBeNull()
      expect(withdrawal.reversedByUserId).toBeNull()
      expect(withdrawal.version).toBe(0)
      expect(withdrawal.id).toBeUndefined()
    })

    it("should create a Withdrawal with provided id", () => {
      const withdrawal = Withdrawal.create(
        {
          positionId: EntityId.create("position-1"),
          date: new Date("2026-02-15"),
          amount: PositiveMoney.create("500.00"),
          quotas: QuotaQuantity.create("50.00"),
        },
        PERSISTED_ID
      )

      expect(withdrawal.id).toBe(PERSISTED_ID)
    })

    it("should create a Withdrawal with optional reversal props", () => {
      const reversedAt = new Date("2026-03-01T00:00:00.000Z")

      const withdrawal = Withdrawal.create({
        positionId: EntityId.create("position-1"),
        date: new Date("2026-02-15"),
        amount: PositiveMoney.create("500.00"),
        quotas: QuotaQuantity.create("50.00"),
        reversedAt,
        reversedByUserId: EntityId.create("user-1"),
      })

      expect(withdrawal.reversedAt).toEqual(reversedAt)
      expect(withdrawal.reversedByUserId).toBe(
        EntityId.create("user-1")
      )
    })

    it("should throw ValidationError when positionId is blank", () => {
      expect(() =>
        Withdrawal.create({
          positionId: EntityId.create("   "),
          date: new Date("2026-02-15"),
          amount: PositiveMoney.create("500.00"),
          quotas: QuotaQuantity.create("50.00"),
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when date is missing", () => {
      expect(() =>
        Withdrawal.create({
          positionId: EntityId.create("position-1"),
          amount: PositiveMoney.create("500.00"),
          quotas: QuotaQuantity.create("50.00"),
        } as Parameters<typeof Withdrawal.create>[0])
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when amount is missing", () => {
      expect(() =>
        Withdrawal.create({
          positionId: EntityId.create("position-1"),
          date: new Date("2026-02-15"),
          quotas: QuotaQuantity.create("50.00"),
        } as Parameters<typeof Withdrawal.create>[0])
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when quotas is missing", () => {
      expect(() =>
        Withdrawal.create({
          positionId: EntityId.create("position-1"),
          date: new Date("2026-02-15"),
          amount: PositiveMoney.create("500.00"),
        } as Parameters<typeof Withdrawal.create>[0])
      ).toThrow(ValidationError)
    })
  })

  describe("reverse", () => {
    it("should return new Withdrawal with reversal data when persisted", () => {
      const withdrawal = buildWithdrawal({ id: PERSISTED_ID })

      const reversed = withdrawal.reverse(
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

    it("should keep the original Withdrawal unchanged", () => {
      const withdrawal = buildWithdrawal({ id: PERSISTED_ID })

      withdrawal.reverse(EntityId.create("user-1"), NOW)

      expect(withdrawal.reversedAt).toBeNull()
      expect(withdrawal.reversedByUserId).toBeNull()
    })

    it("should throw ValidationError when not persisted", () => {
      const withdrawal = buildWithdrawal()

      expect(() =>
        withdrawal.reverse(EntityId.create("user-1"), NOW)
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when already reversed", () => {
      const withdrawal = buildWithdrawal({
        id: PERSISTED_ID,
        reversedAt: new Date("2026-03-01T00:00:00.000Z"),
      })

      expect(() =>
        withdrawal.reverse(EntityId.create("user-1"), NOW)
      ).toThrow(ValidationError)
    })
  })

  describe("equals", () => {
    it("should return true when comparing the same instance", () => {
      const withdrawal = buildWithdrawal()

      expect(withdrawal.equals(withdrawal)).toBe(true)
    })

    it("should return true when instances share the same id", () => {
      const first = buildWithdrawal({ id: PERSISTED_ID })
      const second = buildWithdrawal({ id: PERSISTED_ID })

      expect(first.equals(second)).toBe(true)
    })

    it("should return false when ids differ", () => {
      const first = buildWithdrawal({
        id: EntityId.create("withdrawal-1"),
      })
      const second = buildWithdrawal({
        id: EntityId.create("withdrawal-2"),
      })

      expect(first.equals(second)).toBe(false)
    })

    it("should return false when this has no id", () => {
      const first = buildWithdrawal()
      const second = buildWithdrawal({ id: PERSISTED_ID })

      expect(first.equals(second)).toBe(false)
    })

    it("should return false when other has no id", () => {
      const first = buildWithdrawal({ id: PERSISTED_ID })
      const second = buildWithdrawal()

      expect(first.equals(second)).toBe(false)
    })

    it("should return false when other is null", () => {
      const withdrawal = buildWithdrawal()

      expect(withdrawal.equals(null)).toBe(false)
    })

    it("should return false when other is undefined", () => {
      const withdrawal = buildWithdrawal()

      expect(withdrawal.equals(undefined)).toBe(false)
    })
  })

  describe("immutability", () => {
    it("should not allow direct property mutation", () => {
      const withdrawal = buildWithdrawal()

      expect(() => {
        // @ts-expect-error - exercising runtime immutability
        withdrawal.amount = PositiveMoney.create("9999.00")
      }).toThrow(TypeError)
    })

    it("should return new instances on mutations", () => {
      const withdrawal = buildWithdrawal({ id: PERSISTED_ID })

      const reversed = withdrawal.reverse(
        EntityId.create("user-1"),
        NOW
      )

      expect(reversed).not.toBe(withdrawal)
    })
  })
})
