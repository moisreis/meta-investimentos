import { IPortfolio } from "@domain/portfolio/interfaces/portfolio.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"

export interface DeletePortfolioInput {
  portfolioId: string
}

/**
 * @summary
 * Deletes an existing `Portfolio`.
 *
 * @remarks
 * Fetches the portfolio and removes it when it exists.
 * Throws **NotFoundError** when no portfolio matches the
 * provided id.
 *
 * @explanation
 * Use this use case to remove a portfolio through the
 * service layer.
 *
 * @example
 * await DELETE_PORTFOLIO_USE_CASE.execute({
 *   portfolioId: "portfolio-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class DeletePortfolioUseCase {
  constructor(private portfolioRepository: IPortfolio) {}

  /**
   * @summary
   * Deletes the portfolio with the provided id.
   *
   * @param input - Payload with the target portfolio id.
   * @returns Resolves when the portfolio is removed.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(input: DeletePortfolioInput): Promise<void> {
    const ID = EntityId.create(input.portfolioId)
    const PORTFOLIO = await this.portfolioRepository.findById(ID)
    if (!PORTFOLIO) {
      throw new NotFoundError("`Portfolio` not found.")
    }
    await this.portfolioRepository.delete(ID)
  }
}