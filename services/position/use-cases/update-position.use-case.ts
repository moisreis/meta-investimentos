import { IPosition } from "@domain/position/interfaces/position.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId, PositiveMoney } from "@/value-objects"
import type { PositionResponseDTO } from "../dto/position-response.dto"
import { toResponseDTO } from "../mappers/position.mapper"

export interface UpdatePositionInput {
  positionId: string
  initialBalance: string
  initialBalanceDate: string
}

/**
 * @summary
 * Updates an existing `Position`.
 *
 * @remarks
 * Fetches the position, applies `setInitialBalance` with
 * the provided values, and persists the updated entity.
 *
 * @explanation
 * Use this use case to set the initial balance of an
 * existing position through the service layer.
 *
 * @example
 * const POSITION = await UPDATE_POSITION_USE_CASE.execute({
 *   positionId: "position-1",
 *   initialBalance: "1500",
 *   initialBalanceDate: "2026-01-01T00:00:00.000Z",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class UpdatePositionUseCase {
  constructor(private positionRepository: IPosition) {}

  /**
   * @summary
   * Updates and persists a position.
   *
   * @remarks
   * Fetches the position, applies `setInitialBalance` with
   * the provided values, and persists the updated entity.
   *
   * @explanation
   * Use this method to set the initial balance of an
   * existing position through the service layer.
   *
   * @param input - Payload with the target position id
   *                and the new initial balance.
   *
   * @returns The updated position.
   *
   * @example
   * const POSITION = await UPDATE_POSITION_USE_CASE.execute({
   *   positionId: "position-1",
   *   initialBalance: "1500",
   *   initialBalanceDate: "2026-01-01T00:00:00.000Z",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(input: UpdatePositionInput): Promise<PositionResponseDTO> {
    const ID = EntityId.create(input.positionId)
    const POSITION = await this.positionRepository.findById(ID)
    if (!POSITION) {
      throw new NotFoundError("`Position` not found.")
    }
    const UPDATED = POSITION.setInitialBalance(
      PositiveMoney.create(input.initialBalance),
      new Date(input.initialBalanceDate)
    )
    const SAVED = await this.positionRepository.save(UPDATED)
    return toResponseDTO(SAVED)
  }
}
