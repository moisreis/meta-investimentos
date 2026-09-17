import { Fund } from "@domain/fund/entities/fund.entity"
import { CNPJ, EntityId, SignedPercentage } from "@/value-objects"
import { fund } from "@db-schemas/fund.schema"

/**
 * @summary
 * Maps a fund persistence row into a domain entity.
 *
 * @remarks
 * Reconstructs domain value objects from their persisted
 * primitive representations.
 *
 * @param row - Database row returned by Drizzle.
 * @returns A hydrated `Fund` domain entity.
 */
export function toDomain(row: typeof fund.$inferSelect): Fund {
  return Fund.create(
    {
      cnpj: CNPJ.create(row.cnpj),
      name: row.name,
      administrationFee: row.administrationFee
        ? SignedPercentage.create(row.administrationFee)
        : null,
      performanceFee: row.performanceFee
        ? SignedPercentage.create(row.performanceFee)
        : null,
      bankId: EntityId.create(row.bankId),
      benchmarkId: row.benchmarkId ? EntityId.create(row.benchmarkId) : null,
      categoryId: row.categoryId ? EntityId.create(row.categoryId) : null,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    },
    row.id
  )
}

/**
 * @summary
 * Maps a fund domain entity into persistence data.
 *
 * @remarks
 * Unwraps domain value objects into their primitive
 * database representations.
 *
 * @param entity - Fund domain entity.
 * @returns Values compatible with the Drizzle insert schema.
 */
export function toInsert(entity: Fund): typeof fund.$inferInsert {
  return {
    cnpj: entity.cnpj.value,
    name: entity.name,
    administrationFee: entity.administrationFee?.value.toString() ?? null,
    performanceFee: entity.performanceFee?.value.toString() ?? null,
    bankId: entity.bankId,
    benchmarkId: entity.benchmarkId,
    categoryId: entity.categoryId,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  }
}

/**
 * @summary
 * Maps a fund entity into update values.
 *
 * @remarks
 * Omits `createdAt` and `updatedAt`. The first never
 * changes; the second refreshes via `$onUpdate`.
 *
 * @explanation
 * Use for updates where Drizzle should only touch mutable
 * columns. Timestamps are managed at the database layer.
 *
 * @param entity - Fund domain entity.
 * @returns Update values for the row.
 *
 * @author Moisés Reis
 * @date 2026-09-15
 */
export function toUpdate(entity: Fund): Partial<typeof fund.$inferInsert> {
  return {
    cnpj: entity.cnpj.value,
    name: entity.name,
    administrationFee: entity.administrationFee?.value.toString() ?? null,
    performanceFee: entity.performanceFee?.value.toString() ?? null,
    bankId: entity.bankId,
    benchmarkId: entity.benchmarkId,
    categoryId: entity.categoryId,
  }
}
