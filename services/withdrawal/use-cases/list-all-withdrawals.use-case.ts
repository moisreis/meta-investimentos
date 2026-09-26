import { IWithdrawal } from "@domain/withdrawal/interfaces/withdrawal.interface"
import { EntityId } from "@/value-objects"
import type { WithdrawalResponseDTO } from "../dto/withdrawal-response.dto"
import { toResponseDTO } from "../mappers/withdrawal.mapper"

export interface ListAllWithdrawalsInput {
  positionIds: string[]
}

/**
 * @summary
 * Lists all `Withdrawal` entries across the provided
 * positions.
 *
 * @remarks
 * Maps the position ids into entity ids, short-circuits
 * when no position is provided, and delegates the query
 * to the withdrawal repository bulk lookup by position
 * ids.
 *
 * @explanation
 * Use this use case to feed the withdrawal registry
 * screen, where rows come from every portfolio of the
 * session user instead of a single position.
 *
 * @example
 * const WITHDRAWALS = await LIST_ALL_WITHDRAWALS_USE_CASE
 *   .execute({
 *     positionIds: ["position-1", "position-2"],
 *   });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export class ListAllWithdrawalsUseCase {
  constructor(private withdrawalRepository: IWithdrawal) {}

  /**
   * @summary
   * Fetches all withdrawals of the provided positions.
   *
   * @remarks
   * Returns an empty array when the position id list is
   * empty.
   *
   * @explanation
   * Use this method to list the withdrawals of many
   * positions through the service layer.
   *
   * @param input - Payload with the target position ids.
   *
   * @returns The matching withdrawals.
   *
   * @example
   * const WITHDRAWALS = await LIST_ALL_WITHDRAWALS_USE_CASE
   *   .execute({
   *     positionIds: ["position-1"],
   *   });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async execute(
    input: ListAllWithdrawalsInput
  ): Promise<WithdrawalResponseDTO[]> {
    if (input.positionIds.length === 0) return []

    const POSITION_IDS = input.positionIds.map((positionId) =>
      EntityId.create(positionId)
    )

    const WITHDRAWALS =
      await this.withdrawalRepository.findAllByPositionIds(
        POSITION_IDS
      )

    return WITHDRAWALS.map(toResponseDTO)
  }
}
