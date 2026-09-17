import { EntityId } from "@/value-objects"
import { IPortfolioPerformance } from "@domain/portfolio-performance/interfaces/portfolio-performance.interface"
import type { PortfolioPerformanceResponseDTO } from "../dto/portfolio-performance-response.dto"
import { toResponseDTO } from "../mappers/portfolio-performance.mapper"

export interface ListPortfolioPerformanceInput {
  portfolioId: string
}

/**
 * @summary
 * Lists the performance snapshots of a portfolio.
 *
 * @remarks
 * Fetches all daily records for the provided portfolio
 * and maps each one to the response DTO in order.
 *
 * @explanation
 * Use this use case to retrieve the performance history
 * of a single portfolio from the service layer.
 *
 * @example
 * const RESULT = await USE_CASE.execute({
 *   portfolioId: "portfolio-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class ListPortfolioPerformanceUseCase {
  constructor(private portfolioPerformanceRepository: IPortfolioPerformance) {}

  /**
   * @summary
   * Lists and maps the portfolio performances.
   *
   * @param input - The portfolio identifier.
   * @returns The mapped performance responses.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(
    input: ListPortfolioPerformanceInput
  ): Promise<PortfolioPerformanceResponseDTO[]> {
    const PERFORMANCES =
      await this.portfolioPerformanceRepository.findAllByPortfolioId(
        EntityId.create(input.portfolioId)
      )
    return PERFORMANCES.map((performance) => toResponseDTO(performance))
  }
}
