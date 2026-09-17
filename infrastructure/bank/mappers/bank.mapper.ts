import { Bank } from "@domain/bank/entities/bank.entity"
import { bank } from "@db-schemas/bank.schema"

/**
 * @summary
 * Maps a bank persistence row into a domain entity.
 *
 * @remarks
 * Reconstructs domain value objects from their persisted
 * primitive representations.
 *
 * @param row - Database row returned by Drizzle.
 * @returns A hydrated `Bank` domain entity.
 */
export function toDomain(row: typeof bank.$inferSelect): Bank {
  return Bank.create(
    {
      code: row.code,
      name: row.name,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    },
    row.id
  )
}

/**
 * @summary
 * Maps a bank domain entity into persistence data.
 *
 * @remarks
 * Unwraps domain value objects into their primitive
 * database representations.
 *
 * @param entity - Bank domain entity.
 * @returns Values compatible with the Drizzle insert schema.
 */
export function toInsert(entity: Bank): typeof bank.$inferInsert {
  return {
    code: entity.code,
    name: entity.name,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  }
}

/**
 * @summary
 * Maps a bank entity into update values.
 *
 * @remarks
 * Omits `createdAt` and `updatedAt`. The first never
 * changes; the second refreshes via `$onUpdate`.
 *
 * @explanation
 * Use for updates where Drizzle should only touch mutable
 * columns. Timestamps are managed at the database layer.
 *
 * @param entity - Bank domain entity.
 * @returns Update values for the row.
 *
 * @author Moisés Reis
 * @date 2026-09-15
 */
export function toUpdate(entity: Bank): Partial<typeof bank.$inferInsert> {
  return {
    code: entity.code,
    name: entity.name,
  }
}
