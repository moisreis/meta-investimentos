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
 * @param row - Database row returned by Drizzle.
 * @returns A hydrated `Verification` domain entity.
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
 * @param entity - Verification domain entity.
 * @returns Values compatible with the Drizzle insert schema.
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
 * @param entity - Verification domain entity.
 * @returns Update values for the row.
 * @author Moisés Reis
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
