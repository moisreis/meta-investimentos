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
 * @param row - Database row returned by Drizzle.
 * @returns A hydrated `Benchmark` domain entity.
 */
export function toDomain(row: typeof benchmark.$inferSelect): Benchmark {
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
 * @param entity - Benchmark domain entity.
 * @returns Values compatible with the Drizzle insert schema.
 */
export function toInsert(entity: Benchmark): typeof benchmark.$inferInsert {
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
 * Use for updates where Drizzle should only touch mutable
 * columns. The timestamp is managed at the database layer.
 *
 * @param entity - Benchmark domain entity.
 * @returns Update values for the row.
 *
 * @author Moisés Reis
 * @date 2026-09-15
 */
export function toUpdate(
  entity: Benchmark
): Partial<typeof benchmark.$inferInsert> {
  return {
    acronym: entity.acronym,
    name: entity.name,
  }
}
