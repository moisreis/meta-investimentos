import { asc, desc, eq, inArray } from "drizzle-orm"
import type { PgAsyncDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core"

import { Benchmark } from "@domain/benchmark/entities/benchmark.entity"
import type { IBenchmark } from "@domain/benchmark-history/interfaces/benchmark.interface"
import type { EntityId } from "@/value-objects"
import { benchmark } from "@db-schemas/benchmark.schema"
import { NotFoundError } from "@errors/not-found.error"

export type DbClient = PgAsyncDatabase<PgQueryResultHKT>

/**
 * @summary
 * Implements the benchmark persistence contract.
 *
 * @remarks
 * Maps `benchmark` rows to `Benchmark` entities and back.
 * Lookups rely on the primary key and the acronym index.
 *
 * @explanation
 * Use this repository for all benchmark data access in the
 * infrastructure layer. It translates rows into domain
 * entities and persists entity changes.
 *
 * @example
 * const REPO = new BenchmarkRepository(DB_CLIENT);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class BenchmarkRepository implements IBenchmark {
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
   * const REPO = new BenchmarkRepository(DB_CLIENT);
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
  private toEntity(row: typeof benchmark.$inferSelect): Benchmark {
    return Benchmark.create(
      {
        acronym: row.acronym,
        name: row.name,
        createdAt: row.createdAt,
      },
      row.id
    )
  }

  /**
   * @summary
   * Maps a domain entity to insert values.
   *
   * @remarks
   * Maps entity fields to their database column names.
   *
   * @explanation
   * Converts an entity into the shape expected by
   * **Drizzle** insert operations.
   *
   * @param entity - The entity to serialize.
   * @returns The insert values.
   *
   * @example
   * const VALUES = toInsert(ENTITY);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  private toInsert(entity: Benchmark): typeof benchmark.$inferInsert {
    return {
      acronym: entity.acronym,
      name: entity.name,
      createdAt: entity.createdAt,
    }
  }

  /**
   * @summary
   * Maps a domain entity to update values.
   *
   * @remarks
   * Omits `createdAt` which never changes.
   *
   * @explanation
   * Converts an entity into the shape expected by
   * **Drizzle** update operations.
   *
   * @param entity - The entity to serialize.
   * @returns The update values.
   *
   * @example
   * const VALUES = toUpdate(ENTITY);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  private toUpdate(entity: Benchmark): Partial<typeof benchmark.$inferInsert> {
    return {
      acronym: entity.acronym,
      name: entity.name,
    }
  }

  /**
   * @summary
   * Retrieves the benchmark with the provided id.
   *
   * @remarks
   * Returns `null` when no row matches the id.
   *
   * @explanation
   * Use this method to load a benchmark by its primary key.
   * Callers must handle the null result.
   *
   * @param id - The unique identifier of the benchmark.
   * @returns The entity or `null`.
   *
   * @example
   * const BENCH = await BENCHMARK_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findById(id: EntityId): Promise<Benchmark | null> {
    const [row] = await this.db
      .select()
      .from(benchmark)
      .where(eq(benchmark.id, id))
      .limit(1)

    return row ? this.toEntity(row) : null
  }

  /**
   * @summary
   * Retrieves all benchmarks, optionally paginated.
   *
   * @remarks
   * Defaults to 100 rows starting at offset 0. Results are
   * ordered by name ascending.
   *
   * @explanation
   * Use this method to list benchmarks with optional
   * pagination.
   *
   * @param options - Optional pagination parameters.
   * @returns The matching benchmarks.
   *
   * @example
   * const ALL = await BENCHMARK_REPO.findAll({
   *   limit: 50,
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
  }): Promise<Benchmark[]> {
    const rows = await this.db
      .select()
      .from(benchmark)
      .orderBy(asc(benchmark.name))
      .limit(options?.limit ?? 100)
      .offset(options?.offset ?? 0)

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Retrieves all benchmarks with any of the provided ids.
   *
   * @remarks
   * Batched lookup avoids an N+1 query pattern. Returns
   * an empty array when no ids match.
   *
   * @explanation
   * Use this method to hydrate many benchmarks in one
   * query instead of one query per benchmark.
   *
   * @param ids - The ids of the benchmarks.
   * @returns The matching benchmarks.
   *
   * @example
   * const BENCHES = await BENCHMARK_REPO
   *   .findAllByIds(IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByIds(ids: string[]): Promise<Benchmark[]> {
    if (ids.length === 0) {
      return []
    }

    const rows = await this.db
      .select()
      .from(benchmark)
      .where(inArray(benchmark.id, ids))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Retrieves the benchmark with the provided acronym.
   *
   * @remarks
   * The unique constraint covers the acronym/name pair, so
   * the acronym alone may match several rows. The most
   * recently created one wins.
   *
   * @explanation
   * Use this method to load a benchmark by its acronym.
   * The result is null when no row matches.
   *
   * @param acronym - The acronym of the benchmark.
   * @returns The entity or `null`.
   *
   * @example
   * const BENCH = await BENCHMARK_REPO
   *   .findByAcronym("CDI");
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findByAcronym(acronym: string): Promise<Benchmark | null> {
    const [row] = await this.db
      .select()
      .from(benchmark)
      .where(eq(benchmark.acronym, acronym))
      .orderBy(desc(benchmark.createdAt))
      .limit(1)

    return row ? this.toEntity(row) : null
  }

  /**
   * @summary
   * Persists the provided benchmark.
   *
   * @remarks
   * Inserts a new row when the entity has no id. Updates
   * the existing row otherwise.
   *
   * @explanation
   * Use this method to create or update a benchmark. Returns
   * the persisted entity with its id.
   *
   * @param persisted - The benchmark to persist.
   * @returns The persisted entity.
   *
   * @example
   * const SAVED = await BENCHMARK_REPO.save(BENCH);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async save(persisted: Benchmark): Promise<Benchmark> {
    if (persisted.id) {
      const [row] = await this.db
        .update(benchmark)
        .set(this.toUpdate(persisted))
        .where(eq(benchmark.id, persisted.id))
        .returning()

      if (!row) {
        throw new NotFoundError(
          `Benchmark with id ${persisted.id} was not found.`
        )
      }

      return this.toEntity(row)
    }

    const [row] = await this.db
      .insert(benchmark)
      .values(this.toInsert(persisted))
      .returning()

    return this.toEntity(row)
  }

  /**
   * @summary
   * Removes the benchmark with the provided id.
   *
   * @remarks
   * Resolves when the row is removed.
   *
   * @explanation
   * Use this method to delete a benchmark by its primary
   * key.
   *
   * @param id - The unique identifier of the benchmark.
   *
   * @example
   * await BENCHMARK_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async delete(id: EntityId): Promise<void> {
    await this.db.delete(benchmark).where(eq(benchmark.id, id))
  }
}
