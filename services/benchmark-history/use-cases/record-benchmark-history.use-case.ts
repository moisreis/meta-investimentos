import {
  BenchmarkHistory,
} from "@domain/benchmark-history/entities/benchmark-history.entity"
import {
  IBenchmarkHistory,
} from "@domain/benchmark-history/interfaces/benchmark-history.interface"
import { NotFoundError } from "@errors/not-found.error"
import {
  IBenchmark,
} from "@domain/benchmark/interfaces/benchmark.interface"
import { EntityId } from "@/value-objects"
import type { BenchmarkHistoryResponseDTO } from "../dto/benchmark-history-response.dto"
import {
  toCreateBenchmarkHistoryProps,
  toResponseDTO,
} from "../mappers/benchmark-history.mapper"

export interface RecordBenchmarkHistoryInput {
  benchmarkId: string
  date: string
  rate: string
}

/**
 * @summary
 * Records a `BenchmarkHistory` entry and persists it.
 *
 * @remarks
 * Verifies the target benchmark exists, builds entity
 * props through the create mapper, and saves the entry
 * with the benchmark history repository.
 *
 * @explanation
 * Use this use case to register a benchmark history
 * entry through the service layer.
 *
 * @example
 * const ENTRY = await RECORD_BENCHMARK_HISTORY_USE_CASE.execute({
 *   benchmarkId: "benchmark-1",
 *   date: "2026-03-01T00:00:00.000Z",
 *   rate: "13.65",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class RecordBenchmarkHistoryUseCase {
  constructor(
    private benchmarkHistoryRepository: IBenchmarkHistory,
    private benchmarkRepository: IBenchmark
  ) {}

  /**
   * @summary
   * Records and persists the benchmark history entry.
   *
   * @param input - The entry creation payload.
   * @returns The persisted entry response.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(
    input: RecordBenchmarkHistoryInput
  ): Promise<BenchmarkHistoryResponseDTO> {
    const BENCHMARK_ID = EntityId.create(input.benchmarkId)
    const BENCHMARK = await this.benchmarkRepository.findById(BENCHMARK_ID)
    if (!BENCHMARK) {
      throw new NotFoundError("`Benchmark` not found.")
    }
    const PROPS = toCreateBenchmarkHistoryProps(input)
    const ENTRY = BenchmarkHistory.create(PROPS)
    const SAVED = await this.benchmarkHistoryRepository.save(ENTRY)
    return toResponseDTO(SAVED)
  }
}