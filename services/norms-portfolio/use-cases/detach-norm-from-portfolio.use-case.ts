import {
  INormsPortfolios,
} from "@domain/norms-portfolio/interfaces/norms-portfolios.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"

export interface DetachNormFromPortfolioInput {
  normId: string
  portfolioId: string
}

/**
 * @summary
 * Detaches a `Norm` from a `Portfolio`.
 *
 * @remarks
 * Fetches the relation and removes it when it exists.
 * Throws **NotFoundError** when the relation is missing.
 *
 * @explanation
 * Use this use case to remove a norm-portfolio relation
 * through the service layer.
 *
 * @example
 * await DETACH_NORM_FROM_PORTFOLIO_USE_CASE.execute({
 *   normId: "norm-1",
 *   portfolioId: "portfolio-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class DetachNormFromPortfolioUseCase {
  constructor(private normsPortfoliosRepository: INormsPortfolios) {}

  /**
   * @summary
   * Detaches the relation with the provided keys.
   *
   * @param input - Payload with the relation keys.
   * @returns Resolves when the relation is removed.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(input: DetachNormFromPortfolioInput): Promise<void> {
    const NORM_ID = EntityId.create(input.normId)
    const PORTFOLIO_ID = EntityId.create(input.portfolioId)
    const EXISTING = await this.normsPortfoliosRepository
      .findByNormIdAndPortfolioId(NORM_ID, PORTFOLIO_ID)
    if (!EXISTING) {
      throw new NotFoundError("`NormPortfolio` relation not found.")
    }
    await this.normsPortfoliosRepository.delete(NORM_ID, PORTFOLIO_ID)
  }
}