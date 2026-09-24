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
 * @explanation
 * Use this function in the repository layer to build the
 * `Bank` entity from a row of the `bank` table.
 * It keeps database details out of the domain layer.
 *
 * @param row - Database row returned by **Drizzle**.
 *
 * @returns The hydrated entity.
 *
 * @example
 * const BANK = ToDomain(ROW);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export function ToDomain(row: typeof bank.$inferSelect): Bank {
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
 * @explanation
 * Use this function in the insert path of the repository.
 * It prepares the entity as plain column values for the
 * `bank` table.
 *
 * @param entity - Bank domain entity.
 *
 * @returns Row insert values.
 *
 * @example
 * const BANK = ToInsert(BANK);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export function ToInsert(
  entity: Bank
): typeof bank.$inferInsert {
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
 * Use for updates where **Drizzle** should only touch mutable
 * columns. Timestamps are managed at the database layer.
 *
 * @param entity - Bank domain entity.
 *
 * @returns Row update values.
 *
 * @example
 * const BANK = ToUpdate(BANK);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export function ToUpdate(
  entity: Bank
): Partial<typeof bank.$inferInsert> {
  return {
    code: entity.code,
    name: entity.name,
  }
}
