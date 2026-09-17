import { BenchmarkHistory } from "@domain/benchmark-history/entities/benchmark-history.entity"
import { EntityId, SignedPercentage } from "@/value-objects"
import { benchmarkHistory } from "@db-schemas/benchmark-history.schema"

/**
 * @summary
 * Maps a benchmark history persistence row into a domain entity.
 *
 * @remarks
 * Reconstructs domain value objects from their persisted
 * primitive representations.
 *
 * @param row - Database row returned by Drizzle.
 * @returns A hydrated `BenchmarkHistory` domain entity.
 */
export function toDomain(
  row: typeof benchmarkHistory.$inferSelect
): BenchmarkHistory {
  return BenchmarkHistory.create(
    {
      benchmarkId: EntityId.create(row.benchmarkId),
      date: row.date,
      rate: SignedPercentage.create(row.rate),
      createdAt: row.createdAt,
    },
    row.id
  )
}

/**
 * @summary
 * Maps a benchmark history domain entity into persistence data.
 *
 * @remarks
 * Unwraps domain value objects into their primitive
 * database representations.
 *
 * @param entity - Benchmark history domain entity.
 * @returns Values compatible with the Drizzle insert schema.
 */
export function toInsert(
  entity: BenchmarkHistory
): typeof benchmarkHistory.$inferInsert {
  return {
    benchmarkId: entity.benchmarkId,
    date: entity.date,
    rate: entity.rate.value.toString(),
    createdAt: entity.createdAt,
  }
}

/**
 * @summary
 * Maps a benchmark history entity into update values.
 *
 * @remarks
 * Omits `createdAt`. It never changes after creation.
 *
 * @explanation
 * Use for updates where Drizzle should only touch mutable
 * columns. The timestamp is managed at the database layer.
 *
 * @param entity - Benchmark history domain entity.
 * @returns Update values for the row.
 *
 * @author Moisés Reis
 * @date 2026-09-15
 */
export function toUpdate(
  entity: BenchmarkHistory
): Partial<typeof benchmarkHistory.$inferInsert> {
  return {
    benchmarkId: entity.benchmarkId,
    date: entity.date,
    rate: entity.rate.value.toString(),
  }
}
