import { eq, inArray } from "drizzle-orm"
import type { PgAsyncDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core"

import { Norm } from "@domain/norm/entities/norm.entity"
import type { INorm } from "@domain/norm/interfaces/norm.interface"
import { EntityId, SignedPercentage } from "@/value-objects"
import { norm } from "@db-schemas/norm.schema"
import { NotFoundError } from "@errors/not-found.error"

export type DbClient = PgAsyncDatabase<PgQueryResultHKT>

/**
 * @summary
 * Implements the norm persistence contract.
 *
 * @remarks
 * Maps `norm` rows to `Norm` entities and back. Lookups
 * rely on the primary key and the category id index.
 * Percentage columns are stored as `numeric`, which
 * **PostgreSQL** returns as strings; they are hydrated into
 * `SignedPercentage` value objects. A save inserts a new
 * row when the entity has no id and updates the existing
 * row otherwise.
 *
 * @explanation
 * Use this repository for all norm data access in the
 * infrastructure layer. It translates rows into domain
 * entities and persists entity changes. Updates omit
 * `updatedAt` so the `$onUpdate` hook keeps the timestamp
 * in sync with the mutation.
 *
 * @example
 * const NORM_REPO = new NormRepository(DB_CLIENT);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class NormRepository implements INorm {
  private readonly db: DbClient

  /**
   * @summary
   * Binds the repository to a database client.
   *
   * @remarks
   * The client runs every query issued by the repository.
   *
   * @explanation
   * Use this constructor to provide the **PostgreSQL**
   * client used by all repository operations.
   *
   * @param db - The **Drizzle** database client.
   *
   * @example
   * const NORM_REPO = new NormRepository(DB_CLIENT);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  constructor(db: DbClient) {
    this.db = db
  }

  /**
   * @summary
   * Maps a database row to a domain entity.
   *
   * @remarks
   * Hydrates value objects through their `create` method.
   *
   * @explanation
   * Converts persisted columns into the domain shape so
   * services work with entities, not raw rows.
   *
   * @param row - The row returned by the query.
   * @returns The hydrated entity.
   *
   * @example
   * const ENTITY = toEntity(ROW);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  private toEntity(row: typeof norm.$inferSelect): Norm {
    return Norm.create(
      {
        articleNumber: row.articleNumber,
        name: row.name,
        categoryId: EntityId.create(row.categoryId),
        minAllocation: SignedPercentage.create(row.minAllocation),
        maxAllocation: SignedPercentage.create(row.maxAllocation),
        targetAllocation: SignedPercentage.create(row.targetAllocation),
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      },
      row.id
    )
  }

  /**
   * @summary
   * Maps a domain entity to insert values.
   *
   * @remarks
   * Converts `SignedPercentage` values to strings for
   * **Drizzle** insert operations.
   *
   * @explanation
   * Produces the column map required by **Drizzle** when
   * inserting a new norm row.
   *
   * @param entity - The norm to persist.
   * @returns The insert values.
   *
   * @example
   * const VALUES = toInsert(NORM);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  private toInsert(entity: Norm): typeof norm.$inferInsert {
    return {
      articleNumber: entity.articleNumber,
      name: entity.name,
      categoryId: entity.categoryId,
      minAllocation: entity.minAllocation.value.toString(),
      maxAllocation: entity.maxAllocation.value.toString(),
      targetAllocation: entity.targetAllocation.value.toString(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
  }

  /**
   * @summary
   * Maps a domain entity to mutable update values.
   *
   * @remarks
   * Omits `createdAt` and `updatedAt`. The `updatedAt`
   * field is refreshed by the `$onUpdate` hook.
   *
   * @explanation
   * Produces the column map required by **Drizzle** when
   * updating an existing norm row.
   *
   * @param entity - The norm to persist.
   * @returns The update values.
   *
   * @example
   * const VALUES = toUpdate(NORM);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  private toUpdate(entity: Norm): Partial<typeof norm.$inferInsert> {
    return {
      articleNumber: entity.articleNumber,
      name: entity.name,
      categoryId: entity.categoryId,
      minAllocation: entity.minAllocation.value.toString(),
      maxAllocation: entity.maxAllocation.value.toString(),
      targetAllocation: entity.targetAllocation.value.toString(),
    }
  }

  /**
   * @summary
   * Retrieves the norm with the provided id.
   *
   * @remarks
   * Returns null when no row matches the id.
   *
   * @explanation
   * Use this method to load a norm by its primary key.
   * Callers must handle the null result.
   *
   * @param id - The unique identifier of the norm.
   * @returns The entity or `null`.
   *
   * @example
   * const NORM = await NORM_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findById(id: EntityId): Promise<Norm | null> {
    const [row] = await this.db
      .select()
      .from(norm)
      .where(eq(norm.id, id))
      .limit(1)

    return row ? this.toEntity(row) : null
  }

  /**
   * @summary
   * Retrieves all norms for the provided category id.
   *
   * @remarks
   * Returns an empty array when no rows match.
   *
   * @explanation
   * Use this method to load every norm that belongs to a
   * single category.
   *
   * @param categoryId - The category to filter by.
   * @returns The matching norms.
   *
   * @example
   * const NORMS = await NORM_REPO
   *   .findAllByCategoryId(CATEGORY_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByCategoryId(categoryId: EntityId): Promise<Norm[]> {
    const rows = await this.db
      .select()
      .from(norm)
      .where(eq(norm.categoryId, categoryId))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Retrieves all norms with any of the provided category ids.
   *
   * @remarks
   * Batched lookup avoids an N+1 query pattern. Returns
   * an empty array when the input is empty.
   *
   * @explanation
   * Use this method to hydrate many norms across multiple
   * categories in a single query.
   *
   * @param categoryIds - The ids of the categories.
   * @returns The matching norms.
   *
   * @example
   * const NORMS = await NORM_REPO
   *   .findAllByCategoryIds(CATEGORY_IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByCategoryIds(categoryIds: string[]): Promise<Norm[]> {
    if (categoryIds.length === 0) {
      return []
    }

    const rows = await this.db
      .select()
      .from(norm)
      .where(inArray(norm.categoryId, categoryIds))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Persists the provided norm.
   *
   * @remarks
   * Inserts a new row when the entity has no id. Updates
   * the existing row otherwise. Throws `NotFoundError` when
   * the target row is missing.
   *
   * @explanation
   * Use this method to create or update a norm. Returns
   * the persisted entity with its id.
   *
   * @param persisted - The norm to persist.
   * @returns The persisted entity.
   *
   * @example
   * const SAVED = await NORM_REPO.save(NORM);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async save(persisted: Norm): Promise<Norm> {
    if (persisted.id) {
      const [row] = await this.db
        .update(norm)
        .set(this.toUpdate(persisted))
        .where(eq(norm.id, persisted.id))
        .returning()

      if (!row) {
        throw new NotFoundError(`Norm with id ${persisted.id} was not found.`)
      }

      return this.toEntity(row)
    }

    const [row] = await this.db
      .insert(norm)
      .values(this.toInsert(persisted))
      .returning()

    return this.toEntity(row)
  }

  /**
   * @summary
   * Removes the norm with the provided id.
   *
   * @remarks
   * Resolves when the row is removed.
   *
   * @explanation
   * Use this method to delete a norm by its primary key.
   *
   * @param id - The unique identifier of the norm.
   *
   * @example
   * await NORM_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async delete(id: EntityId): Promise<void> {
    await this.db.delete(norm).where(eq(norm.id, id))
  }
}
