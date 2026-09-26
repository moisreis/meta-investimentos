import { EntityId } from "@/value-objects"
import { IPositionPerformance } from "@domain/position-performance/interfaces/position-performance.interface"
import type { PositionPerformanceResponseDTO } from "../dto/position-performance-response.dto"
import { toResponseDTO } from "../mappers/position-performance.mapper"

export interface ListPositionPerformanceInput {
  positionId: string
}

/**
 * @summary
 * Lists the performance snapshots of a position.
 *
 * @remarks
 * Fetches all daily records for the provided position
 * and maps each one to the response DTO in order.
 *
 * @explanation
 * Use this use case to retrieve the performance history
 * of a single position from the service layer.
 *
 * @example
 * const RESULT = await USE_CASE.execute({
 *   positionId: "position-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class ListPositionPerformanceUseCase {
  constructor(
    private positionPerformanceRepository: IPositionPerformance
  ) {}

  /**
   * @summary
   * Lists and maps the position performances.
   *
   * @remarks
   * Fetches all daily records for the provided position
   * and maps each one to the response DTO in order.
   *
   * @explanation
   * Use this method to retrieve the performance history
   * of a single position from the service layer.
   *
   * @param input - The position identifier.
   *
   * @returns The mapped performance.
   *
   * @example
   * const RESULT = await USE_CASE.execute({
   *   positionId: "position-1",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(
    input: ListPositionPerformanceInput
  ): Promise<PositionPerformanceResponseDTO[]> {
    const PERFORMANCES =
      await this.positionPerformanceRepository.findAllByPositionId(
        EntityId.create(input.positionId)
      )
    return PERFORMANCES.map((performance) =>
      toResponseDTO(performance)
    )
  }
}
