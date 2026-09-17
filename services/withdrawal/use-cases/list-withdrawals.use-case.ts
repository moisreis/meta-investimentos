import { IWithdrawal } from "@domain/withdrawal/interfaces/withdrawal.interface"
import { EntityId } from "@/value-objects"
import type { WithdrawalResponseDTO } from "../dto/withdrawal-response.dto"
import { toResponseDTO } from "../mappers/withdrawal.mapper"

export interface ListWithdrawalsInput {
  positionId: string
}

/**
 * @summary
 * Lists all `Withdrawal` entries of a position.
 *
 * @remarks
 * Uses the position id to scope the withdrawal query.
 *
 * @explanation
 * Use this use case to list the withdrawals of a given
 * position through the service layer.
 *
 * @example
 * const WITHDRAWALS = await LIST_WITHDRAWALS_USE_CASE.execute({
 *   positionId: "position-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class ListWithdrawalsUseCase {
  constructor(private withdrawalRepository: IWithdrawal) {}

  /**
   * @summary
   * Fetches all withdrawals of the provided position.
   *
   * @param input - Payload with the target position id.
   * @returns The matching withdrawal responses.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(input: ListWithdrawalsInput): Promise<WithdrawalResponseDTO[]> {
    const POSITION_ID = EntityId.create(input.positionId)
    const WITHDRAWALS = await this.withdrawalRepository.findAllByPositionId(
      POSITION_ID
    )
    return WITHDRAWALS.map(toResponseDTO)
  }
}