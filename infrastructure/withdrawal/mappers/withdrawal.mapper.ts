import { Withdrawal } from "@domain/withdrawal/entities/withdrawal.entity"
import { EntityId, PositiveMoney, QuotaQuantity } from "@/value-objects"
import { withdrawal } from "@db-schemas/withdrawal.schema"

/**
 * @summary
 * Maps a withdrawal persistence row into a domain entity.
 *
 * @remarks
 * Reconstructs domain value objects from their persisted
 * primitive representations.
 *
 * @explanation
 * Use this function in the repository layer to build the
 * `Withdrawal` entity from a row of the `withdrawal` table.
 * It keeps database details out of the domain layer.
 *
 * @param row - Database row returned by **Drizzle**.
 *
 * @returns The hydrated entity.
 *
 * @example
 * const WD = toDomain(ROW);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export function toDomain(row: typeof withdrawal.$inferSelect): Withdrawal {
  return Withdrawal.create(
    {
      positionId: EntityId.create(row.positionId),
      date: row.date,
      amount: PositiveMoney.create(row.amount),
      quotas: QuotaQuantity.create(row.quotas),
      reversedAt: row.reversedAt,
      reversedByUserId: row.reversedByUserId
        ? EntityId.create(row.reversedByUserId)
        : null,
      version: row.version,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    },
    row.id
  )
}

/**
 * @summary
 * Maps a withdrawal domain entity into persistence data.
 *
 * @remarks
 * Unwraps domain value objects into their primitive
 * database representations.
 *
 * @explanation
 * Use this function in the insert path of the repository.
 * It prepares the entity as plain column values for the
 * `withdrawal` table.
 *
 * @param entity - Withdrawal domain entity.
 *
 * @returns Row insert values.
 *
 * @example
 * const WD = toInsert(WD);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export function toInsert(entity: Withdrawal): typeof withdrawal.$inferInsert {
  return {
    positionId: entity.positionId,
    date: entity.date,
    amount: entity.amount.value.toString(),
    quotas: entity.quotas.value.toString(),
    reversedAt: entity.reversedAt,
    reversedByUserId: entity.reversedByUserId,
    version: entity.version,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  }
}

/**
 * @summary
 * Maps an entity into update values.
 *
 * @remarks
 * Omits `createdAt`, `updatedAt` and `version`. The first
 * never changes; the second refreshes via `$onUpdate`.
 * `version` is managed by the repository to implement
 * optimistic locking.
 *
 * @explanation
 * `createdAt` is set once at insertion and never mutated.
 * `updatedAt` is auto-refreshed by **Drizzle**'s `$onUpdate`,
 * so passing it explicitly is unnecessary. `version`
 * increments inside the repository's compare-and-swap.
 *
 * @param entity - Withdrawal domain entity.
 *
 * @returns Row update values.
 *
 * @example
 * const WD = toUpdate(WD);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export function toUpdate(
  entity: Withdrawal
): Partial<typeof withdrawal.$inferInsert> {
  return {
    positionId: entity.positionId,
    date: entity.date,
    amount: entity.amount.value.toString(),
    quotas: entity.quotas.value.toString(),
    reversedAt: entity.reversedAt,
    reversedByUserId: entity.reversedByUserId,
  }
}
