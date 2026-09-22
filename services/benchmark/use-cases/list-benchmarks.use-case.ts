import { IBenchmark } from "@domain/benchmark/interfaces/benchmark.interface"
import type { BenchmarkResponseDTO } from "../dto/benchmark-response.dto"
import { toResponseDTO } from "../mappers/benchmark.mapper"

export interface ListBenchmarksInput {
  limit?: number
  offset?: number
}

/**
 * @summary
 * Lists all registered `Benchmark` entries.
 *
 * @remarks
 * Supports optional pagination through limit and
 * offset.
 *
 * @explanation
 * Use this use case to list benchmarks through the
 * service layer.
 *
 * @example
 * const BENCHMARKS = await LIST_BENCHMARKS_USE_CASE.execute({});
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class ListBenchmarksUseCase {
  constructor(private benchmarkRepository: IBenchmark) {}

  /**
   * @summary
   * Fetches all benchmarks, optionally paginated.
   *
   * @remarks
   * Supports optional pagination through limit and
   * offset.
   *
   * @explanation
   * Use this method to list benchmarks through the
   * service layer.
   *
   * @param input - Pagination options.
   *
   * @returns The matching benchmarks.
   *
   * @example
   * const BENCHMARKS = await LIST_BENCHMARKS_USE_CASE
   *   .execute();
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(input: ListBenchmarksInput): Promise<BenchmarkResponseDTO[]> {
    const BENCHMARKS = await this.benchmarkRepository.findAll({
      limit: input.limit,
      offset: input.offset,
    })
    return BENCHMARKS.map(toResponseDTO)
  }
}
