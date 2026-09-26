import { IPortfolio } from "@domain/portfolio/interfaces/portfolio.interface"
import { EntityId } from "@/value-objects"
import type { PortfolioResponseDTO } from "../dto/portfolio-response.dto"
import { toResponseDTO } from "../mappers/portfolio.mapper"

export interface ListPortfoliosInput {
  userId: string
}

/**
 * @summary
 * Lists all `Portfolio` entries of a user.
 *
 * @remarks
 * Uses the user id to scope the portfolio query.
 *
 * @explanation
 * Use this use case to list the portfolios of a given
 * user through the service layer.
 *
 * @example
 * const PORTFOLIOS = await LIST_PORTFOLIOS_USE_CASE.execute({
 *   userId: "user-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class ListPortfoliosUseCase {
  constructor(private portfolioRepository: IPortfolio) {}

  /**
   * @summary
   * Fetches all portfolios of the provided user.
   *
   * @remarks
   * Uses the user id to scope the portfolio query.
   *
   * @explanation
   * Use this method to list the portfolios of a given
   * user through the service layer.
   *
   * @param input - Payload with the target user id.
   *
   * @returns The matching portfolios.
   *
   * @example
   * const PORTFOLIOS = await LIST_PORTFOLIOS_USE_CASE.execute({
   *   userId: "user-1",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(
    input: ListPortfoliosInput
  ): Promise<PortfolioResponseDTO[]> {
    const USER_ID = EntityId.create(input.userId)
    const PORTFOLIOS =
      await this.portfolioRepository.findAllByUserId(USER_ID)
    return PORTFOLIOS.map((entity) => toResponseDTO(entity))
  }
}
