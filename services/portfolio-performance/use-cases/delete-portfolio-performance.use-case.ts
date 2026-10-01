import { IPortfolioPerformance } from "@domain/portfolio-performance/interfaces/portfolio-performance.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"

export interface DeletePortfolioPerformanceInput {
  performanceId: string
}

/**
 * @summary
 * Deletes an existing `PortfolioPerformance`.
 *
 * @remarks
 * Fetches the performance and removes it when it exists.
 * Throws **NotFoundError** when no performance matches the
 * provided id.
 *
 * @explanation
 * Use this use case to remove a portfolio performance through the
 * service layer.
 *
 * @example
 * await DELETE_PORTFOLIO_PERFORMANCE_USE_CASE.execute({
 *   performanceId: "performance-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
export class DeletePortfolioPerformanceUseCase {
  constructor(
    private portfolioPerformanceRepository: IPortfolioPerformance
  ) {}

  /**
   * @summary
   * Deletes the portfolio performance with the provided id.
   *
   * @remarks
   * Fetches the performance and removes it when it exists.
   * Throws **NotFoundError** when no performance matches the
   * provided id.
   *
   * @explanation
   * Use this method to remove a portfolio performance through the
   * service layer.
   *
   * @param input - Payload with the target performance id.
   *
   * @returns Resolves when removed.
   *
   * @example
   * await DELETE_PORTFOLIO_PERFORMANCE_USE_CASE.execute({
   *   performanceId: "performance-1",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-27
   */
  async execute(
    input: DeletePortfolioPerformanceInput
  ): Promise<void> {
    const ID = EntityId.create(input.performanceId)
    const PERFORMANCE =
      await this.portfolioPerformanceRepository.findById(ID)
    if (!PERFORMANCE) {
      throw new NotFoundError(
        "`PortfolioPerformance` not found."
      )
    }
    await this.portfolioPerformanceRepository.delete(ID)
  }
}
