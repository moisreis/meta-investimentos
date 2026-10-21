import { IPositionPerformance } from "@domain/position-performance/interfaces/position-performance.interface"
import { EntityId } from "@/value-objects"

export interface BulkDeletePositionPerformancesInput {
  positionPerformanceIds: string[]
}

/**
 * @summary
 * Deletes multiple `PositionPerformance` records.
 *
 * @remarks
 * Hydrates each performance by its id and removes the rows
 * that still exist. Rows that no longer exist are silently
 * skipped. The repository contract exposes single-row
 * deletes, so each removal runs through `delete(id)`.
 *
 * @explanation
 * Use this use case to remove many position performance
 * snapshots through the service layer.
 *
 * @example
 * await BULK_DELETE_POSITION_PERFORMANCES_USE_CASE.execute({
 *   positionPerformanceIds: ["perf-1", "perf-2"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-10-20
 */
export class BulkDeletePositionPerformancesUseCase {
  constructor(
    private performanceRepository: IPositionPerformance
  ) {}

  /**
   * @summary
   * Removes the performance snapshots with the provided ids.
   *
   * @remarks
   * Skips ids without a matching row. Returns early when
   * the list is empty.
   *
   * @explanation
   * Use this method to delete the selected performance rows
   * of the registry in a single flow.
   *
   * @param input - Payload with the target performance ids.
   *
   * @returns Resolves when the rows are removed.
   *
   * @example
   * await BULK_DELETE_POSITION_PERFORMANCES_USE_CASE.execute({
   *   positionPerformanceIds: ["perf-1", "perf-2"],
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-10-20
   */
  async execute(
    input: BulkDeletePositionPerformancesInput
  ): Promise<void> {
    if (input.positionPerformanceIds.length === 0) {
      return
    }

    for (const id of input.positionPerformanceIds) {
      const ENTITY_ID = EntityId.create(id)
      const PERFORMANCE =
        await this.performanceRepository.findById(ENTITY_ID)

      if (PERFORMANCE) {
        await this.performanceRepository.delete(ENTITY_ID)
      }
    }
  }
}
