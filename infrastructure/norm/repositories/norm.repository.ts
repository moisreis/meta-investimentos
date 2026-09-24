import { and, eq, inArray } from "drizzle-orm"
import type {
  PgAsyncDatabase,
  PgQueryResultHKT,
} from "drizzle-orm/pg-core"

import { Norm } from "@domain/norm/entities/norm.entity"
import type { INorm } from "@domain/norm/interfaces/norm.interface"
import { EntityId, SignedPercentage } from "@/value-objects"
import {
  ToDomain,
  ToInsert,
  ToUpdate,
} from "../mappers/norm.mapper"
import { norm } from "@db-schemas/norm.schema"
import { NotFoundError } from "@errors/not-found.error"
import { ConcurrencyError } from "@errors/concurrency.error"

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
   *
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
    const [ROW] = await this.db
      .select()
      .from(norm)
      .where(eq(norm.id, id))
      .limit(1)

    return ROW ? ToDomain(ROW) : null
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
   *
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
  async findAllByCategoryId(
    categoryId: EntityId
  ): Promise<Norm[]> {
    const ROWS = await this.db
      .select()
      .from(norm)
      .where(eq(norm.categoryId, categoryId))

    return ROWS.map((row) => ToDomain(row))
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
   *
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
  async findAllByCategoryIds(
    categoryIds: EntityId[]
  ): Promise<Norm[]> {
    if (categoryIds.length === 0) {
      return []
    }

    const ROWS = await this.db
      .select()
      .from(norm)
      .where(inArray(norm.categoryId, categoryIds))

    return ROWS.map((row) => ToDomain(row))
  }

  /**
   * @summary
   * Persists the provided norm.
   *
   * @remarks
   * Inserts a new row when the entity has no id. Updates
   * the existing row only when the persisted version
   * matches the stored version, and bumps the version.
   * Throws `ConcurrencyError` on version mismatch and
   * `NotFoundError` when the target row is missing.
   *
   * @explanation
   * Use this method to create or update a norm with
   * optimistic locking. Returns the persisted entity.
   *
   * @param persisted - The norm to persist.
   *
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
      const [ROW] = await this.db
        .update(norm)
        .set({
          ...ToUpdate(persisted),
          version: persisted.version + 1,
        })
        .where(
          and(
            eq(norm.id, persisted.id),
            eq(norm.version, persisted.version)
          )
        )
        .returning()

      if (ROW) {
        return ToDomain(ROW)
      }

      const [EXISTING] = await this.db
        .select({ id: norm.id })
        .from(norm)
        .where(eq(norm.id, persisted.id))
        .limit(1)

      if (!EXISTING) {
        throw new NotFoundError(
          `Norm with id ${persisted.id} was not found.`
        )
      }

      throw new ConcurrencyError(
        `Norm with id ${persisted.id} has a stale version.`
      )
    }

    const [ROW] = await this.db
      .insert(norm)
      .values(ToInsert(persisted))
      .returning()

    return ToDomain(ROW)
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
