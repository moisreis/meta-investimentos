import { Quota } from "@domain/quota/entities/quota.entity"
import { EntityId, QuotaPrice } from "@/value-objects"
import { quota } from "@db-schemas/quota.schema"

/**
 * @summary
 * Maps a quota persistence row into a domain entity.
 *
 * @remarks
 * Reconstructs domain value objects from their persisted
 * primitive representations.
 *
 * @param row - Database row returned by Drizzle.
 * @returns A hydrated `Quota` domain entity.
 */
export function toDomain(row: typeof quota.$inferSelect): Quota {
  return Quota.create(
    {
      fundId: EntityId.create(row.fundId),
      date: row.date,
      price: QuotaPrice.create(row.price),
      createdAt: row.createdAt,
    },
    row.id
  )
}

/**
 * @summary
 * Maps a quota domain entity into persistence data.
 *
 * @remarks
 * Unwraps domain value objects into their primitive
 * database representations.
 *
 * @param entity - Quota domain entity.
 * @returns Values compatible with the Drizzle insert schema.
 */
export function toInsert(entity: Quota): typeof quota.$inferInsert {
  return {
    fundId: entity.fundId,
    date: entity.date,
    price: entity.price.value.toString(),
    createdAt: entity.createdAt,
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
 * @param entity - Quota domain entity.
 * @returns Update values for the row.
 * @author Moisés Reis
 * @date 2026-09-15
 */
export function toUpdate(entity: Quota): Partial<typeof quota.$inferInsert> {
  return {
    fundId: entity.fundId,
    date: entity.date,
    price: entity.price.value.toString(),
  }
}
