import { IBenchmarkHistory } from "@domain/benchmark-history/interfaces/benchmark-history.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"
import type { BenchmarkHistoryResponseDTO } from "../dto/benchmark-history-response.dto"
import { toResponseDTO } from "../mappers/benchmark-history.mapper"

export interface GetBenchmarkHistoryInput {
  benchmarkHistoryId: string
}

/**
 * @summary
 * Retrieves an existing `BenchmarkHistory` by its id.
 *
 * @remarks
 * Throws **NotFoundError** when no entry matches the
 * provided id.
 *
 * @explanation
 * Use this use case to fetch a single benchmark history
 * entry through the service layer.
 *
 * @example
 * const ENTRY = await GET_BENCHMARK_HISTORY_USE_CASE.execute({
 *   benchmarkHistoryId: "entry-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class GetBenchmarkHistoryUseCase {
  constructor(
    private benchmarkHistoryRepository: IBenchmarkHistory
  ) {}

  /**
   * @summary
   * Fetches the entry with the provided id.
   *
   * @remarks
   * Throws **NotFoundError** when no entry matches the
   * provided id.
   *
   * @explanation
   * Use this method to fetch a single benchmark history
   * entry through the service layer.
   *
   * @param input - Payload with the target entry id.
   *
   * @returns The matching entry.
   *
   * @example
   * const ENTRY = await GET_BENCHMARK_HISTORY_USE_CASE.execute({
   *   benchmarkHistoryId: "entry-1",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(
    input: GetBenchmarkHistoryInput
  ): Promise<BenchmarkHistoryResponseDTO> {
    const ID = EntityId.create(input.benchmarkHistoryId)
    const ENTRY =
      await this.benchmarkHistoryRepository.findById(ID)
    if (!ENTRY) {
      throw new NotFoundError("`BenchmarkHistory` not found.")
    }
    return toResponseDTO(ENTRY)
  }
}
