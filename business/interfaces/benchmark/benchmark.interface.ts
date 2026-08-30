import type { Benchmark } from "@/business/entities/benchmark/benchmark.entity";

/**
 * Represents the repository contract for persisting and retrieving
 * `Benchmark` entities.
 *
 * An `IBenchmark`:
 * - persists benchmarks through {@link IBenchmark.save}.
 * - retrieves benchmarks by id and acronym.
 * - removes benchmarks by id.
 *
 * Implementations are responsible for mapping database rows to
 * `Benchmark` entities and back.
 */
export interface IBenchmark {
  // --------------------------------------
  // QUERY METHODS
  // --------------------------------------

  /**
   * Retrieves the benchmark with the provided id.
   *
   * @param id - The unique identifier of the benchmark.
   * @returns A promise resolving to the `Benchmark` or `null` when
   * not found.
   */
  findById(id: string): Promise<Benchmark | null>;

  /**
   * Retrieves the benchmark with the provided acronym.
   *
   * @param acronym - The acronym of the benchmark.
   * @returns A promise resolving to the `Benchmark` or `null` when
   * not found.
   */
  findByAcronym(acronym: string): Promise<Benchmark | null>;

  // --------------------------------------
  // COMMAND METHODS
  // --------------------------------------

  /**
   * Persists the provided benchmark.
   *
   * When the benchmark has no id, the implementation inserts a new
   * record and the persisted `Benchmark` (with its generated id) is
   * returned; otherwise the existing record is updated.
   *
   * @param benchmark - The benchmark to persist.
   * @returns A promise resolving to the persisted `Benchmark`.
   */
  save(benchmark: Benchmark): Promise<Benchmark>;

  /**
   * Removes the benchmark with the provided id.
   *
   * @param id - The unique identifier of the benchmark.
   * @returns A promise that resolves when the benchmark is removed.
   */
  delete(id: string): Promise<void>;
}
