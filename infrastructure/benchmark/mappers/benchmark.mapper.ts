import { Benchmark } from "@domain/benchmark/entities/benchmark.entity"
import { benchmark } from "@db-schemas/benchmark.schema"

/**
 * @summary
 * Maps a benchmark persistence row into a domain entity.
 *
 * @remarks
 * Reconstructs domain value objects from their persisted
 * primitive representations.
 *
 * @explanation
 * Use this function in the repository layer to build the
 * `Benchmark` entity from a row of the `benchmark` table.
 * It keeps database details out of the domain layer.
 *
 * @param row - Database row returned by **Drizzle**.
 *
 * @returns The hydrated entity.
 *
 * @example
 * const BENCH = ToDomain(ROW);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export function ToDomain(
  row: typeof benchmark.$inferSelect
): Benchmark {
  return Benchmark.create(
    {
      acronym: row.acronym,
      name: row.name,
      createdAt: row.createdAt,
    },
    row.id
  )
}

/**
 * @summary
 * Maps a benchmark domain entity into persistence data.
 *
 * @remarks
 * Unwraps domain value objects into their primitive
 * database representations.
 *
 * @explanation
 * Use this function in the insert path of the repository.
 * It prepares the entity as plain column values for the
 * `benchmark` table.
 *
 * @param entity - Benchmark domain entity.
 *
 * @returns Row insert values.
 *
 * @example
 * const BENCH = ToInsert(BENCH);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export function ToInsert(
  entity: Benchmark
): typeof benchmark.$inferInsert {
  return {
    acronym: entity.acronym,
    name: entity.name,
    createdAt: entity.createdAt,
  }
}

/**
 * @summary
 * Maps a benchmark entity into update values.
 *
 * @remarks
 * Omits `createdAt`. It never changes after creation.
 *
 * @explanation
 * Use for updates where **Drizzle** should only touch mutable
 * columns. The timestamp is managed at the database layer.
 *
 * @param entity - Benchmark domain entity.
 *
 * @returns Row update values.
 *
 * @example
 * const BENCH = ToUpdate(BENCH);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export function ToUpdate(
  entity: Benchmark
): Partial<typeof benchmark.$inferInsert> {
  return {
    acronym: entity.acronym,
    name: entity.name,
  }
}
