import { Norm } from "@domain/norm/entities/norm.entity"
import { EntityId, SignedPercentage } from "@/value-objects"
import { norm } from "@db-schemas/norm.schema"

/**
 * @summary
 * Maps a norm persistence row into a domain entity.
 *
 * @remarks
 * Reconstructs domain value objects from their persisted
 * primitive representations.
 *
 * @param row - Database row returned by Drizzle.
 * @returns A hydrated `Norm` domain entity.
 */
export function toDomain(row: typeof norm.$inferSelect): Norm {
  return Norm.create(
    {
      articleNumber: row.articleNumber,
      name: row.name,
      categoryId: EntityId.create(row.categoryId),
      minAllocation: SignedPercentage.create(row.minAllocation),
      maxAllocation: SignedPercentage.create(row.maxAllocation),
      targetAllocation: SignedPercentage.create(row.targetAllocation),
      version: row.version,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    },
    row.id
  )
}

/**
 * @summary
 * Maps a norm domain entity into persistence data.
 *
 * @remarks
 * Unwraps domain value objects into their primitive
 * database representations.
 *
 * @param entity - Norm domain entity.
 * @returns Values compatible with the Drizzle insert schema.
 */
export function toInsert(entity: Norm): typeof norm.$inferInsert {
  return {
    articleNumber: entity.articleNumber,
    name: entity.name,
    categoryId: entity.categoryId,
    minAllocation: entity.minAllocation.value.toString(),
    maxAllocation: entity.maxAllocation.value.toString(),
    targetAllocation: entity.targetAllocation.value.toString(),
    version: entity.version,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  }
}

/**
 * @summary
 * Maps a norm entity into update values.
 *
 * @remarks
 * Omits `createdAt`, `updatedAt` and `version`. The first
 * never changes; the second refreshes via `$onUpdate`.
 * `version` is managed by the repository to implement
 * optimistic locking.
 *
 * @explanation
 * Use for updates where Drizzle should only touch mutable
 * columns. Timestamps are managed at the database layer.
 *
 * @param entity - Norm domain entity.
 * @returns Update values for the row.
 *
 * @author Moisés Reis
 * @date 2026-09-15
 */
export function toUpdate(entity: Norm): Partial<typeof norm.$inferInsert> {
  return {
    articleNumber: entity.articleNumber,
    name: entity.name,
    categoryId: entity.categoryId,
    minAllocation: entity.minAllocation.value.toString(),
    maxAllocation: entity.maxAllocation.value.toString(),
    targetAllocation: entity.targetAllocation.value.toString(),
  }
}
