import {
  INormsPortfolios,
} from "@domain/norms-portfolio/interfaces/norms-portfolios.interface"
import { EntityId } from "@/value-objects"
import type { NormPortfolioResponseDTO } from "../dto/norm-portfolio-response.dto"
import { toResponseDTO } from "../mappers/norms-portfolio.mapper"

export interface ListPortfolioNormsInput {
  portfolioId: string
}

/**
 * @summary
 * Lists the `Norm` relations of a portfolio.
 *
 * @remarks
 * Uses the portfolio id to scope the relation query.
 *
 * @explanation
 * Use this use case to list the norm relations of a
 * given portfolio through the service layer.
 *
 * @example
 * const RELATIONS = await LIST_PORTFOLIO_NORMS_USE_CASE.execute({
 *   portfolioId: "portfolio-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class ListPortfolioNormsUseCase {
  constructor(private normsPortfoliosRepository: INormsPortfolios) {}

  /**
   * @summary
   * Fetches all relations of the provided portfolio.
   *
   * @param input - Payload with the target portfolio id.
   * @returns The matching relation responses.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(
    input: ListPortfolioNormsInput
  ): Promise<NormPortfolioResponseDTO[]> {
    const PORTFOLIO_ID = EntityId.create(input.portfolioId)
    const RELATIONS = await this.normsPortfoliosRepository
      .findAllByPortfolioId(PORTFOLIO_ID)
    return RELATIONS.map(toResponseDTO)
  }
}