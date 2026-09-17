import { TransactionAllocation } from "@domain/transaction-allocation/entities/transaction-allocation.entity"
import { EntityId, QuotaQuantity } from "@/value-objects"
import { transactionAllocation } from "@db-schemas/transaction-allocation.schema"

/**
 * @summary
 * Maps a transaction allocation persistence row into a
 * domain entity.
 *
 * @remarks
 * Reconstructs domain value objects from their persisted
 * primitive representations.
 *
 * @param row - Database row returned by Drizzle.
 * @returns A hydrated `TransactionAllocation` domain entity.
 */
export function toDomain(
  row: typeof transactionAllocation.$inferSelect
): TransactionAllocation {
  return TransactionAllocation.create(
    {
      applicationId: EntityId.create(row.applicationId),
      withdrawId: EntityId.create(row.withdrawId),
      quotasConsumed: QuotaQuantity.create(row.quotasConsumed),
      version: row.version,
      createdAt: row.createdAt,
    },
    row.id
  )
}

/**
 * @summary
 * Maps a transaction allocation domain entity into
 * persistence data.
 *
 * @remarks
 * Unwraps domain value objects into their primitive
 * database representations.
 *
 * @param entity - Transaction allocation domain entity.
 * @returns Values compatible with the Drizzle insert schema.
 */
export function toInsert(
  entity: TransactionAllocation
): typeof transactionAllocation.$inferInsert {
  return {
    applicationId: entity.applicationId,
    withdrawId: entity.withdrawId,
    quotasConsumed: entity.quotasConsumed.value.toString(),
    version: entity.version,
    createdAt: entity.createdAt,
  }
}

/**
 * @summary Maps an entity into update values.
 *
 * @remarks
 * Omits `createdAt`, `updatedAt` and `version`. The first
 * never changes; the second refreshes via `$onUpdate`.
 * `version` is managed by the repository to implement
 * optimistic locking.
 *
 * @explanation
 * `createdAt` is set once at insertion and never mutated.
 * `updatedAt` is auto-refreshed by Drizzle's `$onUpdate`,
 * so passing it explicitly is unnecessary. `version`
 * increments inside the repository's compare-and-swap.
 *
 * @param entity - Transaction allocation domain entity.
 * @returns Update values for the row.
 * @author Moisés Reis
 * @date 2026-09-15
 */
export function toUpdate(
  entity: TransactionAllocation
): Partial<typeof transactionAllocation.$inferInsert> {
  return {
    applicationId: entity.applicationId,
    withdrawId: entity.withdrawId,
    quotasConsumed: entity.quotasConsumed.value.toString(),
  }
}
