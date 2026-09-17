import { PositionPerformance } from "@domain/position-performance/entities/position-performance.entity"
import {
  EntityId,
  PositiveMoney,
  QuotaQuantity,
  SignedMoney,
  SignedPercentage,
} from "@/value-objects"
import { positionPerformance } from "@db-schemas/position-performance.schema"

/**
 * @summary
 * Maps a position performance persistence row into a
 * domain entity.
 *
 * @remarks
 * Reconstructs domain value objects from their persisted
 * primitive representations.
 *
 * @param row - Database row returned by Drizzle.
 * @returns A hydrated `PositionPerformance` domain entity.
 */
export function toDomain(
  row: typeof positionPerformance.$inferSelect
): PositionPerformance {
  return PositionPerformance.create(
    {
      positionId: EntityId.create(row.positionId),
      date: row.date,
      quotasHeld: QuotaQuantity.create(row.quotasHeld),
      patrimony: PositiveMoney.create(row.patrimony),
      applicationTotal: PositiveMoney.create(row.applicationTotal),
      redemptionTotal: PositiveMoney.create(row.redemptionTotal),
      cashFlowNet: SignedMoney.create(row.cashFlowNet),
      earnings: SignedMoney.create(row.earnings),
      returnDaily: SignedPercentage.create(row.returnDaily),
      returnMonthly: row.returnMonthly
        ? SignedPercentage.create(row.returnMonthly)
        : null,
      returnYearly: row.returnYearly
        ? SignedPercentage.create(row.returnYearly)
        : null,
      returnLast12m: row.returnLast12m
        ? SignedPercentage.create(row.returnLast12m)
        : null,
      allocation: SignedPercentage.create(row.allocation),
      createdAt: row.createdAt,
    },
    row.id
  )
}

/**
 * @summary
 * Maps a position performance domain entity into
 * persistence data.
 *
 * @remarks
 * Unwraps domain value objects into their primitive
 * database representations.
 *
 * @param entity - Position performance domain entity.
 * @returns Values compatible with the Drizzle insert schema.
 */
export function toInsert(
  entity: PositionPerformance
): typeof positionPerformance.$inferInsert {
  return {
    positionId: entity.positionId,
    date: entity.date,
    quotasHeld: entity.quotasHeld.value.toString(),
    patrimony: entity.patrimony.value.toString(),
    applicationTotal: entity.applicationTotal.value.toString(),
    redemptionTotal: entity.redemptionTotal.value.toString(),
    cashFlowNet: entity.cashFlowNet.value.toString(),
    earnings: entity.earnings.value.toString(),
    returnDaily: entity.returnDaily.value.toString(),
    returnMonthly: entity.returnMonthly?.value.toString() ?? null,
    returnYearly: entity.returnYearly?.value.toString() ?? null,
    returnLast12m: entity.returnLast12m?.value.toString() ?? null,
    allocation: entity.allocation.value.toString(),
    createdAt: entity.createdAt,
  }
}

/**
 * @summary Maps an entity into update values.
 *
 * @remarks
 * Omits `createdAt` and `updatedAt`. The first never changes;
 * the second refreshes via `$onUpdate`.
 *
 * @explanation
 * `createdAt` is set once at insertion and never mutated.
 * `updatedAt` is auto-refreshed by Drizzle's `$onUpdate`,
 * so passing it explicitly is unnecessary.
 *
 * @param entity - Position performance domain entity.
 * @returns Update values for the row.
 * @author Moisés Reis
 * @date 2026-09-15
 */
export function toUpdate(
  entity: PositionPerformance
): Partial<typeof positionPerformance.$inferInsert> {
  return {
    positionId: entity.positionId,
    date: entity.date,
    quotasHeld: entity.quotasHeld.value.toString(),
    patrimony: entity.patrimony.value.toString(),
    applicationTotal: entity.applicationTotal.value.toString(),
    redemptionTotal: entity.redemptionTotal.value.toString(),
    cashFlowNet: entity.cashFlowNet.value.toString(),
    earnings: entity.earnings.value.toString(),
    returnDaily: entity.returnDaily.value.toString(),
    returnMonthly: entity.returnMonthly?.value.toString() ?? null,
    returnYearly: entity.returnYearly?.value.toString() ?? null,
    returnLast12m: entity.returnLast12m?.value.toString() ?? null,
    allocation: entity.allocation.value.toString(),
  }
}
