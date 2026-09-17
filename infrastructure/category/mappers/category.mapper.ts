import { Category } from "@domain/category/entities/category.entity"
import { category } from "@db-schemas/category.schema"

/**
 * @summary
 * Maps a category persistence row into a domain entity.
 *
 * @remarks
 * Reconstructs domain value objects from their persisted
 * primitive representations.
 *
 * @param row - Database row returned by Drizzle.
 * @returns A hydrated `Category` domain entity.
 */
export function toDomain(row: typeof category.$inferSelect): Category {
  return Category.create(
    {
      name: row.name,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    },
    row.id
  )
}

/**
 * @summary
 * Maps a category domain entity into persistence data.
 *
 * @remarks
 * Unwraps domain value objects into their primitive
 * database representations.
 *
 * @param entity - Category domain entity.
 * @returns Values compatible with the Drizzle insert schema.
 */
export function toInsert(entity: Category): typeof category.$inferInsert {
  return {
    name: entity.name,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  }
}

/**
 * @summary
 * Maps a category entity into update values.
 *
 * @remarks
 * Omits `createdAt` and `updatedAt`. The first never
 * changes; the second refreshes via `$onUpdate`.
 *
 * @explanation
 * Use for updates where Drizzle should only touch mutable
 * columns. Timestamps are managed at the database layer.
 *
 * @param entity - Category domain entity.
 * @returns Update values for the row.
 *
 * @author Moisés Reis
 * @date 2026-09-15
 */
export function toUpdate(
  entity: Category
): Partial<typeof category.$inferInsert> {
  return {
    name: entity.name,
  }
}
