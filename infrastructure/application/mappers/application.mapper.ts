import { Application } from "@domain/application/entities/application.entity"
import { EntityId, PositiveMoney, QuotaQuantity } from "@/value-objects"
import { application } from "@db-schemas/application.schema"

/**
 * @summary
 * Maps an application persistence row into a domain entity.
 *
 * @remarks
 * Reconstructs domain value objects from their persisted
 * primitive representations.
 *
 * @param row - Database row returned by Drizzle.
 * @returns A hydrated `Application` domain entity.
 */
export function toDomain(row: typeof application.$inferSelect): Application {
  return Application.create(
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
 * Maps an application domain entity into persistence data.
 *
 * @remarks
 * Unwraps domain value objects into their primitive
 * database representations.
 *
 * @param entity - Application domain entity.
 * @returns Values compatible with the Drizzle insert schema.
 */
export function toInsert(entity: Application): typeof application.$inferInsert {
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
 * Maps an application entity into update values.
 *
 * @remarks
 * Omits `createdAt`, `updatedAt` and `version`. The first
 * never changes; the second refreshes via `$onUpdate`.
 * `version` is managed by the repository to implement
 * optimistic locking.
 *
 * @param entity - Application domain entity.
 * @returns Update values for the row.
 */
export function toUpdate(
  entity: Application
): Partial<typeof application.$inferInsert> {
  return {
    positionId: entity.positionId,
    date: entity.date,
    amount: entity.amount.value.toString(),
    quotas: entity.quotas.value.toString(),
    reversedAt: entity.reversedAt,
    reversedByUserId: entity.reversedByUserId,
  }
}
