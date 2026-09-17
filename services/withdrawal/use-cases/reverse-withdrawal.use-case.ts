import { IWithdrawal } from "@domain/withdrawal/interfaces/withdrawal.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"
import type { WithdrawalResponseDTO } from "../dto/withdrawal-response.dto"
import { toResponseDTO } from "../mappers/withdrawal.mapper"

export interface ReverseWithdrawalInput {
  withdrawalId: string
  reversedByUserId: string
}

/**
 * @summary
 * Reverses an existing `Withdrawal`.
 *
 * @remarks
 * Fetches the withdrawal and applies `reverse` with
 * the provided user, then persists the updated entity.
 *
 * @explanation
 * Use this use case to cancel a withdrawal through
 * the service layer.
 *
 * @example
 * const WITHDRAWAL = await REVERSE_WITHDRAWAL_USE_CASE.execute({
 *   withdrawalId: "withdrawal-1",
 *   reversedByUserId: "user-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class ReverseWithdrawalUseCase {
  constructor(private withdrawalRepository: IWithdrawal) {}

  /**
   * @summary
   * Reverses and persists the withdrawal.
   *
   * @param input - Payload with the target withdrawal id
   *                and the reversing user id.
   * @returns The reversed withdrawal response.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(input: ReverseWithdrawalInput): Promise<WithdrawalResponseDTO> {
    const ID = EntityId.create(input.withdrawalId)
    const WITHDRAWAL = await this.withdrawalRepository.findById(ID)
    if (!WITHDRAWAL) {
      throw new NotFoundError("`Withdrawal` not found.")
    }
    const REVERSE_USER_ID = EntityId.create(input.reversedByUserId)
    const REVERSED = WITHDRAWAL.reverse(REVERSE_USER_ID)
    const SAVED = await this.withdrawalRepository.save(REVERSED)
    return toResponseDTO(SAVED)
  }
}