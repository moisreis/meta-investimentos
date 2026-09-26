import { IBenchmark } from "@domain/benchmark/interfaces/benchmark.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"
import type { BenchmarkResponseDTO } from "../dto/benchmark-response.dto"
import { toResponseDTO } from "../mappers/benchmark.mapper"

export interface GetBenchmarkInput {
  benchmarkId: string
}

/**
 * @summary
 * Retrieves an existing `Benchmark` by its id.
 *
 * @remarks
 * Throws **NotFoundError** when no benchmark matches the
 * provided id.
 *
 * @explanation
 * Use this use case to fetch a single benchmark through
 * the service layer.
 *
 * @example
 * const BENCHMARK = await GET_BENCHMARK_USE_CASE.execute({
 *   benchmarkId: "benchmark-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class GetBenchmarkUseCase {
  constructor(private benchmarkRepository: IBenchmark) {}

  /**
   * @summary
   * Fetches the benchmark with the provided id.
   *
   * @remarks
   * Throws **NotFoundError** when no benchmark matches the
   * provided id.
   *
   * @explanation
   * Use this method to fetch a single benchmark through
   * the service layer.
   *
   * @param input - Payload with the target benchmark id.
   *
   * @returns The matching benchmark.
   *
   * @example
   * const BENCHMARK = await GET_BENCHMARK_USE_CASE.execute({
   *   benchmarkId: "benchmark-1",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(
    input: GetBenchmarkInput
  ): Promise<BenchmarkResponseDTO> {
    const ID = EntityId.create(input.benchmarkId)
    const BENCHMARK = await this.benchmarkRepository.findById(ID)
    if (!BENCHMARK) {
      throw new NotFoundError("`Benchmark` not found.")
    }
    return toResponseDTO(BENCHMARK)
  }
}
