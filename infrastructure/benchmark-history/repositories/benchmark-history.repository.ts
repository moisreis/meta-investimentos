import { and, eq, gte, inArray, lte } from "drizzle-orm"
import type { PgAsyncDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core"

import { BenchmarkHistory } from "@domain/benchmark-history/entities/benchmark-history.entity"
import type { IBenchmarkHistory } from "@domain/benchmark/interfaces/benchmark-history.interface"
import { EntityId, SignedPercentage } from "@/value-objects"
import { benchmarkHistory } from "@db-schemas/benchmark-history.schema"
import { NotFoundError } from "@errors/not-found.error"

export type DbClient = PgAsyncDatabase<PgQueryResultHKT>

/**
 * @summary
 * Implements the benchmark history persistence contract.
 *
 * @remarks
 * Maps `benchmark_history` rows to `BenchmarkHistory`
 * entities and back. Lookups rely on the primary key, the
 * `(benchmark_id, date)` unique pair, and the benchmark
 * index.
 *
 * @explanation
 * Use this repository for all benchmark history data access
 * in the infrastructure layer. It translates rows into
 * domain entities and persists entity changes.
 *
 * @example
 * const REPO = new BenchmarkHistoryRepository(DB_CLIENT);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class BenchmarkHistoryRepository implements IBenchmarkHistory {
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
   * const REPO = new BenchmarkHistoryRepository(DB_CLIENT);
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
  private toEntity(
    row: typeof benchmarkHistory.$inferSelect
  ): BenchmarkHistory {
    return BenchmarkHistory.create(
      {
        benchmarkId: EntityId.create(row.benchmarkId),
        date: row.date,
        rate: SignedPercentage.create(row.rate),
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
   * Serializes value objects to their database
   * representation.
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
  private toInsert(
    entity: BenchmarkHistory
  ): typeof benchmarkHistory.$inferInsert {
    return {
      benchmarkId: entity.benchmarkId,
      date: entity.date,
      rate: entity.rate.value.toString(),
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
  private toUpdate(
    entity: BenchmarkHistory
  ): Partial<typeof benchmarkHistory.$inferInsert> {
    return {
      benchmarkId: entity.benchmarkId,
      date: entity.date,
      rate: entity.rate.value.toString(),
    }
  }

  /**
   * @summary
   * Retrieves the history record with the provided id.
   *
   * @remarks
   * Returns `null` when no row matches the id.
   *
   * @explanation
   * Use this method to load a history record by its primary
   * key. Callers must handle the null result.
   *
   * @param id - The unique identifier of the record.
   * @returns The entity or `null`.
   *
   * @example
   * const RECORD = await BENCH_HIST_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findById(id: EntityId): Promise<BenchmarkHistory | null> {
    const [row] = await this.db
      .select()
      .from(benchmarkHistory)
      .where(eq(benchmarkHistory.id, id))
      .limit(1)

    return row ? this.toEntity(row) : null
  }

  /**
   * @summary
   * Retrieves all history records of a benchmark.
   *
   * @remarks
   * Returns an empty array when no records exist for the
   * benchmark.
   *
   * @explanation
   * Use this method to load the full rate series of a
   * single benchmark.
   *
   * @param benchmarkId - The id of the benchmark.
   * @returns The matching records.
   *
   * @example
   * const HIST = await BENCH_HIST_REPO
   *   .findAllByBenchmarkId(BENCH_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByBenchmarkId(
    benchmarkId: EntityId
  ): Promise<BenchmarkHistory[]> {
    const rows = await this.db
      .select()
      .from(benchmarkHistory)
      .where(eq(benchmarkHistory.benchmarkId, benchmarkId))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Retrieves all history records with any of the provided
   * benchmark ids.
   *
   * @remarks
   * Batched lookup avoids an N+1 query pattern. Returns
   * an empty array when no ids match.
   *
   * @explanation
   * Use this method to hydrate the rate series of many
   * benchmarks in one query instead of one per benchmark.
   *
   * @param benchmarkIds - The ids of the benchmarks.
   * @returns The matching records.
   *
   * @example
   * const HIST = await BENCH_HIST_REPO
   *   .findAllByBenchmarkIds(IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByBenchmarkIds(
    benchmarkIds: string[]
  ): Promise<BenchmarkHistory[]> {
    if (benchmarkIds.length === 0) {
      return []
    }

    const rows = await this.db
      .select()
      .from(benchmarkHistory)
      .where(inArray(benchmarkHistory.benchmarkId, benchmarkIds))

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Retrieves history records of multiple benchmarks in a
   * period.
   *
   * @remarks
   * The period is inclusive of both dates. Batched lookup
   * avoids an N+1 query pattern. Returns an empty array
   * when no ids match.
   *
   * @explanation
   * Use this method to hydrate the rate series of many
   * benchmarks inside a date range for processing or
   * reporting.
   *
   * @param benchmarkIds - The ids of the benchmarks.
   * @param startDate - The start of the period, inclusive.
   * @param endDate - The end of the period, inclusive.
   * @returns The matching records.
   *
   * @example
   * const HIST = await BENCH_HIST_REPO
   *   .findAllByBenchmarkIdsInPeriod(IDS, START, END);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findAllByBenchmarkIdsInPeriod(
    benchmarkIds: string[],
    startDate: Date,
    endDate: Date
  ): Promise<BenchmarkHistory[]> {
    if (benchmarkIds.length === 0) {
      return []
    }

    const rows = await this.db
      .select()
      .from(benchmarkHistory)
      .where(
        and(
          inArray(benchmarkHistory.benchmarkId, benchmarkIds),
          gte(benchmarkHistory.date, startDate),
          lte(benchmarkHistory.date, endDate)
        )
      )

    return rows.map((row) => this.toEntity(row))
  }

  /**
   * @summary
   * Retrieves the history record for a benchmark and date.
   *
   * @remarks
   * Returns `null` when no row matches the pair.
   *
   * @explanation
   * Use this method to load a single history record by its
   * benchmark id and date. Callers must handle the null
   * result.
   *
   * @param benchmarkId - The id of the benchmark.
   * @param date - The date of the record.
   * @returns The entity or `null`.
   *
   * @example
   * const RECORD = await BENCH_HIST_REPO
   *   .findByBenchmarkIdAndDate(BENCH_ID, DATE);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findByBenchmarkIdAndDate(
    benchmarkId: EntityId,
    date: Date
  ): Promise<BenchmarkHistory | null> {
    const [row] = await this.db
      .select()
      .from(benchmarkHistory)
      .where(
        and(
          eq(benchmarkHistory.benchmarkId, benchmarkId),
          eq(benchmarkHistory.date, date)
        )
      )
      .limit(1)

    return row ? this.toEntity(row) : null
  }

  /**
   * @summary
   * Persists the provided benchmark history record.
   *
   * @remarks
   * Inserts a new row when the entity has no id. Updates
   * the existing row otherwise.
   *
   * @explanation
   * Use this method to create or update a benchmark history
   * record. Returns the persisted entity with its id.
   *
   * @param persisted - The record to persist.
   * @returns The persisted entity.
   *
   * @example
   * const SAVED = await BENCH_HIST_REPO.save(RECORD);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async save(persisted: BenchmarkHistory): Promise<BenchmarkHistory> {
    if (persisted.id) {
      const [row] = await this.db
        .update(benchmarkHistory)
        .set(this.toUpdate(persisted))
        .where(eq(benchmarkHistory.id, persisted.id))
        .returning()

      if (!row) {
        throw new NotFoundError(
          `BenchmarkHistory with id ${persisted.id} was not found.`
        )
      }

      return this.toEntity(row)
    }

    const [row] = await this.db
      .insert(benchmarkHistory)
      .values(this.toInsert(persisted))
      .returning()

    return this.toEntity(row)
  }

  /**
   * @summary
   * Removes the history record with the provided id.
   *
   * @remarks
   * Resolves when the row is removed.
   *
   * @explanation
   * Use this method to delete a history record by its
   * primary key.
   *
   * @param id - The unique identifier of the record.
   *
   * @example
   * await BENCH_HIST_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async delete(id: EntityId): Promise<void> {
    await this.db.delete(benchmarkHistory).where(eq(benchmarkHistory.id, id))
  }
}
