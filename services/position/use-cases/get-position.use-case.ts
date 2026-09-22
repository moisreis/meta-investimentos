import { IPosition } from "@domain/position/interfaces/position.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"
import type { PositionResponseDTO } from "../dto/position-response.dto"
import { toResponseDTO } from "../mappers/position.mapper"

export interface GetPositionInput {
  positionId: string
}

/**
 * @summary
 * Retrieves an existing `Position` by its id.
 *
 * @remarks
 * Throws **NotFoundError** when no position matches the
 * provided id.
 *
 * @explanation
 * Use this use case to fetch a single position through
 * the service layer.
 *
 * @example
 * const POSITION = await GET_POSITION_USE_CASE.execute({
 *   positionId: "position-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class GetPositionUseCase {
  constructor(private positionRepository: IPosition) {}

  /**
   * @summary
   * Fetches the position with the provided id.
   *
   * @remarks
   * Throws **NotFoundError** when no position matches the
   * provided id.
   *
   * @explanation
   * Use this method to fetch a single position through
   * the service layer.
   *
   * @param input - Payload with the target position id.
   *
   * @returns The matching position.
   *
   * @example
   * const POSITION = await GET_POSITION_USE_CASE.execute({
   *   positionId: "position-1",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(input: GetPositionInput): Promise<PositionResponseDTO> {
    const ID = EntityId.create(input.positionId)
    const POSITION = await this.positionRepository.findById(ID)
    if (!POSITION) {
      throw new NotFoundError("`Position` not found.")
    }
    return toResponseDTO(POSITION)
  }
}
