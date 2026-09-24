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
 * @explanation
 * Use this function in the repository layer to build the
 * `BenchmarkHistory` entity from a row of the
 * `benchmark_history` table.
 * It keeps database details out of the domain layer.
 *
 * @param row - Database row returned by **Drizzle**.
 *
 * @returns The hydrated entity.
 *
 * @example
 * const RECORD = ToDomain(ROW);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export function ToDomain(
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
 * @explanation
 * Use this function in the insert path of the repository.
 * It prepares the entity as plain column values for the
 * `benchmark_history` table.
 *
 * @param entity - Benchmark history domain entity.
 *
 * @returns Row insert values.
 *
 * @example
 * const RECORD = ToInsert(RECORD);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export function ToInsert(
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
 * Use for updates where **Drizzle** should only touch mutable
 * columns. The timestamp is managed at the database layer.
 *
 * @param entity - Benchmark history domain entity.
 *
 * @returns Row update values.
 *
 * @example
 * const RECORD = ToUpdate(RECORD);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export function ToUpdate(
  entity: BenchmarkHistory
): Partial<typeof benchmarkHistory.$inferInsert> {
  return {
    benchmarkId: entity.benchmarkId,
    date: entity.date,
    rate: entity.rate.value.toString(),
  }
}
