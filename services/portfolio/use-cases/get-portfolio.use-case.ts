import { IPortfolio } from "@domain/portfolio/interfaces/portfolio.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"
import type { PortfolioResponseDTO } from "../dto/portfolio-response.dto"
import { toResponseDTO } from "../mappers/portfolio.mapper"

export interface GetPortfolioInput {
  portfolioId: string
}

/**
 * @summary
 * Retrieves an existing `Portfolio` by its id.
 *
 * @remarks
 * Throws **NotFoundError** when no portfolio matches the
 * provided id.
 *
 * @explanation
 * Use this use case to fetch a single portfolio through
 * the service layer.
 *
 * @example
 * const PORTFOLIO = await GET_PORTFOLIO_USE_CASE.execute({
 *   portfolioId: "portfolio-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class GetPortfolioUseCase {
  constructor(private portfolioRepository: IPortfolio) {}

  /**
   * @summary
   * Fetches the portfolio with the provided id.
   *
   * @remarks
   * Throws **NotFoundError** when no portfolio matches the
   * provided id.
   *
   * @explanation
   * Use this method to fetch a single portfolio through
   * the service layer.
   *
   * @param input - Payload with the target portfolio id.
   *
   * @returns The matching portfolio.
   *
   * @example
   * const PORTFOLIO = await GET_PORTFOLIO_USE_CASE.execute({
   *   portfolioId: "portfolio-1",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(
    input: GetPortfolioInput
  ): Promise<PortfolioResponseDTO> {
    const ID = EntityId.create(input.portfolioId)
    const PORTFOLIO = await this.portfolioRepository.findById(ID)
    if (!PORTFOLIO) {
      throw new NotFoundError("`Portfolio` not found.")
    }
    return toResponseDTO(PORTFOLIO)
  }
}
