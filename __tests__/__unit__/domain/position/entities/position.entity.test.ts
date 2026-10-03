import { describe, it, expect } from "vitest"

import { Position } from "@/domain/position/entities/position.entity"
import { ValidationError } from "@/errors"
import { EntityId } from "@/value-objects"
import { PositiveMoney } from "@/value-objects/positive-money.vo"
import { SignedPercentage } from "@/value-objects/signed-percentage.vo"
import { buildPosition } from "__tests__/__setup__/_factories.setup"

const PERSISTED_ID = EntityId.create("position-123")
const NOW = new Date("2026-06-15T10:00:00.000Z")

describe("Position", () => {
  describe("create", () => {
    it("should create a valid Position when only required props are given", () => {
      const position = Position.create({
        portfolioId: EntityId.create("portfolio-1"),
        fundId: EntityId.create("fund-1"),
      })

      expect(position.portfolioId).toBe(
        EntityId.create("portfolio-1")
      )
      expect(position.fundId).toBe(EntityId.create("fund-1"))
      expect(position.initialBalance).toBeNull()
      expect(position.initialBalanceDate).toBeNull()
      expect(position.allocation.value.toFixed(2)).toBe("100.00")
      expect(position.version).toBe(0)
      expect(position.id).toBeUndefined()
    })

    it("should create a Position with provided id", () => {
      const position = Position.create(
        {
          portfolioId: EntityId.create("portfolio-1"),
          fundId: EntityId.create("fund-1"),
        },
        PERSISTED_ID
      )

      expect(position.id).toBe(PERSISTED_ID)
    })

    it("should create a Position with custom timestamps", () => {
      const createdAt = new Date("2026-01-01T00:00:00.000Z")
      const updatedAt = new Date("2026-01-15T12:00:00.000Z")
      const position = Position.create({
        portfolioId: EntityId.create("portfolio-1"),
        fundId: EntityId.create("fund-1"),
        createdAt,
        updatedAt,
      })

      expect(position.createdAt).toEqual(createdAt)
      expect(position.updatedAt).toEqual(updatedAt)
    })

    it("should create a Position with optional props", () => {
      const initialBalanceDate = new Date("2026-01-01")
      const position = Position.create({
        portfolioId: EntityId.create("portfolio-1"),
        fundId: EntityId.create("fund-1"),
        initialBalance: PositiveMoney.create("10000.00"),
        initialBalanceDate,
        allocation: SignedPercentage.create("50"),
      })

      expect(position.initialBalance).not.toBeNull()
      expect(position.initialBalance!.value.toFixed(2)).toBe(
        "10000.00"
      )
      expect(position.initialBalanceDate).toEqual(
        initialBalanceDate
      )
      expect(position.allocation.value.toFixed(2)).toBe("50.00")
    })

    it("should throw ValidationError when portfolioId is blank", () => {
      expect(() =>
        Position.create({
          portfolioId: EntityId.create("   "),
          fundId: EntityId.create("fund-1"),
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when fundId is blank", () => {
      expect(() =>
        Position.create({
          portfolioId: EntityId.create("portfolio-1"),
          fundId: EntityId.create("   "),
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when allocation is negative", () => {
      expect(() =>
        Position.create({
          portfolioId: EntityId.create("portfolio-1"),
          fundId: EntityId.create("fund-1"),
          allocation: SignedPercentage.create("-10"),
        })
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when allocation is greater than 100", () => {
      expect(() =>
        Position.create({
          portfolioId: EntityId.create("portfolio-1"),
          fundId: EntityId.create("fund-1"),
          allocation: SignedPercentage.create("150"),
        })
      ).toThrow(ValidationError)
    })
  })

  describe("setInitialBalance", () => {
    it("should return new Position with initial balance set when persisted", () => {
      const position = buildPosition({ id: PERSISTED_ID })
      const balanceDate = new Date("2026-01-01")

      const updated = position.setInitialBalance(
        PositiveMoney.create("10000.00"),
        balanceDate,
        NOW
      )

      expect(updated.initialBalance!.value.toFixed(2)).toBe(
        "10000.00"
      )
      expect(updated.initialBalanceDate).toEqual(balanceDate)
      expect(updated.id).toBe(PERSISTED_ID)
      expect(updated.updatedAt).toEqual(NOW)
    })

    it("should keep the original Position unchanged", () => {
      const position = buildPosition({
        id: PERSISTED_ID,
        initialBalance: null,
        initialBalanceDate: null,
      })

      position.setInitialBalance(
        PositiveMoney.create("10000.00"),
        new Date("2026-01-01"),
        NOW
      )

      expect(position.initialBalance).toBeNull()
      expect(position.initialBalanceDate).toBeNull()
    })

    it("should throw ValidationError when position is not persisted", () => {
      const position = buildPosition()

      expect(() =>
        position.setInitialBalance(
          PositiveMoney.create("10000.00"),
          new Date("2026-01-01"),
          NOW
        )
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when initial balance is missing", () => {
      const position = buildPosition({ id: PERSISTED_ID })

      expect(() =>
        position.setInitialBalance(
          null as unknown as PositiveMoney,
          new Date("2026-01-01"),
          NOW
        )
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when date is missing", () => {
      const position = buildPosition({ id: PERSISTED_ID })

      expect(() =>
        position.setInitialBalance(
          PositiveMoney.create("10000.00"),
          null as unknown as Date,
          NOW
        )
      ).toThrow(ValidationError)
    })
  })

  describe("changeAllocation", () => {
    it("should return new Position with updated allocation when persisted", () => {
      const position = buildPosition({
        id: PERSISTED_ID,
        allocation: SignedPercentage.create("100"),
      })

      const updated = position.changeAllocation(
        SignedPercentage.create("50"),
        NOW
      )

      expect(updated.allocation.value.toFixed(2)).toBe("50.00")
      expect(updated.id).toBe(PERSISTED_ID)
      expect(updated.updatedAt).toEqual(NOW)
    })

    it("should keep the original Position unchanged", () => {
      const position = buildPosition({
        id: PERSISTED_ID,
        allocation: SignedPercentage.create("100"),
      })

      position.changeAllocation(
        SignedPercentage.create("50"),
        NOW
      )

      expect(position.allocation.value.toFixed(2)).toBe("100.00")
    })

    it("should throw ValidationError when position is not persisted", () => {
      const position = buildPosition()

      expect(() =>
        position.changeAllocation(
          SignedPercentage.create("50"),
          NOW
        )
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when allocation is missing", () => {
      const position = buildPosition({ id: PERSISTED_ID })

      expect(() =>
        position.changeAllocation(
          null as unknown as SignedPercentage,
          NOW
        )
      ).toThrow(ValidationError)
    })
  })

  describe("equals", () => {
    it("should return true when comparing the same instance", () => {
      const position = buildPosition()

      expect(position.equals(position)).toBe(true)
    })

    it("should return true when instances share the same id", () => {
      const first = buildPosition({ id: PERSISTED_ID })
      const second = buildPosition({ id: PERSISTED_ID })

      expect(first.equals(second)).toBe(true)
    })

    it("should return false when ids differ", () => {
      const first = buildPosition({
        id: EntityId.create("position-1"),
      })
      const second = buildPosition({
        id: EntityId.create("position-2"),
      })

      expect(first.equals(second)).toBe(false)
    })

    it("should return false when this has no id", () => {
      const first = buildPosition()
      const second = buildPosition({ id: PERSISTED_ID })

      expect(first.equals(second)).toBe(false)
    })

    it("should return false when other has no id", () => {
      const first = buildPosition({ id: PERSISTED_ID })
      const second = buildPosition()

      expect(first.equals(second)).toBe(false)
    })

    it("should return false when other is null", () => {
      const position = buildPosition()

      expect(position.equals(null)).toBe(false)
    })

    it("should return false when other is undefined", () => {
      const position = buildPosition()

      expect(position.equals(undefined)).toBe(false)
    })
  })

  describe("immutability", () => {
    it("should not allow direct property mutation", () => {
      const position = buildPosition()

      expect(() => {
        // @ts-expect-error - exercising runtime immutability
        position.allocation = SignedPercentage.create("99")
      }).toThrow(TypeError)
    })

    it("should return new instances on mutations", () => {
      const position = buildPosition({ id: PERSISTED_ID })

      const updated = position.changeAllocation(
        SignedPercentage.create("50"),
        NOW
      )

      expect(updated).not.toBe(position)
    })
  })
})
