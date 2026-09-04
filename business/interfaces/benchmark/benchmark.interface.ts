import type { Benchmark } from "@/business/entities/benchmark/benchmark.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";

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
  /**
   * Retrieves the benchmark with the provided id.
   *
   * @param id - The unique identifier of the benchmark.
   * @returns A promise resolving to the `Benchmark` or `null` when
   * not found.
   */
  findById(id: EntityId): Promise<Benchmark | null>;

  /**
   * Retrieves the benchmark with the provided acronym.
   *
   * @param acronym - The acronym of the benchmark.
   * @returns A promise resolving to the `Benchmark` or `null` when
   * not found.
   */
  findByAcronym(acronym: string): Promise<Benchmark | null>;

  /**
   * Retrieves all benchmarks, optionally paginated.
   *
   * @param options - The pagination options.
   * @param options.limit - The maximum number of benchmarks to return.
   * @param options.offset - The offset from which to start returning
   * benchmarks.
   * @returns A promise resolving to the collection of `Benchmark`
   * entities.
   */
  findAll(options?: { limit?: number; offset?: number }): Promise<Benchmark[]>;

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
  delete(id: EntityId): Promise<void>;
}
