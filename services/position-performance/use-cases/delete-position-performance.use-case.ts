import { IPositionPerformance } from "@domain/position-performance/interfaces/position-performance.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"

export interface DeletePositionPerformanceInput {
  performanceId: string
}

/**
 * @summary
 * Deletes an existing `PositionPerformance`.
 *
 * @remarks
 * Fetches the performance and removes it when it exists.
 * Throws **NotFoundError** when no performance matches the
 * provided id.
 *
 * @explanation
 * Use this use case to remove a position performance through the
 * service layer.
 *
 * @example
 * await DELETE_POSITION_PERFORMANCE_USE_CASE.execute({
 *   performanceId: "performance-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
export class DeletePositionPerformanceUseCase {
  constructor(
    private positionPerformanceRepository: IPositionPerformance
  ) {}

  /**
   * @summary
   * Deletes the position performance with the provided id.
   *
   * @remarks
   * Fetches the performance and removes it when it exists.
   * Throws **NotFoundError** when no performance matches the
   * provided id.
   *
   * @explanation
   * Use this method to remove a position performance through the
   * service layer.
   *
   * @param input - Payload with the target performance id.
   *
   * @returns Resolves when removed.
   *
   * @example
   * await DELETE_POSITION_PERFORMANCE_USE_CASE.execute({
   *   performanceId: "performance-1",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-27
   */
  async execute(
    input: DeletePositionPerformanceInput
  ): Promise<void> {
    const ID = EntityId.create(input.performanceId)
    const PERFORMANCE =
      await this.positionPerformanceRepository.findById(ID)
    if (!PERFORMANCE) {
      throw new NotFoundError("`PositionPerformance` not found.")
    }
    await this.positionPerformanceRepository.delete(ID)
  }
}
