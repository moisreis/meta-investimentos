import type { Position } from "@domain/position/entities/position.entity"
import { IPosition } from "@domain/position/interfaces/position.interface"
import { EntityId } from "@/value-objects"

export interface ListPositionsByPortfolioIdsInput {
  portfolioIds: string[]
}

/**
 * @summary
 * Lists the fund holdings of the provided portfolios.
 *
 * @remarks
 * Fetches every position that belongs to one of the
 * provided portfolios, converting the string ids into
 * validated `EntityId` values before querying.
 *
 * @explanation
 * Use this use case to hydrate the fund positions of
 * many portfolios in a single query, such as tallying
 * the number of funds held by each portfolio row.
 *
 * @example
 * const POSITIONS = await USE_CASE.execute({
 *   portfolioIds: ["portfolio-1"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export class ListPositionsByPortfolioIdsUseCase {
  constructor(private positionRepository: IPosition) {}

  /**
   * @summary
   * Fetches the positions of the provided portfolios.
   *
   * @remarks
   * Fetches every position that belongs to one of the
   * provided portfolios, converting the string ids into
   * validated `EntityId` values before querying.
   *
   * @explanation
   * Use this method to load the fund positions of many
   * portfolios at once through the service layer.
   *
   * @param input - The portfolio identifiers.
   *
   * @returns The matching positions.
   *
   * @example
   * const POSITIONS = await USE_CASE.execute({
   *   portfolioIds: ["portfolio-1"],
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async execute(
    input: ListPositionsByPortfolioIdsInput
  ): Promise<Position[]> {
    const PORTFOLIO_IDS = input.portfolioIds.map((id) =>
      EntityId.create(id)
    )
    return this.positionRepository.findAllByPortfolioIds(
      PORTFOLIO_IDS
    )
  }
}
