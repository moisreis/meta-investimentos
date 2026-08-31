import { eq, inArray } from "drizzle-orm";

import { Category } from "@/business/entities/fund/category.entity";
import type { ICategory } from "@/business/interfaces/fund/category.interface";
import { category } from "@/infrastructure/database/schemas";

import type { DbClient } from "../types";

/**
 * PostgreSQL-backed implementation of the {@link ICategory} contract.
 *
 * Maps `category` rows to `Category` entities and back. Lookups rely
 * on the primary key and the name unique constraint.
 *
 * A save inserts a new row when the entity has no id and updates the
 * existing row otherwise. Updates omit `updatedAt` so the `$onUpdate`
 * hook keeps the timestamp in sync with the mutation.
 */
export class CategoryRepository implements ICategory {
  // --------------------------------------
  // FIELDS
  // --------------------------------------

  private readonly db: DbClient;

  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------

  /**
   * Creates a `CategoryRepository` bound to the provided database
   * client.
   *
   * @param db - The database client to run queries against.
   */
  constructor(db: DbClient) {
    this.db = db;
  }

  // --------------------------------------
  // MAPPING METHODS
  // --------------------------------------

  /**
   * Maps the provided `category` row to a {@link Category} entity.
   *
   * @param row - The database row.
   * @returns The hydrated `Category` entity.
   */
  private toEntity(row: typeof category.$inferSelect): Category {
    return Category.create(
      {
        name: row.name,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      },
      row.id,
    );
  }

  /**
   * Maps the provided entity to the insert values of the `category`
   * table.
   *
   * @param entity - The category to persist.
   * @returns The insert values.
   */
  private toInsert(entity: Category): typeof category.$inferInsert {
    return {
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  /**
   * Maps the provided entity to the mutable update values of the
   * `category` table.
   *
   * `createdAt` and `updatedAt` are left out: `createdAt` never
   * changes and `updatedAt` is refreshed by the `$onUpdate` hook.
   *
   * @param entity - The category to persist.
   * @returns The update values.
   */
  private toUpdate(entity: Category): Partial<typeof category.$inferInsert> {
    return {
      name: entity.name,
    };
  }

  // --------------------------------------
  // QUERY METHODS
  // --------------------------------------

  /**
   * Retrieves the category with the provided id.
   *
   * @see {@link ICategory.findById}
   */
  async findById(id: string): Promise<Category | null> {
    const [row] = await this.db
      .select()
      .from(category)
      .where(eq(category.id, id))
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  /**
   * Retrieves the category with the provided name.
   *
   * @see {@link ICategory.findByName}
   */
  async findByName(name: string): Promise<Category | null> {
    const [row] = await this.db
      .select()
      .from(category)
      .where(eq(category.name, name))
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  /**
   * Retrieves all categories with any of the provided ids.
   *
   * Batched lookup for hydrating many categories without falling into
   * an N+1 query pattern.
   *
   * @param ids - The ids of the categories to retrieve.
   * @returns A promise resolving to the matching `Category` entities.
   */
  async findAllByIds(ids: string[]): Promise<Category[]> {
    if (ids.length === 0) {
      return [];
    }

    const rows = await this.db
      .select()
      .from(category)
      .where(inArray(category.id, ids));

    return rows.map((row) => this.toEntity(row));
  }

  // --------------------------------------
  // COMMAND METHODS
  // --------------------------------------

  /**
   * Persists the provided category.
   *
   * @see {@link ICategory.save}
   */
  async save(persisted: Category): Promise<Category> {
    if (persisted.id) {
      const [row] = await this.db
        .update(category)
        .set(this.toUpdate(persisted))
        .where(eq(category.id, persisted.id))
        .returning();

      if (!row) {
        throw new Error(`Category with id ${persisted.id} was not found.`);
      }

      return this.toEntity(row);
    }

    const [row] = await this.db
      .insert(category)
      .values(this.toInsert(persisted))
      .returning();

    return this.toEntity(row);
  }

  /**
   * Removes the category with the provided id.
   *
   * @see {@link ICategory.delete}
   */
  async delete(id: string): Promise<void> {
    await this.db.delete(category).where(eq(category.id, id));
  }
}
