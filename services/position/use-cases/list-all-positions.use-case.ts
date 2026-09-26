import { IPosition } from "@domain/position/interfaces/position.interface"
import { EntityId } from "@/value-objects"
import type { PositionResponseDTO } from "../dto/position-response.dto"
import { toResponseDTO } from "../mappers/position.mapper"

export interface ListAllPositionsInput {
  portfolioIds: string[]
}

/**
 * @summary
 * Lists all `Position` entries across the provided
 * portfolios.
 *
 * @remarks
 * Maps the portfolio ids into entity ids, short-circuits
 * when no portfolio is provided, and delegates the query
 * to the position repository bulk lookup by portfolio
 * ids.
 *
 * @explanation
 * Use this use case to feed the position registry
 * screen, where rows come from every portfolio of the
 * session user instead of a single one.
 *
 * @example
 * const POSITIONS = await LIST_ALL_POSITIONS_USE_CASE
 *   .execute({
 *     portfolioIds: ["portfolio-1", "portfolio-2"],
 *   });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export class ListAllPositionsUseCase {
  constructor(private positionRepository: IPosition) {}

  /**
   * @summary
   * Fetches all positions of the provided portfolios.
   *
   * @remarks
   * Returns an empty array when the portfolio id list is
   * empty.
   *
   * @explanation
   * Use this method to list the positions of many
   * portfolios through the service layer.
   *
   * @param input - Payload with the target portfolio ids.
   *
   * @returns The matching positions.
   *
   * @example
   * const POSITIONS = await LIST_ALL_POSITIONS_USE_CASE
   *   .execute({
   *     portfolioIds: ["portfolio-1"],
   *   });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async execute(
    input: ListAllPositionsInput
  ): Promise<PositionResponseDTO[]> {
    if (input.portfolioIds.length === 0) return []

    const PORTFOLIO_IDS = input.portfolioIds.map((portfolioId) =>
      EntityId.create(portfolioId)
    )

    const POSITIONS =
      await this.positionRepository.findAllByPortfolioIds(
        PORTFOLIO_IDS
      )

    return POSITIONS.map(toResponseDTO)
  }
}
