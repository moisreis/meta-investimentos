import { IPortfolioPerformance } from "@domain/portfolio-performance/interfaces/portfolio-performance.interface"
import { EntityId } from "@/value-objects"
import type { PortfolioPerformanceResponseDTO } from "../dto/portfolio-performance-response.dto"
import { toResponseDTO } from "../mappers/portfolio-performance.mapper"

export interface ListAllPortfolioPerformancesInput {
  portfolioIds: string[]
}

/**
 * @summary
 * Lists all `PortfolioPerformance` entries across the
 * provided portfolios.
 *
 * @remarks
 * Maps the portfolio ids into entity ids, short-circuits
 * when no portfolio is provided, and delegates the query
 * to the performance repository bulk lookup by portfolio
 * ids.
 *
 * @explanation
 * Use this use case to feed the portfolio performance
 * registry screen, where rows come from every portfolio
 * of the session user instead of a single one.
 *
 * @example
 * const PERFORMANCES = await USE_CASE.execute({
 *   portfolioIds: ["portfolio-1", "portfolio-2"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export class ListAllPortfolioPerformancesUseCase {
  constructor(
    private portfolioPerformanceRepository: IPortfolioPerformance
  ) {}

  /**
   * @summary
   * Fetches all performances of the provided portfolios.
   *
   * @remarks
   * Returns an empty array when the portfolio id list is
   * empty.
   *
   * @explanation
   * Use this method to list the performance records of
   * many portfolios through the service layer.
   *
   * @param input - Payload with the target portfolio ids.
   *
   * @returns The matching performances.
   *
   * @example
   * const PERFORMANCES = await USE_CASE.execute({
   *   portfolioIds: ["portfolio-1"],
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async execute(
    input: ListAllPortfolioPerformancesInput
  ): Promise<PortfolioPerformanceResponseDTO[]> {
    if (input.portfolioIds.length === 0) return []

    const PORTFOLIO_IDS = input.portfolioIds.map((portfolioId) =>
      EntityId.create(portfolioId)
    )

    const PERFORMANCES =
      await this.portfolioPerformanceRepository.findAllByPortfolioIds(
        PORTFOLIO_IDS
      )

    return PERFORMANCES.map(toResponseDTO)
  }
}
