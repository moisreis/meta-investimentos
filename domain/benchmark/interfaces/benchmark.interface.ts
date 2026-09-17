import type { Benchmark } from "@domain/benchmark/entities/benchmark.entity"
import type { EntityId } from "@/value-objects"

/**
 * @summary
 * Defines the repository contract for `Benchmark` entities.
 *
 * @remarks
 * An `IBenchmark` persists, retrieves, and removes benchmarks.
 * Supports lookup by id and acronym.
 *
 * @explanation
 * Use this interface to implement data access for benchmarks.
 * Persistence implementations map rows to `Benchmark` entities.
 *
 * @example
 * const BENCH = await BENCHMARK_REPO.findById(ID);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export interface IBenchmark {
  /**
   * @summary
   * Retrieves the benchmark with the provided id.
   *
   * @remarks
   * Returns null when no benchmark matches.
   *
   * @explanation
   * Use this method to look up a single benchmark by
   * its unique identifier. Callers check null for existence.
   *
   * @param id - The unique identifier of the benchmark.
   * @returns The entry or `null`.
   *
   * @example
   * const BENCH = await BENCHMARK_REPO.findById(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findById(id: EntityId): Promise<Benchmark | null>

  /**
   * @summary
   * Retrieves the benchmark with the provided acronym.
   *
   * @remarks
   * Returns null when no benchmark matches.
   *
   * @explanation
   * Use this method to look up a benchmark by its
   * external acronym. Callers check null for existence.
   *
   * @param acronym - The acronym of the benchmark.
   * @returns The entry or `null`.
   *
   * @example
   * const BENCH = await BENCHMARK_REPO.findByAcronym(ACRO);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findByAcronym(acronym: string): Promise<Benchmark | null>

  /**
   * @summary
   * Retrieves all benchmarks, optionally paginated.
   *
   * @remarks
   * Use limit and offset to paginate results.
   *
   * @explanation
   * Use this method to list all benchmarks. Pass options
   * to paginate when the dataset is large.
   *
   * @param options - The pagination options.
   * @param options.limit - Maximum benchmarks to return.
   * @param options.offset - Starting offset.
   * @returns The matching entries.
   *
   * @example
   * const BENCHS = await BENCHMARK_REPO.findAll();
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  findAll(options?: { limit?: number; offset?: number }): Promise<Benchmark[]>

  /**
   * @summary
   * Retrieves all benchmarks with the provided ids.
   *
   * @remarks
   * Returns an empty array when no benchmarks match.
   *
   * @explanation
   * Use this method to fetch many benchmarks by their
   * identifiers in a single query.
   *
   * @param ids - The identifiers of the benchmarks.
   * @returns The matching entities.
   *
   * @example
   * const BENCHS = await BENCHMARK_REPO.findAllByIds(IDS);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  findAllByIds(ids: EntityId[]): Promise<Benchmark[]>

  /**
   * @summary
   * Persists the provided benchmark.
   *
   * @remarks
   * Inserts a new record when the benchmark has no id;
   * otherwise updates the existing record.
   *
   * @explanation
   * Use this method to create or update a benchmark.
   * The persisted entity with its id is returned.
   *
   * @param benchmark - The benchmark to persist.
   * @returns The persisted entry.
   *
   * @example
   * const BENCH = await BENCHMARK_REPO.save(NEW_BENCH);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  save(benchmark: Benchmark): Promise<Benchmark>

  /**
   * @summary
   * Removes the benchmark with the provided id.
   *
   * @remarks
   * Resolves when the benchmark is removed.
   *
   * @explanation
   * Use this method to delete a benchmark record.
   * The promise resolves once the operation completes.
   *
   * @param id - The unique identifier of the benchmark.
   * @returns Resolves when removed.
   *
   * @example
   * await BENCHMARK_REPO.delete(ID);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  delete(id: EntityId): Promise<void>
}
