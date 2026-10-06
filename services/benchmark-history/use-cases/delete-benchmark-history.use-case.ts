import { IBenchmarkHistory } from "@domain/benchmark-history/interfaces/benchmark-history.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"

export interface DeleteBenchmarkHistoryInput {
  benchmarkHistoryId: string
}

/**
 * @summary
 * Deletes an existing `BenchmarkHistory`.
 *
 * @remarks
 * Fetches the entry and removes it when it exists. Throws
 * **NotFoundError** when no entry matches the provided id,
 * so a stale row menu reports a missing entry instead of
 * silently succeeding.
 *
 * @explanation
 * Use this use case to remove a benchmark history entry
 * through the service layer.
 *
 * @example
 * await DELETE_BENCHMARK_HISTORY.execute({
 *   benchmarkHistoryId: "history-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
export class DeleteBenchmarkHistoryUseCase {
  constructor(
    private benchmarkHistoryRepository: IBenchmarkHistory
  ) {}

  /**
   * @summary
   * Deletes the benchmark history with the provided id.
   *
   * @remarks
   * Fetches the entry and removes it when it exists.
   * Throws **NotFoundError** when no entry matches the
   * provided id.
   *
   * @explanation
   * Use this method to remove a benchmark history entry
   * through the service layer.
   *
   * @param input - The entry id payload.
   *
   * @returns Resolves when the entry is removed.
   *
   * @example
   * await DELETE_BENCHMARK_HISTORY.execute({
   *   benchmarkHistoryId: "history-1",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-10-05
   */
  async execute(
    input: DeleteBenchmarkHistoryInput
  ): Promise<void> {
    const ID = EntityId.create(input.benchmarkHistoryId)
    const ENTRY =
      await this.benchmarkHistoryRepository.findById(ID)
    if (!ENTRY) {
      throw new NotFoundError("`BenchmarkHistory` not found.")
    }

    await this.benchmarkHistoryRepository.delete(ID)
  }
}
