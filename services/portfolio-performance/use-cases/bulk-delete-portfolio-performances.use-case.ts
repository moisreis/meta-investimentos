import { IPortfolioPerformance } from "@domain/portfolio-performance/interfaces/portfolio-performance.interface"
import { EntityId } from "@/value-objects"

export interface BulkDeletePortfolioPerformancesInput {
  portfolioPerformanceIds: string[]
}

/**
 * @summary
 * Deletes multiple `PortfolioPerformance` records.
 *
 * @remarks
 * Hydrates each performance by its id and removes the rows
 * that still exist. Rows that no longer exist are silently
 * skipped. The repository contract exposes single-row
 * deletes, so each removal runs through `delete(id)`.
 *
 * @explanation
 * Use this use case to remove many portfolio performance
 * snapshots through the service layer.
 *
 * @example
 * await BULK_DELETE_PORTFOLIO_PERFORMANCES_USE_CASE.execute({
 *   portfolioPerformanceIds: ["perf-1", "perf-2"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-10-20
 */
export class BulkDeletePortfolioPerformancesUseCase {
  constructor(
    private performanceRepository: IPortfolioPerformance
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
   * await BULK_DELETE_PORTFOLIO_PERFORMANCES_USE_CASE.execute({
   *   portfolioPerformanceIds: ["perf-1", "perf-2"],
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-10-20
   */
  async execute(
    input: BulkDeletePortfolioPerformancesInput
  ): Promise<void> {
    if (input.portfolioPerformanceIds.length === 0) {
      return
    }

    for (const id of input.portfolioPerformanceIds) {
      const ENTITY_ID = EntityId.create(id)
      const PERFORMANCE =
        await this.performanceRepository.findById(ENTITY_ID)

      if (PERFORMANCE) {
        await this.performanceRepository.delete(ENTITY_ID)
      }
    }
  }
}
