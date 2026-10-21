import { IBenchmarkHistory } from "@domain/benchmark-history/interfaces/benchmark-history.interface"
import { EntityId } from "@/value-objects"

export interface BulkDeleteBenchmarkHistoryInput {
  benchmarkHistoryIds: string[]
}

/**
 * @summary
 * Deletes multiple `BenchmarkHistory` records.
 *
 * @remarks
 * Hydrates each entry by its id and removes the rows that
 * still exist. Rows that no longer exist are silently
 * skipped. The repository contract exposes single-row
 * deletes, so each removal runs through `delete(id)`.
 *
 * @explanation
 * Use this use case to remove many benchmark history
 * entries through the service layer.
 *
 * @example
 * await BULK_DELETE_BENCHMARK_HISTORY_USE_CASE.execute({
 *   benchmarkHistoryIds: ["entry-1", "entry-2"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-10-20
 */
export class BulkDeleteBenchmarkHistoryUseCase {
  constructor(private historyRepository: IBenchmarkHistory) {}

  /**
   * @summary
   * Removes the entries with the provided ids.
   *
   * @remarks
   * Skips ids without a matching row. Returns early when
   * the list is empty.
   *
   * @explanation
   * Use this method to delete the selected benchmark history
   * rows of the registry in a single flow.
   *
   * @param input - Payload with the target entry ids.
   *
   * @returns Resolves when the rows are removed.
   *
   * @example
   * await BULK_DELETE_BENCHMARK_HISTORY_USE_CASE.execute({
   *   benchmarkHistoryIds: ["entry-1", "entry-2"],
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-10-20
   */
  async execute(
    input: BulkDeleteBenchmarkHistoryInput
  ): Promise<void> {
    if (input.benchmarkHistoryIds.length === 0) {
      return
    }

    for (const id of input.benchmarkHistoryIds) {
      const ENTITY_ID = EntityId.create(id)
      const ENTRY =
        await this.historyRepository.findById(ENTITY_ID)

      if (ENTRY) {
        await this.historyRepository.delete(ENTITY_ID)
      }
    }
  }
}
