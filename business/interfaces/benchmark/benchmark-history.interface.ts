import type { BenchmarkHistory } from "@/business/entities/benchmark/benchmark-history.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";

/**
 * Represents the repository contract for persisting and retrieving
 * `BenchmarkHistory` entities.
 *
 * An `IBenchmarkHistory`:
 * - persists benchmark history through {@link IBenchmarkHistory.save}.
 * - retrieves benchmark history by id, benchmark id, and date.
 * - removes benchmark history by id.
 *
 * Implementations are responsible for mapping database rows to
 * `BenchmarkHistory` entities and back.
 */
export interface IBenchmarkHistory {
  /**
   * Retrieves the benchmark history with the provided id.
   *
   * @param id - The unique identifier of the benchmark history.
   * @returns A promise resolving to the `BenchmarkHistory` or `null`
   * when not found.
   */
  findById(id: EntityId): Promise<BenchmarkHistory | null>;

  /**
   * Retrieves all benchmark histories belonging to the provided
   * benchmark id.
   *
   * @param benchmarkId - The unique identifier of the benchmark.
   * @returns A promise resolving to the `BenchmarkHistory` entries or
   * an empty array when there are no matches.
   */
  findAllByBenchmarkId(benchmarkId: EntityId): Promise<BenchmarkHistory[]>;

  /**
   * Retrieves the benchmark history of the provided benchmark on the
   * provided date.
   *
   * @param benchmarkId - The unique identifier of the benchmark.
   * @param date - The date of the benchmark history.
   * @returns A promise resolving to the `BenchmarkHistory` or `null`
   * when not found.
   */
  findByBenchmarkIdAndDate(
    benchmarkId: EntityId,
    date: Date,
  ): Promise<BenchmarkHistory | null>;

  /**
   * Persists the provided benchmark history.
   *
   * When the benchmark history has no id, the implementation inserts
   * a new record and the persisted `BenchmarkHistory` (with its
   * generated id) is returned; otherwise the existing record is
   * updated.
   *
   * @param benchmarkHistory - The benchmark history to persist.
   * @returns A promise resolving to the persisted `BenchmarkHistory`.
   */
  save(benchmarkHistory: BenchmarkHistory): Promise<BenchmarkHistory>;

  /**
   * Removes the benchmark history with the provided id.
   *
   * @param id - The unique identifier of the benchmark history.
   * @returns A promise that resolves when the benchmark history is
   * removed.
   */
  delete(id: EntityId): Promise<void>;
}
