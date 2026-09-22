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
 * @explanation
 * Use this function in the repository layer to build the
 * `Fund` entity from a row of the `fund` table.
 * It keeps database details out of the domain layer.
 *
 * @param row - Database row returned by **Drizzle**.
 *
 * @returns The hydrated entity.
 *
 * @example
 * const FUND = toDomain(ROW);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
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
 * @explanation
 * Use this function in the insert path of the repository.
 * It prepares the entity as plain column values for the
 * `fund` table.
 *
 * @param entity - Fund domain entity.
 *
 * @returns Row insert values.
 *
 * @example
 * const FUND = toInsert(FUND);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
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
 * Use for updates where **Drizzle** should only touch mutable
 * columns. Timestamps are managed at the database layer.
 *
 * @param entity - Fund domain entity.
 *
 * @returns Row update values.
 *
 * @example
 * const FUND = toUpdate(FUND);
 *
 * @author Moisés Reis
 *
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
