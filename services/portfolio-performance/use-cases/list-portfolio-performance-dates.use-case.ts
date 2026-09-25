import { EntityId } from "@/value-objects"
import { IPortfolioPerformance } from "@domain/portfolio-performance/interfaces/portfolio-performance.interface"

export interface ListPortfolioPerformanceDatesInput {
  portfolioIds: string[]
}

/**
 * @summary
 * Lists the distinct days that hold performance snapshots.
 *
 * @remarks
 * Fetches the unique snapshot dates of the provided
 * portfolios, ordered ascending, and exposes each one as a
 * UTC day key (`YYYY-MM-DD`).
 *
 * @explanation
 * Use this use case to build the day index the date range
 * filter uses to disable the days without registries.
 *
 * @example
 * const RESULT = await USE_CASE.execute({
 *   portfolioIds: ["portfolio-1"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export class ListPortfolioPerformanceDatesUseCase {
  constructor(
    private portfolioPerformanceRepository: IPortfolioPerformance
  ) {}

  /**
   * @summary
   * Fetches and maps the distinct performance dates.
   *
   * @remarks
   * Fetches the unique snapshot dates of the provided
   * portfolios, ordered ascending, and exposes each one as a
   * UTC day key (`YYYY-MM-DD`).
   *
   * @explanation
   * Use this method to build the day index the date range
   * filter uses to disable the days without registries.
   *
   * @param input - The portfolio identifiers.
   *
   * @returns The distinct day keys.
   *
   * @example
   * const RESULT = await USE_CASE.execute({
   *   portfolioIds: ["portfolio-1"],
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async execute(
    input: ListPortfolioPerformanceDatesInput
  ): Promise<string[]> {
    const PORTFOLIO_IDS = input.portfolioIds.map((id) =>
      EntityId.create(id)
    )
    const DATES =
      await this.portfolioPerformanceRepository.findDistinctDatesByPortfolioIds(
        PORTFOLIO_IDS
      )
    return DATES.map((date) => date.toISOString().slice(0, 10))
  }
}
