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
 * @explanation
 * Use this function in the repository layer to build the
 * `Category` entity from a row of the `category` table.
 * It keeps database details out of the domain layer.
 *
 * @param row - Database row returned by **Drizzle**.
 *
 * @returns The hydrated entity.
 *
 * @example
 * const CAT = toDomain(ROW);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
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
 * @explanation
 * Use this function in the insert path of the repository.
 * It prepares the entity as plain column values for the
 * `category` table.
 *
 * @param entity - Category domain entity.
 *
 * @returns Row insert values.
 *
 * @example
 * const CAT = toInsert(CAT);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
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
 * Use for updates where **Drizzle** should only touch mutable
 * columns. Timestamps are managed at the database layer.
 *
 * @param entity - Category domain entity.
 *
 * @returns Row update values.
 *
 * @example
 * const CAT = toUpdate(CAT);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export function toUpdate(
  entity: Category
): Partial<typeof category.$inferInsert> {
  return {
    name: entity.name,
  }
}
