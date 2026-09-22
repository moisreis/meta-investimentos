import { asc, eq, inArray } from "drizzle-orm"
import type { PgAsyncDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core"

import { Category } from "@domain/category/entities/category.entity"
import type { ICategory } from "@domain/category/interfaces/category.interface"
import type { EntityId } from "@/value-objects"
import { toDomain, toInsert, toUpdate } from "../mappers/category.mapper"
import { category } from "@db-schemas/category.schema"
import { NotFoundError } from "@errors/not-found.error"

export type DbClient = PgAsyncDatabase<PgQueryResultHKT>

/**
 * @summary
 * Implements the category persistence contract.
 *
 * @remarks
 * Maps `category` rows to `Category` entities and back.
 * Lookups rely on the primary key and the name unique
 * constraint.
 *
 * @explanation
 * Use this repository for all category data access in the
 * infrastructure layer. It translates rows into domain
 * entities and persists entity changes.
 *
 * @example
 * const REPO = new CategoryRepository(DB_CLIENT);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class CategoryRepository implements ICategory {
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
   * const REPO = new CategoryRepository(DB_CLIENT);
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
   * Retrieves the category with the provided id.
   *
   * @remarks
   * Returns null when no row matches the id.
   *
   * @explanation
   * Use this method to load a category by its primary key.
   * Callers must handle the null result.
   *
   * @param id - The unique identifier of the category.
   *
   * @returns The entity or `null`.
   *
   * @example
   * const CAT = await CATEGORY_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findById(id: EntityId): Promise<Category | null> {
    const [row] = await this.db
      .select()
      .from(category)
      .where(eq(category.id, id))
      .limit(1)

    return row ? toDomain(row) : null
  }

  /**
   * @summary
   * Retrieves the category with the provided name.
   *
   * @remarks
   * Returns null when no row matches the name.
   *
   * @explanation
   * Use this method to load a category by its unique name.
   * Callers must handle the null result.
   *
   * @param name - The unique name of the category.
   *
   * @returns The entity or `null`.
   *
   * @example
   * const CAT = await CATEGORY_REPO
   *   .findByName("Fixed Income");
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findByName(name: string): Promise<Category | null> {
    const [row] = await this.db
      .select()
      .from(category)
      .where(eq(category.name, name))
      .limit(1)

    return row ? toDomain(row) : null
  }

  /**
   * @summary
   * Retrieves all categories, optionally paginated.
   *
   * @remarks
   * Results are sorted by `name` ascending. Defaults to
   * a limit of 100 rows.
   *
   * @explanation
   * Use this method to list all categories. Pass pagination
   * options to control the window of results.
   *
   * @param options - Optional pagination parameters.
   *
   * @returns The matching entities.
   *
   * @example
   * const CATS = await CATEGORY_REPO.findAll({
   *   limit: 10,
   *   offset: 0,
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAll(options?: {
    limit?: number
    offset?: number
  }): Promise<Category[]> {
    const rows = await this.db
      .select()
      .from(category)
      .orderBy(asc(category.name))
      .limit(options?.limit ?? 100)
      .offset(options?.offset ?? 0)

    return rows.map((row) => toDomain(row))
  }

  /**
   * @summary
   * Retrieves all categories with any of the provided ids.
   *
   * @remarks
   * Batched lookup avoids an N+1 query pattern. Returns
   * an empty array when no ids match.
   *
   * @explanation
   * Use this method to hydrate many categories in one
   * query instead of one query per id.
   *
   * @param ids - The ids of the categories to retrieve.
   *
   * @returns The matching entities.
   *
   * @example
   * const CATS = await CATEGORY_REPO
   *   .findAllByIds(IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByIds(ids: EntityId[]): Promise<Category[]> {
    if (ids.length === 0) {
      return []
    }

    const rows = await this.db
      .select()
      .from(category)
      .where(inArray(category.id, ids))

    return rows.map((row) => toDomain(row))
  }

  /**
   * @summary
   * Persists the provided category.
   *
   * @remarks
   * Inserts a new row when the entity has no id. Updates
   * the existing row otherwise.
   *
   * @explanation
   * Use this method to create or update a category.
   * Returns the persisted entity with its id.
   *
   * @param persisted - The category to persist.
   *
   * @returns The persisted entity.
   *
   * @example
   * const SAVED = await CATEGORY_REPO.save(CATEGORY);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async save(persisted: Category): Promise<Category> {
    if (persisted.id) {
      const [row] = await this.db
        .update(category)
        .set(toUpdate(persisted))
        .where(eq(category.id, persisted.id))
        .returning()

      if (!row) {
        throw new NotFoundError(
          `Category with id ${persisted.id} was not found.`
        )
      }

      return toDomain(row)
    }

    const [row] = await this.db
      .insert(category)
      .values(toInsert(persisted))
      .returning()

    return toDomain(row)
  }

  /**
   * @summary
   * Removes the category with the provided id.
   *
   * @remarks
   * Resolves when the row is removed.
   *
   * @explanation
   * Use this method to delete a category by its primary
   * key.
   *
   * @param id - The unique identifier of the category.
   *
   * @example
   * await CATEGORY_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async delete(id: EntityId): Promise<void> {
    await this.db.delete(category).where(eq(category.id, id))
  }
}
