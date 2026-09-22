import type { BenchmarkHistory } from "@domain/benchmark-history/entities/benchmark-history.entity"
import type { EntityId } from "@/value-objects"

/**
 * @summary
 * Defines the repository contract for `BenchmarkHistory`.
 *
 * @remarks
 * An `IBenchmarkHistory` persists, retrieves, and removes
 * benchmark history. Supports lookup by id, benchmark id,
 * and date.
 *
 * @explanation
 * Use this interface to implement data access for benchmark
 * history. Persistence implementations map rows to
 * `BenchmarkHistory` entities.
 *
 * @example
 * const BH = await BENCH_HIST_REPO.findById(ID);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export interface IBenchmarkHistory {
  /**
   * @summary
   * Retrieves the benchmark history with the provided id.
   *
   * @remarks
   * Returns null when no benchmark history matches.
   *
   * @explanation
   * Use this method to look up a benchmark history entry
   * by its unique identifier. Callers check null.
   *
   * @param id - The unique identifier of the benchmark history.
   *
   * @returns The entry or `null`.
   *
   * @example
   * const BH = await BENCH_HIST_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findById(id: EntityId): Promise<BenchmarkHistory | null>

  /**
   * @summary
   * Retrieves all history of the provided benchmark.
   *
   * @remarks
   * Returns an empty array when no entries match.
   *
   * @explanation
   * Use this method to list the history entries of a
   * benchmark. Returns an empty array for no matches.
   *
   * @param benchmarkId - The unique identifier of the benchmark.
   *
   * @returns The matching entries.
   *
   * @example
   * const BHS = await BENCH_HIST_REPO
   *   .findAllByBenchmarkId(BENCH_ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findAllByBenchmarkId(benchmarkId: EntityId): Promise<BenchmarkHistory[]>

  /**
   * @summary
   * Retrieves all history of the provided benchmarks.
   *
   * @remarks
   * Returns an empty array when no entries match.
   *
   * @explanation
   * Use this method to fetch the history of many benchmarks
   * in a single query.
   *
   * @param benchmarkIds - The identifiers of the benchmarks.
   *
   * @returns The matching entries.
   *
   * @example
   * const BHS = await BENCH_HIST_REPO
   *   .findAllByBenchmarkIds(BENCH_IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  findAllByBenchmarkIds(benchmarkIds: EntityId[]): Promise<BenchmarkHistory[]>

  /**
   * @summary
   * Retrieves the benchmarks' history within the period.
   *
   * @remarks
   * The period is inclusive of both dates. Returns an
   * empty array when no entries match.
   *
   * @explanation
   * Use this method to fetch benchmark history inside a
   * date range for many benchmarks in one query.
   *
   * @param benchmarkIds - The identifiers of the benchmarks.
   * @param startDate - The start of the period, inclusive.
   * @param endDate - The end of the period, inclusive.
   *
   * @returns The matching entries.
   *
   * @example
   * const BHS = await BENCH_HIST_REPO
   *   .findAllByBenchmarkIdsInPeriod(IDS, START, END);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  findAllByBenchmarkIdsInPeriod(
    benchmarkIds: EntityId[],
    startDate: Date,
    endDate: Date
  ): Promise<BenchmarkHistory[]>

  /**
   * @summary
   * Retrieves the benchmark's history on the provided date.
   *
   * @remarks
   * Returns null when no entry matches.
   *
   * @explanation
   * Use this method to find the index value of a benchmark
   * on a given date. Callers check null for existence.
   *
   * @param benchmarkId - The unique identifier of the benchmark.
   * @param date - The date of the benchmark history.
   *
   * @returns The entry or `null`.
   *
   * @example
   * const BH = await BENCH_HIST_REPO
   *   .findByBenchmarkIdAndDate(BENCH_ID, DATE);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findByBenchmarkIdAndDate(
    benchmarkId: EntityId,
    date: Date
  ): Promise<BenchmarkHistory | null>

  /**
   * @summary
   * Persists the provided benchmark history.
   *
   * @remarks
   * Inserts a new record when the entry has no id;
   * otherwise updates the existing record.
   *
   * @explanation
   * Use this method to create or update a benchmark
   * history entry. The persisted entity is returned.
   *
   * @param benchmarkHistory - The benchmark history to persist.
   *
   * @returns The persisted entry.
   *
   * @example
   * const BH = await BENCH_HIST_REPO.save(NEW_BH);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  save(benchmarkHistory: BenchmarkHistory): Promise<BenchmarkHistory>

  /**
   * @summary
   * Removes the benchmark history with the provided id.
   *
   * @remarks
   * Resolves when the entry is removed.
   *
   * @explanation
   * Use this method to delete a benchmark history entry.
   * The promise resolves once the operation completes.
   *
   * @param id - The unique identifier of the benchmark history.
   *
   * @returns Resolves when removed.
   *
   * @example
   * await BENCH_HIST_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  delete(id: EntityId): Promise<void>
}
