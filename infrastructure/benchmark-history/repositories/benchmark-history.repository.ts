import { and, asc, eq, gte, inArray, lte } from "drizzle-orm"
import type {
  PgAsyncDatabase,
  PgQueryResultHKT,
} from "drizzle-orm/pg-core"

import { BenchmarkHistory } from "@domain/benchmark-history/entities/benchmark-history.entity"
import type { IBenchmarkHistory } from "@domain/benchmark-history/interfaces/benchmark-history.interface"
import { EntityId, SignedPercentage } from "@/value-objects"
import {
  ToDomain,
  ToInsert,
  ToUpdate,
} from "../mappers/benchmark-history.mapper"
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
   *
   * @returns The entity or `null`.
   *
   * @example
   * const RECORD = await BENCH_HIST_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async findById(
    id: EntityId
  ): Promise<BenchmarkHistory | null> {
    const [ROW] = await this.db
      .select()
      .from(benchmarkHistory)
      .where(eq(benchmarkHistory.id, id))
      .limit(1)

    return ROW ? ToDomain(ROW) : null
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
   *
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
    const ROWS = await this.db
      .select()
      .from(benchmarkHistory)
      .where(eq(benchmarkHistory.benchmarkId, benchmarkId))

    return ROWS.map((row) => ToDomain(row))
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
   *
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
    benchmarkIds: EntityId[]
  ): Promise<BenchmarkHistory[]> {
    if (benchmarkIds.length === 0) {
      return []
    }

    const ROWS = await this.db
      .select()
      .from(benchmarkHistory)
      .where(inArray(benchmarkHistory.benchmarkId, benchmarkIds))

    return ROWS.map((row) => ToDomain(row))
  }

  /**
   * @summary
   * Retrieves history records of multiple benchmarks in a
   * period.
   *
   * @remarks
   * The period is inclusive of both dates. Batched lookup
   * avoids an N+1 query pattern. Rows are ordered oldest
   * first by date, then by createdAt. Returns an empty
   * array when no ids match.
   *
   * @explanation
   * Use this method to hydrate the rate series of many
   * benchmarks inside a date range for processing or
   * reporting.
   *
   * @param benchmarkIds - The ids of the benchmarks.
   * @param startDate - The start of the period, inclusive.
   * @param endDate - The end of the period, inclusive.
   *
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
    benchmarkIds: EntityId[],
    startDate: Date,
    endDate: Date
  ): Promise<BenchmarkHistory[]> {
    if (benchmarkIds.length === 0) {
      return []
    }

    const ROWS = await this.db
      .select()
      .from(benchmarkHistory)
      .where(
        and(
          inArray(benchmarkHistory.benchmarkId, benchmarkIds),
          gte(benchmarkHistory.date, startDate),
          lte(benchmarkHistory.date, endDate)
        )
      )
      .orderBy(
        asc(benchmarkHistory.date),
        asc(benchmarkHistory.createdAt)
      )

    return ROWS.map((row) => ToDomain(row))
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
   *
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
    const [ROW] = await this.db
      .select()
      .from(benchmarkHistory)
      .where(
        and(
          eq(benchmarkHistory.benchmarkId, benchmarkId),
          eq(benchmarkHistory.date, date)
        )
      )
      .limit(1)

    return ROW ? ToDomain(ROW) : null
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
   *
   * @returns The persisted entity.
   *
   * @example
   * const SAVED = await BENCH_HIST_REPO.save(RECORD);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async save(
    persisted: BenchmarkHistory
  ): Promise<BenchmarkHistory> {
    if (persisted.id) {
      const [ROW] = await this.db
        .update(benchmarkHistory)
        .set(ToUpdate(persisted))
        .where(eq(benchmarkHistory.id, persisted.id))
        .returning()

      if (!ROW) {
        throw new NotFoundError(
          `BenchmarkHistory with id ${persisted.id} was not found.`
        )
      }

      return ToDomain(ROW)
    }

    const [ROW] = await this.db
      .insert(benchmarkHistory)
      .values(ToInsert(persisted))
      .returning()

    return ToDomain(ROW)
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
    await this.db
      .delete(benchmarkHistory)
      .where(eq(benchmarkHistory.id, id))
  }
}
