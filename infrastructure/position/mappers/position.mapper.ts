import { Position } from "@domain/position/entities/position.entity"
import { EntityId, PositiveMoney } from "@/value-objects"
import { position } from "@db-schemas/position.schema"

/**
 * @summary
 * Maps a position persistence row into a domain entity.
 *
 * @remarks
 * Reconstructs domain value objects from their persisted
 * primitive representations.
 *
 * @param row - Database row returned by Drizzle.
 * @returns A hydrated `Position` domain entity.
 */
export function toDomain(row: typeof position.$inferSelect): Position {
  return Position.create(
    {
      portfolioId: EntityId.create(row.portfolioId),
      fundId: EntityId.create(row.fundId),
      initialBalance: row.initialBalance
        ? PositiveMoney.create(row.initialBalance)
        : null,
      initialBalanceDate: row.initialBalanceDate,
      version: row.version,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    },
    row.id
  )
}

/**
 * @summary
 * Maps a position domain entity into persistence data.
 *
 * @remarks
 * Unwraps domain value objects into their primitive
 * database representations.
 *
 * @param entity - Position domain entity.
 * @returns Values compatible with the Drizzle insert schema.
 */
export function toInsert(entity: Position): typeof position.$inferInsert {
  return {
    portfolioId: entity.portfolioId,
    fundId: entity.fundId,
    initialBalance: entity.initialBalance?.value.toString() ?? null,
    initialBalanceDate: entity.initialBalanceDate,
    version: entity.version,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  }
}

/**
 * @summary Maps an entity into update values.
 *
 * @remarks
 * Omits `createdAt`, `updatedAt`, and `version`. The first
 * never changes; the second refreshes via `$onUpdate`; the
 * version is managed by the repository.
 *
 * @explanation
 * `createdAt` is set once at insertion and never mutated.
 * `updatedAt` is auto-refreshed by Drizzle's `$onUpdate`,
 * so passing it explicitly is unnecessary. `version` drives
 * optimistic locking: the repository reads the persisted
 * row and bumps the version on a successful update, so it
 * is omitted here to avoid racing the stored counter.
 *
 * @param entity - Position domain entity.
 * @returns Update values for the row.
 * @author Moisés Reis
 * @date 2026-09-15
 */
export function toUpdate(
  entity: Position
): Partial<typeof position.$inferInsert> {
  return {
    portfolioId: entity.portfolioId,
    fundId: entity.fundId,
    initialBalance: entity.initialBalance?.value.toString() ?? null,
    initialBalanceDate: entity.initialBalanceDate,
  }
}
