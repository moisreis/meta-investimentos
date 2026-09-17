import { Session } from "@domain/session/entities/session.entity"
import { EntityId } from "@/value-objects"
import { session } from "@db-schemas/session.schema"

/**
 * @summary
 * Maps a session persistence row into a domain entity.
 *
 * @remarks
 * Reconstructs domain value objects from their persisted
 * primitive representations.
 *
 * @param row - Database row returned by Drizzle.
 * @returns A hydrated `Session` domain entity.
 */
export function toDomain(row: typeof session.$inferSelect): Session {
  return Session.create(
    {
      userId: EntityId.create(row.userId),
      token: row.token,
      expiresAt: row.expiresAt,
      ipAddress: row.ipAddress,
      userAgent: row.userAgent,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    },
    row.id
  )
}

/**
 * @summary
 * Maps a session domain entity into persistence data.
 *
 * @remarks
 * Unwraps domain value objects into their primitive
 * database representations.
 *
 * @param entity - Session domain entity.
 * @returns Values compatible with the Drizzle insert schema.
 */
export function toInsert(entity: Session): typeof session.$inferInsert {
  return {
    userId: entity.userId,
    token: entity.token,
    expiresAt: entity.expiresAt,
    ipAddress: entity.ipAddress,
    userAgent: entity.userAgent,
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
 * @param entity - Session domain entity.
 * @returns Update values for the row.
 * @author Moisés Reis
 * @date 2026-09-15
 */
export function toUpdate(
  entity: Session
): Partial<typeof session.$inferInsert> {
  return {
    userId: entity.userId,
    token: entity.token,
    expiresAt: entity.expiresAt,
    ipAddress: entity.ipAddress,
    userAgent: entity.userAgent,
  }
}
