import { EntityId } from "@/value-objects"
import { IPositionPerformance } from "@domain/position-performance/interfaces/position-performance.interface"
import { NotFoundError } from "@errors/not-found.error"
import type { PositionPerformanceResponseDTO } from "../dto/position-performance-response.dto"
import { toResponseDTO } from "../mappers/position-performance.mapper"

export interface GetPositionPerformanceInput {
  id: string
}

/**
 * @summary
 * Retrieves a single position performance snapshot.
 *
 * @remarks
 * Looks up the performance by its id and maps the entity
 * to the response DTO through the service mapper.
 *
 * @explanation
 * Use this use case to fetch one daily performance record
 * from the service layer.
 *
 * @example
 * const RESULT = await USE_CASE.execute({
 *   id: "performance-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class GetPositionPerformanceUseCase {
  constructor(private positionPerformanceRepository: IPositionPerformance) {}

  /**
   * @summary
   * Retrieves and maps the position performance.
   *
   * @param input - The performance identifier.
   * @returns The mapped performance response.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(
    input: GetPositionPerformanceInput
  ): Promise<PositionPerformanceResponseDTO> {
    const PERFORMANCE = await this.positionPerformanceRepository.findById(
      EntityId.create(input.id)
    )
    if (!PERFORMANCE) {
      throw new NotFoundError("`PositionPerformance` not found.")
    }
    return toResponseDTO(PERFORMANCE)
  }
}
