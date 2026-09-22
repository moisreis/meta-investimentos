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
 * @explanation
 * Use this function in the repository layer to build the
 * `Quota` entity from a row of the `quota` table.
 * It keeps database details out of the domain layer.
 *
 * @param row - Database row returned by **Drizzle**.
 *
 * @returns The hydrated entity.
 *
 * @example
 * const QUOTA = toDomain(ROW);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
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
 * @explanation
 * Use this function in the insert path of the repository.
 * It prepares the entity as plain column values for the
 * `quota` table.
 *
 * @param entity - Quota domain entity.
 *
 * @returns Row insert values.
 *
 * @example
 * const QUOTA = toInsert(QUOTA);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
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
 * @param entity - Quota domain entity.
 *
 * @returns Row update values.
 *
 * @example
 * const QUOTA = toUpdate(QUOTA);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export function toUpdate(entity: Quota): Partial<typeof quota.$inferInsert> {
  return {
    fundId: entity.fundId,
    date: entity.date,
    price: entity.price.value.toString(),
  }
}
