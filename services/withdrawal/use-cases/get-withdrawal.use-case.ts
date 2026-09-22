import { IWithdrawal } from "@domain/withdrawal/interfaces/withdrawal.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"
import type { WithdrawalResponseDTO } from "../dto/withdrawal-response.dto"
import { toResponseDTO } from "../mappers/withdrawal.mapper"

export interface GetWithdrawalInput {
  withdrawalId: string
}

/**
 * @summary
 * Retrieves an existing `Withdrawal` by its id.
 *
 * @remarks
 * Throws **NotFoundError** when no withdrawal matches
 * the provided id.
 *
 * @explanation
 * Use this use case to fetch a single withdrawal
 * through the service layer.
 *
 * @example
 * const WITHDRAWAL = await GET_WITHDRAWAL_USE_CASE.execute({
 *   withdrawalId: "withdrawal-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class GetWithdrawalUseCase {
  constructor(private withdrawalRepository: IWithdrawal) {}

  /**
   * @summary
   * Fetches the withdrawal with the provided id.
   *
   * @remarks
   * Throws **NotFoundError** when no withdrawal matches
   * the provided id.
   *
   * @explanation
   * Use this method to fetch a single withdrawal
   * through the service layer.
   *
   * @param input - Payload with the target withdrawal id.
   *
   * @returns The matching withdrawal.
   *
   * @example
   * const WITHDRAWAL = await GET_WITHDRAWAL_USE_CASE.execute({
   *   withdrawalId: "withdrawal-1",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(input: GetWithdrawalInput): Promise<WithdrawalResponseDTO> {
    const ID = EntityId.create(input.withdrawalId)
    const WITHDRAWAL = await this.withdrawalRepository.findById(ID)
    if (!WITHDRAWAL) {
      throw new NotFoundError("`Withdrawal` not found.")
    }
    return toResponseDTO(WITHDRAWAL)
  }
}
