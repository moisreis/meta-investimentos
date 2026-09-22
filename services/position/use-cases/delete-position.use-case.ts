import { IPosition } from "@domain/position/interfaces/position.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"

export interface DeletePositionInput {
  positionId: string
}

/**
 * @summary
 * Deletes an existing `Position`.
 *
 * @remarks
 * Fetches the position and removes it when it exists.
 * Throws **NotFoundError** when no position matches the
 * provided id.
 *
 * @explanation
 * Use this use case to remove a position through the
 * service layer.
 *
 * @example
 * await DELETE_POSITION_USE_CASE.execute({
 *   positionId: "position-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class DeletePositionUseCase {
  constructor(private positionRepository: IPosition) {}

  /**
   * @summary
   * Deletes the position with the provided id.
   *
   * @remarks
   * Fetches the position and removes it when it exists.
   * Throws **NotFoundError** when no position matches the
   * provided id.
   *
   * @explanation
   * Use this method to remove a position through the
   * service layer.
   *
   * @param input - Payload with the target position id.
   *
   * @returns Resolves when removed.
   *
   * @example
   * await DELETE_POSITION_USE_CASE.execute({
   *   positionId: "position-1",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(input: DeletePositionInput): Promise<void> {
    const ID = EntityId.create(input.positionId)
    const POSITION = await this.positionRepository.findById(ID)
    if (!POSITION) {
      throw new NotFoundError("`Position` not found.")
    }
    await this.positionRepository.delete(ID)
  }
}
