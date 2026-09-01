import { eq, inArray } from "drizzle-orm";

import { Norm } from "@/business/entities/portfolio/norm.entity";
import type { INorm } from "@/business/interfaces/portfolio/norm.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import SignedPercentage from "@/business/value-objects/signed-percentage.vo";
import { norm } from "@/infrastructure/database/schemas";

import type { DbClient } from "../types";

/**
 * PostgreSQL-backed implementation of the {@link INorm} contract.
 *
 * Maps `norm` rows to `Norm` entities and back. Lookups rely on the
 * primary key and the category id index.
 *
 * Percentage columns are stored as `numeric`, which postgres returns
 * as strings; they are hydrated into `SignedPercentage` value objects
 * and persisted through their `.value.toString()` representation.
 *
 * A save inserts a new row when the entity has no id and updates the
 * existing row otherwise. Updates omit `updatedAt` so the `$onUpdate`
 * hook keeps the timestamp in sync with the mutation.
 */
export class NormRepository implements INorm {
  // --------------------------------------
  // FIELDS
  // --------------------------------------

  private readonly db: DbClient;

  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------

  /**
   * Creates a `NormRepository` bound to the provided database client.
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
   * Maps the provided `norm` row to a {@link Norm} entity.
   *
   * @param row - The database row.
   * @returns The hydrated `Norm` entity.
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
      row.id,
    );
  }

  /**
   * Maps the provided entity to the insert values of the `norm` table.
   *
   * @param entity - The norm to persist.
   * @returns The insert values.
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
    };
  }

  /**
   * Maps the provided entity to the mutable update values of the
   * `norm` table.
   *
   * `createdAt` and `updatedAt` are left out: `createdAt` never
   * changes and `updatedAt` is refreshed by the `$onUpdate` hook.
   *
   * @param entity - The norm to persist.
   * @returns The update values.
   */
  private toUpdate(entity: Norm): Partial<typeof norm.$inferInsert> {
    return {
      articleNumber: entity.articleNumber,
      name: entity.name,
      categoryId: entity.categoryId,
      minAllocation: entity.minAllocation.value.toString(),
      maxAllocation: entity.maxAllocation.value.toString(),
      targetAllocation: entity.targetAllocation.value.toString(),
    };
  }

  // --------------------------------------
  // QUERY METHODS
  // --------------------------------------

  /**
   * Retrieves the norm with the provided id.
   *
   * @see {@link INorm.findById}
   */
  async findById(id: string): Promise<Norm | null> {
    const [row] = await this.db
      .select()
      .from(norm)
      .where(eq(norm.id, id))
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  /**
   * Retrieves all norms belonging to the provided category id.
   *
   * @see {@link INorm.findAllByCategoryId}
   */
  async findAllByCategoryId(categoryId: string): Promise<Norm[]> {
    const rows = await this.db
      .select()
      .from(norm)
      .where(eq(norm.categoryId, categoryId));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves all norms belonging to any of the provided category ids.
   *
   * Batched lookup for hydrating norms across many categories without
   * falling into an N+1 query pattern.
   *
   * @param categoryIds - The ids of the categories to retrieve norms
   *   for.
   * @returns A promise resolving to the matching `Norm` entities.
   */
  async findAllByCategoryIds(categoryIds: string[]): Promise<Norm[]> {
    if (categoryIds.length === 0) {
      return [];
    }

    const rows = await this.db
      .select()
      .from(norm)
      .where(inArray(norm.categoryId, categoryIds));

    return rows.map((row) => this.toEntity(row));
  }

  // --------------------------------------
  // COMMAND METHODS
  // --------------------------------------

  /**
   * Persists the provided norm.
   *
   * @see {@link INorm.save}
   */
  async save(persisted: Norm): Promise<Norm> {
    if (persisted.id) {
      const [row] = await this.db
        .update(norm)
        .set(this.toUpdate(persisted))
        .where(eq(norm.id, persisted.id))
        .returning();

      if (!row) {
        throw new Error(`Norm with id ${persisted.id} was not found.`);
      }

      return this.toEntity(row);
    }

    const [row] = await this.db
      .insert(norm)
      .values(this.toInsert(persisted))
      .returning();

    return this.toEntity(row);
  }

  /**
   * Removes the norm with the provided id.
   *
   * @see {@link INorm.delete}
   */
  async delete(id: string): Promise<void> {
    await this.db.delete(norm).where(eq(norm.id, id));
  }
}
