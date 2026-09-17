import { Position } from "@domain/position/entities/position.entity"
import { IPosition } from "@domain/position/interfaces/position.interface"
import type { PositionResponseDTO } from "../dto/position-response.dto"
import { toCreatePositionProps, toResponseDTO } from "../mappers/position.mapper"

export interface CreatePositionInput {
  portfolioId: string
  fundId: string
  initialBalance?: string | null
  initialBalanceDate?: string | null
}

/**
 * @summary
 * Creates a new `Position` and persists it.
 *
 * @remarks
 * Builds entity props through the create mapper and
 * saves the position with the position repository.
 *
 * @explanation
 * Use this use case to register a new position through
 * the service layer.
 *
 * @example
 * const POSITION = await CREATE_POSITION_USE_CASE.execute({
 *   portfolioId: "portfolio-1",
 *   fundId: "fund-1",
 *   initialBalance: "1000",
 *   initialBalanceDate: "2026-01-01T00:00:00.000Z",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class CreatePositionUseCase {
  constructor(private positionRepository: IPosition) {}

  /**
   * @summary
   * Creates and persists a new position.
   *
   * @param input - The position creation payload.
   * @returns The persisted position response.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(input: CreatePositionInput): Promise<PositionResponseDTO> {
    const PROPS = toCreatePositionProps(input)
    const POSITION = Position.create(PROPS)
    const SAVED = await this.positionRepository.save(POSITION)
    return toResponseDTO(SAVED)
  }
}