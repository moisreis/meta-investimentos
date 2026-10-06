import { BenchmarkHistory } from "@domain/benchmark-history/entities/benchmark-history.entity"
import { IBenchmarkHistory } from "@domain/benchmark-history/interfaces/benchmark-history.interface"
import { NotFoundError } from "@errors/not-found.error"
import { IBenchmark } from "@domain/benchmark/interfaces/benchmark.interface"
import { EntityId, SignedPercentage } from "@/value-objects"
import type { BenchmarkHistoryResponseDTO } from "../dto/benchmark-history-response.dto"
import { toResponseDTO } from "../mappers/benchmark-history.mapper"

export interface UpdateBenchmarkHistoryInput {
  benchmarkHistoryId: string
  benchmarkId: string
  date: string
  rate: string
}

/**
 * @summary
 * Updates an existing `BenchmarkHistory` and persists it.
 *
 * @remarks
 * Fetches the entry, verifies the target benchmark exists,
 * rewrites the index, the date and the rate through `update`,
 * and saves the result.
 *
 * The target index is verified for the same reason the record
 * use case verifies it: an entry pointing at an index that does
 * not exist would be a broken reference rather than a
 * correction, and the foreign key would reject it as a generic
 * failure.
 *
 * @explanation
 * Use this use case to correct a benchmark history entry
 * through the service layer.
 *
 * @example
 * const ENTRY = await UPDATE_BENCHMARK_HISTORY.execute({
 *   benchmarkHistoryId: "history-1",
 *   benchmarkId: "benchmark-1",
 *   date: "2026-03-01T00:00:00.000Z",
 *   rate: "13.65",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
export class UpdateBenchmarkHistoryUseCase {
  constructor(
    private benchmarkHistoryRepository: IBenchmarkHistory,
    private benchmarkRepository: IBenchmark
  ) {}

  /**
   * @summary
   * Updates and persists the benchmark history entry.
   *
   * @remarks
   * Fetches the entry, verifies the target benchmark exists,
   * rewrites the index, the date and the rate through
   * `update`, and saves the result.
   *
   * @explanation
   * Use this method to correct a benchmark history entry
   * through the service layer.
   *
   * @param input - The entry correction payload.
   *
   * @returns The persisted entry.
   *
   * @example
   * const ENTRY = await UPDATE_BENCHMARK_HISTORY.execute({
   *   benchmarkHistoryId: "history-1",
   *   benchmarkId: "benchmark-1",
   *   date: "2026-03-01T00:00:00.000Z",
   *   rate: "13.65",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-10-05
   */
  async execute(
    input: UpdateBenchmarkHistoryInput
  ): Promise<BenchmarkHistoryResponseDTO> {
    const ENTRY = await this.benchmarkHistoryRepository.findById(
      EntityId.create(input.benchmarkHistoryId)
    )
    if (!ENTRY) {
      throw new NotFoundError("`BenchmarkHistory` not found.")
    }

    const BENCHMARK_ID = EntityId.create(input.benchmarkId)
    const BENCHMARK =
      await this.benchmarkRepository.findById(BENCHMARK_ID)
    if (!BENCHMARK) {
      throw new NotFoundError("`Benchmark` not found.")
    }

    const UPDATED: BenchmarkHistory = ENTRY.update({
      benchmarkId: BENCHMARK_ID,
      date: new Date(input.date),
      rate: SignedPercentage.create(input.rate),
    })

    const SAVED =
      await this.benchmarkHistoryRepository.save(UPDATED)

    return toResponseDTO(SAVED)
  }
}
