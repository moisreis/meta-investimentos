import { describe, it, expect } from "vitest"

import { TransactionAllocation } from "@/domain/transaction-allocation/entities/transaction-allocation.entity"
import { ValidationError } from "@/errors"
import { EntityId } from "@/value-objects"
import { QuotaQuantity } from "@/value-objects/quota-quantity.vo"
import { buildTransactionAllocation } from "__tests__/__setup__/_factories.setup"

const PERSISTED_ID = EntityId.create("allocation-123")

describe("TransactionAllocation", () => {
  describe("create", () => {
    it("should create a valid TransactionAllocation with required props", () => {
      const allocation = TransactionAllocation.create({
        applicationId: EntityId.create("application-1"),
        withdrawId: EntityId.create("withdrawal-1"),
        quotasConsumed: QuotaQuantity.create("100.00"),
      })

      expect(allocation.applicationId).toBe(
        EntityId.create("application-1")
      )
      expect(allocation.withdrawId).toBe(
        EntityId.create("withdrawal-1")
      )
      expect(allocation.quotasConsumed.value.toFixed(2)).toBe(
        "100.00"
      )
      expect(allocation.version).toBe(0)
      expect(allocation.id).toBeUndefined()
    })

    it("should create a TransactionAllocation with provided id", () => {
      const allocation = TransactionAllocation.create(
        {
          applicationId: EntityId.create("application-1"),
          withdrawId: EntityId.create("withdrawal-1"),
          quotasConsumed: QuotaQuantity.create("100.00"),
        },
        PERSISTED_ID
      )

      expect(allocation.id).toBe(PERSISTED_ID)
    })

    it("should create a TransactionAllocation with custom version", () => {
      const allocation = TransactionAllocation.create({
        applicationId: EntityId.create("application-1"),
        withdrawId: EntityId.create("withdrawal-1"),
        quotasConsumed: QuotaQuantity.create("100.00"),
        version: 3,
      })

      expect(allocation.version).toBe(3)
    })

    it("should create a TransactionAllocation with custom createdAt", () => {
      const createdAt = new Date("2026-01-01T00:00:00.000Z")

      const allocation = TransactionAllocation.create({
        applicationId: EntityId.create("application-1"),
        withdrawId: EntityId.create("withdrawal-1"),
        quotasConsumed: QuotaQuantity.create("100.00"),
        createdAt,
      })

      expect(allocation.createdAt).toEqual(createdAt)
    })

    it("should throw ValidationError when applicationId is blank", () => {
      expect(() =>
        TransactionAllocation.create({
          applicationId: EntityId.create("   "),
          withdrawId: EntityId.create("withdrawal-1"),
          quotasConsumed: QuotaQuantity.create("100.00"),
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when withdrawId is blank", () => {
      expect(() =>
        TransactionAllocation.create({
          applicationId: EntityId.create("application-1"),
          withdrawId: EntityId.create("   "),
          quotasConsumed: QuotaQuantity.create("100.00"),
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when quotasConsumed is missing", () => {
      expect(() =>
        TransactionAllocation.create({
          applicationId: EntityId.create("application-1"),
          withdrawId: EntityId.create("withdrawal-1"),
        } as Parameters<typeof TransactionAllocation.create>[0])
      ).toThrow(ValidationError)
    })
  })

  describe("equals", () => {
    it("should return true when comparing the same instance", () => {
      const allocation = buildTransactionAllocation()

      expect(allocation.equals(allocation)).toBe(true)
    })

    it("should return true when instances share the same id", () => {
      const first = buildTransactionAllocation({
        id: PERSISTED_ID,
      })
      const second = buildTransactionAllocation({
        id: PERSISTED_ID,
      })

      expect(first.equals(second)).toBe(true)
    })

    it("should return false when ids differ", () => {
      const first = buildTransactionAllocation({
        id: EntityId.create("allocation-1"),
      })
      const second = buildTransactionAllocation({
        id: EntityId.create("allocation-2"),
      })

      expect(first.equals(second)).toBe(false)
    })

    it("should return false when this has no id", () => {
      const first = buildTransactionAllocation()
      const second = buildTransactionAllocation({
        id: PERSISTED_ID,
      })

      expect(first.equals(second)).toBe(false)
    })

    it("should return false when other has no id", () => {
      const first = buildTransactionAllocation({
        id: PERSISTED_ID,
      })
      const second = buildTransactionAllocation()

      expect(first.equals(second)).toBe(false)
    })

    it("should return false when other is null", () => {
      const allocation = buildTransactionAllocation()

      expect(allocation.equals(null)).toBe(false)
    })

    it("should return false when other is undefined", () => {
      const allocation = buildTransactionAllocation()

      expect(allocation.equals(undefined)).toBe(false)
    })
  })

  describe("immutability", () => {
    it("should not allow direct property mutation", () => {
      const allocation = buildTransactionAllocation()

      expect(() => {
        // @ts-expect-error - exercising runtime immutability
        allocation.quotasConsumed =
          QuotaQuantity.create("999.00")
      }).toThrow(TypeError)
    })
  })
})
