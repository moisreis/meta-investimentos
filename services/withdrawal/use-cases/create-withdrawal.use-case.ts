import { Withdrawal } from "@domain/withdrawal/entities/withdrawal.entity"
import { IWithdrawal } from "@domain/withdrawal/interfaces/withdrawal.interface"
import { NotFoundError } from "@errors/not-found.error"
import { IPosition } from "@domain/position/interfaces/position.interface"
import { EntityId } from "@/value-objects"
import type { WithdrawalResponseDTO } from "../dto/withdrawal-response.dto"
import {
  toCreateWithdrawalProps,
  toResponseDTO,
} from "../mappers/withdrawal.mapper"

export interface CreateWithdrawalInput {
  positionId: string
  date: string
  amount: string
  quotas: string
}

/**
 * @summary
 * Creates a new `Withdrawal` and persists it.
 *
 * @remarks
 * Verifies the target position exists, builds entity
 * props through the create mapper, and saves the
 * withdrawal with the withdrawal repository.
 *
 * @explanation
 * Use this use case to register a new withdrawal
 * through the service layer.
 *
 * @example
 * const WITHDRAWAL = await CREATE_WITHDRAWAL_USE_CASE.execute({
 *   positionId: "position-1",
 *   date: "2026-02-10T00:00:00.000Z",
 *   amount: "500",
 *   quotas: "40",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class CreateWithdrawalUseCase {
  constructor(
    private withdrawalRepository: IWithdrawal,
    private positionRepository: IPosition
  ) {}

  /**
   * @summary
   * Creates and persists a new withdrawal.
   *
   * @param input - The withdrawal creation payload.
   * @returns The persisted withdrawal response.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(input: CreateWithdrawalInput): Promise<WithdrawalResponseDTO> {
    const POSITION_ID = EntityId.create(input.positionId)
    const POSITION = await this.positionRepository.findById(POSITION_ID)
    if (!POSITION) {
      throw new NotFoundError("`Position` not found.")
    }
    const PROPS = toCreateWithdrawalProps(input)
    const WITHDRAWAL = Withdrawal.create(PROPS)
    const SAVED = await this.withdrawalRepository.save(WITHDRAWAL)
    return toResponseDTO(SAVED)
  }
}