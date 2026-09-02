import { and, eq, gte, inArray, lte } from "drizzle-orm";

import { BenchmarkHistory } from "@/business/entities/benchmark/benchmark-history.entity";
import type { IBenchmarkHistory } from "@/business/interfaces/benchmark/benchmark-history.interface";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";
import { benchmarkHistory } from "@/infrastructure/database/schemas";
import { NotFoundError } from "@/shared/errors";

import type { DbClient } from "../types";

/**
 * PostgreSQL-backed implementation of the {@link IBenchmarkHistory}
 * contract.
 *
 * Maps `benchmark_history` rows to `BenchmarkHistory` entities and
 * back. Lookups rely on the primary key, the `(benchmark_id, date)`
 * unique pair and the benchmark index.
 *
 * The `rate` column is stored as `numeric`, which postgres returns as
 * a string; it is hydrated into a `SignedPercentage` value object and
 * persisted through its `.value.toString()` representation.
 *
 * A save inserts a new row when the entity has no id and updates the
 * existing row otherwise. Batch lookups exist so a rate series across
 * several benchmarks is resolved with one query instead of one query
 * per benchmark.
 */
export class BenchmarkHistoryRepository implements IBenchmarkHistory {
  private readonly db: DbClient;

  /**
   * Creates a `BenchmarkHistoryRepository` bound to the provided
   * database client.
   *
   * @param db - The database client to run queries against.
   */
  constructor(db: DbClient) {
    this.db = db;
  }

  /**
   * Maps the provided `benchmark_history` row to a
   * {@link BenchmarkHistory} entity.
   *
   * @param row - The database row.
   * @returns The hydrated `BenchmarkHistory` entity.
   */
  private toEntity(
    row: typeof benchmarkHistory.$inferSelect,
  ): BenchmarkHistory {
    return BenchmarkHistory.create(
      {
        benchmarkId: EntityId.create(row.benchmarkId),
        date: row.date,
        rate: SignedPercentage.create(row.rate),
        createdAt: row.createdAt,
      },
      row.id,
    );
  }

  /**
   * Maps the provided entity to the insert values of the
   * `benchmark_history` table.
   *
   * @param entity - The history record to persist.
   * @returns The insert values.
   */
  private toInsert(
    entity: BenchmarkHistory,
  ): typeof benchmarkHistory.$inferInsert {
    return {
      benchmarkId: entity.benchmarkId,
      date: entity.date,
      rate: entity.rate.value.toString(),
      createdAt: entity.createdAt,
    };
  }

  /**
   * Maps the provided entity to the mutable update values of the
   * `benchmark_history` table.
   *
   * `createdAt` never changes and is left out of the update.
   *
   * @param entity - The history record to persist.
   * @returns The update values.
   */
  private toUpdate(
    entity: BenchmarkHistory,
  ): Partial<typeof benchmarkHistory.$inferInsert> {
    return {
      benchmarkId: entity.benchmarkId,
      date: entity.date,
      rate: entity.rate.value.toString(),
    };
  }

  /**
   * Retrieves the history record with the provided id.
   *
   * @see {@link IBenchmarkHistory.findById}
   */
  async findById(id: EntityId): Promise<BenchmarkHistory | null> {
    const [row] = await this.db
      .select()
      .from(benchmarkHistory)
      .where(eq(benchmarkHistory.id, id))
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  /**
   * Retrieves all history records belonging to the provided benchmark
   * id.
   *
   * @see {@link IBenchmarkHistory.findAllByBenchmarkId}
   */
  async findAllByBenchmarkId(
    benchmarkId: EntityId,
  ): Promise<BenchmarkHistory[]> {
    const rows = await this.db
      .select()
      .from(benchmarkHistory)
      .where(eq(benchmarkHistory.benchmarkId, benchmarkId));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves all history records belonging to any of the provided
   * benchmark ids.
   *
   * Batched lookup for hydrating the rate series of many benchmarks
   * without falling into an N+1 query pattern.
   *
   * @param benchmarkIds - The ids of the benchmarks to retrieve
   *   history for.
   * @returns A promise resolving to the matching `BenchmarkHistory`
   *   entities.
   */
  async findAllByBenchmarkIds(
    benchmarkIds: string[],
  ): Promise<BenchmarkHistory[]> {
    if (benchmarkIds.length === 0) {
      return [];
    }

    const rows = await this.db
      .select()
      .from(benchmarkHistory)
      .where(inArray(benchmarkHistory.benchmarkId, benchmarkIds));

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves all history records of the provided benchmarks whose
   * date falls within the provided period, inclusive.
   *
   * Batched lookup backing the same analysis as the single-benchmark
   * period lookup across several benchmarks in one round-trip.
   *
   * @param benchmarkIds - The ids of the benchmarks to retrieve
   *   history for.
   * @param startDate - The start of the period, inclusive.
   * @param endDate - The end of the period, inclusive.
   * @returns A promise resolving to the matching `BenchmarkHistory`
   *   entities.
   */
  async findAllByBenchmarkIdsInPeriod(
    benchmarkIds: string[],
    startDate: Date,
    endDate: Date,
  ): Promise<BenchmarkHistory[]> {
    if (benchmarkIds.length === 0) {
      return [];
    }

    const rows = await this.db
      .select()
      .from(benchmarkHistory)
      .where(
        and(
          inArray(benchmarkHistory.benchmarkId, benchmarkIds),
          gte(benchmarkHistory.date, startDate),
          lte(benchmarkHistory.date, endDate),
        ),
      );

    return rows.map((row) => this.toEntity(row));
  }

  /**
   * Retrieves the history record for the provided benchmark id and
   * date.
   *
   * @see {@link IBenchmarkHistory.findByBenchmarkIdAndDate}
   */
  async findByBenchmarkIdAndDate(
    benchmarkId: EntityId,
    date: Date,
  ): Promise<BenchmarkHistory | null> {
    const [row] = await this.db
      .select()
      .from(benchmarkHistory)
      .where(
        and(
          eq(benchmarkHistory.benchmarkId, benchmarkId),
          eq(benchmarkHistory.date, date),
        ),
      )
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  /**
   * Persists the provided benchmark history record.
   *
   * @see {@link IBenchmarkHistory.save}
   */
  async save(persisted: BenchmarkHistory): Promise<BenchmarkHistory> {
    if (persisted.id) {
      const [row] = await this.db
        .update(benchmarkHistory)
        .set(this.toUpdate(persisted))
        .where(eq(benchmarkHistory.id, persisted.id))
        .returning();

      if (!row) {
        throw new NotFoundError(
          `BenchmarkHistory with id ${persisted.id} was not found.`,
        );
      }

      return this.toEntity(row);
    }

    const [row] = await this.db
      .insert(benchmarkHistory)
      .values(this.toInsert(persisted))
      .returning();

    return this.toEntity(row);
  }

  /**
   * Removes the history record with the provided id.
   *
   * @see {@link IBenchmarkHistory.delete}
   */
  async delete(id: EntityId): Promise<void> {
    await this.db.delete(benchmarkHistory).where(eq(benchmarkHistory.id, id));
  }
}
