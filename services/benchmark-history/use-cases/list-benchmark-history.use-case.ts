import { IBenchmarkHistory } from "@domain/benchmark-history/interfaces/benchmark-history.interface"
import { EntityId } from "@/value-objects"
import type { BenchmarkHistoryResponseDTO } from "../dto/benchmark-history-response.dto"
import { toResponseDTO } from "../mappers/benchmark-history.mapper"

export interface ListBenchmarkHistoryInput {
  benchmarkId: string
}

/**
 * @summary
 * Lists the `BenchmarkHistory` entries of a benchmark.
 *
 * @remarks
 * Uses the benchmark id to scope the entry query.
 *
 * @explanation
 * Use this use case to list the history of a given
 * benchmark through the service layer.
 *
 * @example
 * const ENTRIES = await LIST_BENCHMARK_HISTORY_USE_CASE
 *   .execute({
 *     benchmarkId: "benchmark-1",
 *   });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class ListBenchmarkHistoryUseCase {
  constructor(private benchmarkHistoryRepository: IBenchmarkHistory) {}

  /**
   * @summary
   * Fetches all entries of the provided benchmark.
   *
   * @remarks
   * Uses the benchmark id to scope the entry query.
   *
   * @explanation
   * Use this method to list the history of a given
   * benchmark through the service layer.
   *
   * @param input - Payload with the target benchmark id.
   *
   * @returns The matching entries.
   *
   * @example
   * const ENTRIES = await LIST_BENCHMARK_HISTORY_USE_CASE
   *   .execute({
   *     benchmarkId: "benchmark-1",
   *   });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(
    input: ListBenchmarkHistoryInput
  ): Promise<BenchmarkHistoryResponseDTO[]> {
    const BENCHMARK_ID = EntityId.create(input.benchmarkId)
    const ENTRIES =
      await this.benchmarkHistoryRepository.findAllByBenchmarkId(BENCHMARK_ID)
    return ENTRIES.map(toResponseDTO)
  }
}
