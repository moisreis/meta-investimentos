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
 * @explanation
 * Use this function in the repository layer to build the
 * `Application` entity from a row of the `application`
 * table.
 * It keeps database details out of the domain layer.
 *
 * @param row - Database row returned by **Drizzle**.
 *
 * @returns The hydrated entity.
 *
 * @example
 * const APP = toDomain(ROW);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
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
 * @explanation
 * Use this function in the insert path of the repository.
 * It prepares the entity as plain column values for the
 * `application` table.
 *
 * @param entity - Application domain entity.
 *
 * @returns Row insert values.
 *
 * @example
 * const APP = toInsert(APP);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
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
 *
 * @returns Row update values.
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
