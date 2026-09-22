import { Verification } from "@domain/verification/entities/verification.entity"
import { verification } from "@db-schemas/verification.schema"

/**
 * @summary
 * Maps a verification persistence row into a domain entity.
 *
 * @remarks
 * Reconstructs domain value objects from their persisted
 * primitive representations.
 *
 * @explanation
 * Use this function in the repository layer to build the
 * `Verification` entity from a row of the `verification`
 * table.
 * It keeps database details out of the domain layer.
 *
 * @param row - Database row returned by **Drizzle**.
 *
 * @returns The hydrated entity.
 *
 * @example
 * const V = toDomain(ROW);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export function toDomain(row: typeof verification.$inferSelect): Verification {
  return Verification.create(
    {
      identifier: row.identifier,
      value: row.value,
      expiresAt: row.expiresAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    },
    row.id
  )
}

/**
 * @summary
 * Maps a verification domain entity into persistence data.
 *
 * @remarks
 * Unwraps domain value objects into their primitive
 * database representations.
 *
 * @explanation
 * Use this function in the insert path of the repository.
 * It prepares the entity as plain column values for the
 * `verification` table.
 *
 * @param entity - Verification domain entity.
 *
 * @returns Row insert values.
 *
 * @example
 * const V = toInsert(V);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export function toInsert(
  entity: Verification
): typeof verification.$inferInsert {
  return {
    identifier: entity.identifier,
    value: entity.value,
    expiresAt: entity.expiresAt,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  }
}

/**
 * @summary
 * Maps an entity into update values.
 *
 * @remarks
 * Omits `createdAt` and `updatedAt`. The first never changes;
 * the second refreshes via `$onUpdate`.
 *
 * @explanation
 * `createdAt` is set once at insertion and never mutated.
 * `updatedAt` is auto-refreshed by **Drizzle**'s `$onUpdate`,
 * so passing it explicitly is unnecessary.
 *
 * @param entity - Verification domain entity.
 *
 * @returns Row update values.
 *
 * @example
 * const V = toUpdate(V);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export function toUpdate(
  entity: Verification
): Partial<typeof verification.$inferInsert> {
  return {
    identifier: entity.identifier,
    value: entity.value,
    expiresAt: entity.expiresAt,
  }
}
