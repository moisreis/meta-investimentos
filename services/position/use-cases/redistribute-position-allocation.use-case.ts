import { IPosition } from "@domain/position/interfaces/position.interface"
import { calculatePositionAllocation } from "@domain/position/calculators/position-allocation.calculator"
import { EntityId } from "@/value-objects"
import type { PositionResponseDTO } from "../dto/position-response.dto"
import { toResponseDTO } from "../mappers/position.mapper"

export interface RedistributePositionAllocationInput {
  portfolioId: string
}

/**
 * @summary
 * Splits the portfolio evenly between its positions.
 *
 * @remarks
 * Loads every position of the portfolio, computes the
 * even share through the position allocation
 * calculator, and persists each position carrying the
 * new share. A portfolio with a single position keeps
 * its full 100% allocation.
 *
 * @explanation
 * Use this use case right after a position joins a
 * portfolio, so the allocations of the new and of the
 * existing positions stay consistent and always sum to
 * 100%. Positions already holding the target share are
 * not written.
 *
 * @example
 * const POSITIONS =
 *   await REDISTRIBUTE_USE_CASE.execute({
 *     portfolioId: "portfolio-1",
 *   });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export class RedistributePositionAllocationUseCase {
  constructor(private positionRepository: IPosition) {}

  /**
   * @summary
   * Redistributes and persists the allocations.
   *
   * @remarks
   * Loads every position of the portfolio, computes the
   * even share through the position allocation
   * calculator, and persists each position carrying the
   * new share. A portfolio with a single position keeps
   * its full 100% allocation.
   *
   * @explanation
   * Use this method right after a position joins a
   * portfolio, so the allocations of the new and of the
   * existing positions stay consistent and always sum to
   * 100%.
   *
   * @param input - Payload with the target portfolio.
   *
   * @returns The positions carrying the new allocation.
   *
   * @example
   * const POSITIONS =
   *   await REDISTRIBUTE_USE_CASE.execute({
   *     portfolioId: "portfolio-1",
   *   });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async execute(
    input: RedistributePositionAllocationInput
  ): Promise<PositionResponseDTO[]> {
    const PORTFOLIO_ID = EntityId.create(input.portfolioId)
    const POSITIONS =
      await this.positionRepository.findAllByPortfolioId(
        PORTFOLIO_ID
      )

    if (POSITIONS.length === 0) return []

    const ALLOCATION = calculatePositionAllocation({
      positionsCount: POSITIONS.length,
    })

    const REDISTRIBUTED = await Promise.all(
      POSITIONS.map(async (position) => {
        if (position.allocation.value.equals(ALLOCATION.value)) {
          return toResponseDTO(position)
        }

        const UPDATED = position.changeAllocation(ALLOCATION)
        const SAVED = await this.positionRepository.save(UPDATED)
        return toResponseDTO(SAVED)
      })
    )

    return REDISTRIBUTED
  }
}
