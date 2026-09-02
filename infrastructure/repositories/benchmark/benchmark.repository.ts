import { desc, eq, inArray } from "drizzle-orm";

import { Benchmark } from "@/business/entities/benchmark/benchmark.entity";
import type { IBenchmark } from "@/business/interfaces/benchmark/benchmark.interface";
import type { EntityId } from "@/business/value-objects/entity-id.vo";
import { benchmark } from "@/infrastructure/database/schemas";
import { NotFoundError } from "@/shared/errors";

import type { DbClient } from "../types";

/**
 * PostgreSQL-backed implementation of the {@link IBenchmark} contract.
 *
 * Maps `benchmark` rows to `Benchmark` entities and back. Lookups rely
 * on the primary key and the acronym index.
 *
 * A save inserts a new row when the entity has no id and updates the
 * existing row otherwise.
 */
export class BenchmarkRepository implements IBenchmark {
  private readonly db: DbClient;

  /**
   * Creates a `BenchmarkRepository` bound to the provided database
   * client.
   *
   * @param db - The database client to run queries against.
   */
  constructor(db: DbClient) {
    this.db = db;
  }

  /**
   * Maps the provided `benchmark` row to a {@link Benchmark} entity.
   *
   * @param row - The database row.
   * @returns The hydrated `Benchmark` entity.
   */
  private toEntity(row: typeof benchmark.$inferSelect): Benchmark {
    return Benchmark.create(
      {
        acronym: row.acronym,
        name: row.name,
        createdAt: row.createdAt,
      },
      row.id,
    );
  }

  /**
   * Maps the provided entity to the insert values of the `benchmark`
   * table.
   *
   * @param entity - The benchmark to persist.
   * @returns The insert values.
   */
  private toInsert(entity: Benchmark): typeof benchmark.$inferInsert {
    return {
      acronym: entity.acronym,
      name: entity.name,
      createdAt: entity.createdAt,
    };
  }

  /**
   * Maps the provided entity to the mutable update values of the
   * `benchmark` table.
   *
   * `createdAt` never changes and is left out of the update.
   *
   * @param entity - The benchmark to persist.
   * @returns The update values.
   */
  private toUpdate(entity: Benchmark): Partial<typeof benchmark.$inferInsert> {
    return {
      acronym: entity.acronym,
      name: entity.name,
    };
  }

  /**
   * Retrieves the benchmark with the provided id.
   *
   * @see {@link IBenchmark.findById}
   */
  async findById(id: EntityId): Promise<Benchmark | null> {
    const [row] = await this.db
      .select()
      .from(benchmark)
      .where(eq(benchmark.id, id))
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  /**
   * Retrieves all benchmarks with any of the provided ids.
   *
   * Batched lookup for hydrating many benchmarks without falling into
   * an N+1 query pattern.
   *
   * @param ids - The ids of the benchmarks to retrieve.
   * @returns A promise resolving to the matching `Benchmark` entities.
   */
  async findAllByIds(ids: string[]): Promise<Benchmark[]> {
    if (ids.length === 0) {
      return [];
    }

    const rows = await this.db
      .select()
      .from(benchmark)
      .where(inArray(benchmark.id, ids));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves the benchmark with the provided acronym.
   *
   * Because the unique constraint covers the acronym/name pair, the
   * acronym alone may match several rows; the most recently created
   * one wins.
   *
   * @see {@link IBenchmark.findByAcronym}
   */
  async findByAcronym(acronym: string): Promise<Benchmark | null> {
    const [row] = await this.db
      .select()
      .from(benchmark)
      .where(eq(benchmark.acronym, acronym))
      .orderBy(desc(benchmark.createdAt))
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  /**
   * Persists the provided benchmark.
   *
   * @see {@link IBenchmark.save}
   */
  async save(persisted: Benchmark): Promise<Benchmark> {
    if (persisted.id) {
      const [row] = await this.db
        .update(benchmark)
        .set(this.toUpdate(persisted))
        .where(eq(benchmark.id, persisted.id))
        .returning();

      if (!row) {
        throw new NotFoundError(
          `Benchmark with id ${persisted.id} was not found.`,
        );
      }

      return this.toEntity(row);
    }

    const [row] = await this.db
      .insert(benchmark)
      .values(this.toInsert(persisted))
      .returning();

    return this.toEntity(row);
  }

  /**
   * Removes the benchmark with the provided id.
   *
   * @see {@link IBenchmark.delete}
   */
  async delete(id: EntityId): Promise<void> {
    await this.db.delete(benchmark).where(eq(benchmark.id, id));
  }
}
