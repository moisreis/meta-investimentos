import { EntityId } from "@/value-objects"
import { IPortfolioPerformance } from "@domain/portfolio-performance/interfaces/portfolio-performance.interface"
import type { PortfolioPerformanceResponseDTO } from "../dto/portfolio-performance-response.dto"
import { toResponseDTO } from "../mappers/portfolio-performance.mapper"

export interface ListPortfolioPerformanceByRangeInput {
  portfolioIds: string[]
  from: Date
  to: Date
}

/**
 * @summary
 * Lists the latest portfolio performance snapshots within a
 * date range.
 *
 * @remarks
 * Resolves the latest snapshot of each provided portfolio
 * that falls inside `[from, to]` and maps each one to the
 * response DTO in order.
 *
 * @explanation
 * Use this use case to retrieve the performance state that
 * closes a date range for many portfolios from the service
 * layer.
 *
 * @example
 * const RESULT = await USE_CASE.execute({
 *   portfolioIds: ["portfolio-1"],
 *   from: START_DATE,
 *   to: END_DATE,
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export class ListPortfolioPerformanceByRangeUseCase {
  constructor(
    private portfolioPerformanceRepository: IPortfolioPerformance
  ) {}

  /**
   * @summary
   * Fetches and maps the latest performances in the range.
   *
   * @remarks
   * Resolves the latest snapshot of each provided portfolio
   * that falls inside `[from, to]` and maps each one to the
   * response DTO in order.
   *
   * @explanation
   * Use this method to fetch the snapshot that closes a
   * date range for many portfolios.
   *
   * @param input - The portfolios and the date boundaries.
   *
   * @returns The mapped performances.
   *
   * @example
   * const RESULT = await USE_CASE.execute({
   *   portfolioIds: ["portfolio-1"],
   *   from: START_DATE,
   *   to: END_DATE,
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async execute(
    input: ListPortfolioPerformanceByRangeInput
  ): Promise<PortfolioPerformanceResponseDTO[]> {
    const PORTFOLIO_IDS = input.portfolioIds.map((id) =>
      EntityId.create(id)
    )
    const PERFORMANCES =
      await this.portfolioPerformanceRepository.findLatestByPortfolioIdsInRange(
        PORTFOLIO_IDS,
        input.from,
        input.to
      )
    return PERFORMANCES.map((entity) => toResponseDTO(entity))
  }
}
