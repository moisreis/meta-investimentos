import { describe, it, expect } from "vitest"

import { PositionPerformance } from "@/domain/position-performance/entities/position-performance.entity"
import { ValidationError } from "@/errors"
import { EntityId } from "@/value-objects"
import { PositiveMoney } from "@/value-objects/positive-money.vo"
import { QuotaQuantity } from "@/value-objects/quota-quantity.vo"
import { SignedMoney } from "@/value-objects/signed-money.vo"
import { SignedPercentage } from "@/value-objects/signed-percentage.vo"
import { buildPositionPerformance } from "__tests__/__setup__/_factories.setup"

const PERSISTED_ID = EntityId.create("position-performance-123")

/**
 * Minimal set of props accepted by `PositionPerformance.create`.
 */
interface RequiredProps {
  positionId: EntityId
  date: Date
  quotasHeld: QuotaQuantity
  patrimony: PositiveMoney
  applicationTotal: PositiveMoney
  redemptionTotal: PositiveMoney
  cashFlowNet: SignedMoney
  earnings: SignedMoney
  returnDaily: SignedPercentage
  allocation: SignedPercentage
}

/**
 * Builds a full prop bag for `PositionPerformance.create`.
 *
 * @param overrides - Props to override or blank out.
 * @returns Props object accepted by the factory.
 */
function createProps(
  overrides: Partial<RequiredProps> = {}
): RequiredProps {
  return {
    positionId: EntityId.create("position-1"),
    date: new Date("2026-01-31"),
    quotasHeld: QuotaQuantity.create("1000"),
    patrimony: PositiveMoney.create("50000"),
    applicationTotal: PositiveMoney.create("10000"),
    redemptionTotal: PositiveMoney.create("5000"),
    cashFlowNet: SignedMoney.create("5000"),
    earnings: SignedMoney.create("1000"),
    returnDaily: SignedPercentage.create("0.5"),
    allocation: SignedPercentage.create("50"),
    ...overrides,
  }
}

describe("PositionPerformance", () => {
  describe("create", () => {
    it("should create a valid PositionPerformance with required props", () => {
      const performance =
        PositionPerformance.create(createProps())

      expect(performance.positionId).toBe(
        EntityId.create("position-1")
      )
      expect(performance.date).toEqual(new Date("2026-01-31"))
      expect(performance.quotasHeld.value.toFixed(2)).toBe(
        "1000.00"
      )
      expect(performance.patrimony.value.toFixed(2)).toBe(
        "50000.00"
      )
      expect(performance.applicationTotal.value.toFixed(2)).toBe(
        "10000.00"
      )
      expect(performance.redemptionTotal.value.toFixed(2)).toBe(
        "5000.00"
      )
      expect(performance.cashFlowNet.value.toFixed(2)).toBe(
        "5000.00"
      )
      expect(performance.earnings.value.toFixed(2)).toBe(
        "1000.00"
      )
      expect(performance.returnDaily.value.toFixed(2)).toBe(
        "0.50"
      )
      expect(performance.allocation.value.toFixed(2)).toBe(
        "50.00"
      )
      expect(performance.id).toBeUndefined()
    })

    it("should create a PositionPerformance with provided id", () => {
      const performance = PositionPerformance.create(
        createProps(),
        PERSISTED_ID
      )

      expect(performance.id).toBe(PERSISTED_ID)
    })

    it("should default optional returns to null", () => {
      const performance =
        PositionPerformance.create(createProps())

      expect(performance.returnMonthly).toBeNull()
      expect(performance.returnYearly).toBeNull()
      expect(performance.returnLast12m).toBeNull()
    })

    it("should keep optional returns when provided", () => {
      const performance = PositionPerformance.create({
        ...createProps(),
        returnMonthly: SignedPercentage.create("1.5"),
        returnYearly: SignedPercentage.create("12.0"),
        returnLast12m: SignedPercentage.create("15.0"),
      })

      expect(performance.returnMonthly!.value.toFixed(2)).toBe(
        "1.50"
      )
      expect(performance.returnYearly!.value.toFixed(2)).toBe(
        "12.00"
      )
      expect(performance.returnLast12m!.value.toFixed(2)).toBe(
        "15.00"
      )
    })

    it("should create a PositionPerformance with custom createdAt", () => {
      const createdAt = new Date("2026-01-01T00:00:00.000Z")

      const performance = PositionPerformance.create({
        ...createProps(),
        createdAt,
      })

      expect(performance.createdAt).toEqual(createdAt)
    })

    it("should throw ValidationError when positionId is blank", () => {
      expect(() =>
        PositionPerformance.create(
          createProps({ positionId: EntityId.create("   ") })
        )
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when date is missing", () => {
      expect(() =>
        PositionPerformance.create(
          createProps({ date: undefined as unknown as Date })
        )
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when quotasHeld is missing", () => {
      expect(() =>
        PositionPerformance.create(
          createProps({
            quotasHeld: undefined as unknown as QuotaQuantity,
          })
        )
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when patrimony is missing", () => {
      expect(() =>
        PositionPerformance.create(
          createProps({
            patrimony: undefined as unknown as PositiveMoney,
          })
        )
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when applicationTotal is missing", () => {
      expect(() =>
        PositionPerformance.create(
          createProps({
            applicationTotal:
              undefined as unknown as PositiveMoney,
          })
        )
      ).toThrow(ValidationError)
    })

    it("should throw ValidationError when allocation is missing", () => {
      expect(() =>
        PositionPerformance.create(
          createProps({
            allocation: undefined as unknown as SignedPercentage,
          })
        )
      ).toThrow(ValidationError)
    })
  })

  describe("equals", () => {
    it("should return true when comparing the same instance", () => {
      const performance = buildPositionPerformance()

      expect(performance.equals(performance)).toBe(true)
    })

    it("should return true when instances share the same id", () => {
      const first = buildPositionPerformance({
        id: PERSISTED_ID,
      })
      const second = buildPositionPerformance({
        id: PERSISTED_ID,
      })

      expect(first.equals(second)).toBe(true)
    })

    it("should return false when ids differ", () => {
      const first = buildPositionPerformance({
        id: EntityId.create("perf-1"),
      })
      const second = buildPositionPerformance({
        id: EntityId.create("perf-2"),
      })

      expect(first.equals(second)).toBe(false)
    })

    it("should return false when this has no id", () => {
      const first = buildPositionPerformance()
      const second = buildPositionPerformance({
        id: PERSISTED_ID,
      })

      expect(first.equals(second)).toBe(false)
    })

    it("should return false when other has no id", () => {
      const first = buildPositionPerformance({
        id: PERSISTED_ID,
      })
      const second = buildPositionPerformance()

      expect(first.equals(second)).toBe(false)
    })

    it("should return false when other is null", () => {
      const performance = buildPositionPerformance()

      expect(performance.equals(null)).toBe(false)
    })

    it("should return false when other is undefined", () => {
      const performance = buildPositionPerformance()

      expect(performance.equals(undefined)).toBe(false)
    })
  })

  describe("immutability", () => {
    it("should not allow direct property mutation", () => {
      const performance = buildPositionPerformance()

      expect(() => {
        // @ts-expect-error - exercising runtime immutability
        performance.patrimony = PositiveMoney.create("99999")
      }).toThrow(TypeError)
    })
  })
})
