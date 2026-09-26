import { IPositionPerformance } from "@domain/position-performance/interfaces/position-performance.interface"
import { EntityId } from "@/value-objects"
import type { PositionPerformanceResponseDTO } from "../dto/position-performance-response.dto"
import { toResponseDTO } from "../mappers/position-performance.mapper"

export interface ListAllPositionPerformancesInput {
  positionIds: string[]
}

/**
 * @summary
 * Lists all `PositionPerformance` entries across the
 * provided positions.
 *
 * @remarks
 * Maps the position ids into entity ids, short-circuits
 * when no position is provided, and delegates the query
 * to the performance repository bulk lookup by position
 * ids.
 *
 * @explanation
 * Use this use case to feed the position performance
 * registry screen, where rows come from every position
 * of the session user instead of a single one.
 *
 * @example
 * const PERFORMANCES = await USE_CASE.execute({
 *   positionIds: ["position-1", "position-2"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export class ListAllPositionPerformancesUseCase {
  constructor(
    private positionPerformanceRepository: IPositionPerformance
  ) {}

  /**
   * @summary
   * Fetches all performances of the provided positions.
   *
   * @remarks
   * Returns an empty array when the position id list is
   * empty.
   *
   * @explanation
   * Use this method to list the performance records of
   * many positions through the service layer.
   *
   * @param input - Payload with the target position ids.
   *
   * @returns The matching performances.
   *
   * @example
   * const PERFORMANCES = await USE_CASE.execute({
   *   positionIds: ["position-1"],
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async execute(
    input: ListAllPositionPerformancesInput
  ): Promise<PositionPerformanceResponseDTO[]> {
    if (input.positionIds.length === 0) return []

    const POSITION_IDS = input.positionIds.map((positionId) =>
      EntityId.create(positionId)
    )

    const PERFORMANCES =
      await this.positionPerformanceRepository.findAllByPositionIds(
        POSITION_IDS
      )

    return PERFORMANCES.map(toResponseDTO)
  }
}
