import { calculateWithdrawalQuotas } from "@domain/withdrawal/calculators/withdrawal-quotas.calculator"
import type { IPosition } from "@domain/position/interfaces/position.interface"
import type { IQuota } from "@domain/quota/interfaces/quota.interface"
import { EntityId, PositiveMoney } from "@/value-objects"
import { NotFoundError } from "@errors/not-found.error"
import type { WithdrawalResponseDTO } from "../dto/withdrawal-response.dto"
import { CreateWithdrawalUseCase } from "./create-withdrawal.use-case"

export interface AddWithdrawalInput {
  positionId: string
  date: string
  amount: string
}

/**
 * @summary
 * Records a withdrawal with system-calculated quotas.
 *
 * @remarks
 * Loads the quota price of the withdrawal date and
 * delegates the quantity to the domain withdrawal
 * quotas calculator before the withdrawal is
 * created. The number of quotas is never provided
 * by the caller.
 *
 * @explanation
 * Use this use case to add a withdrawal to a
 * position from the presentation layer. It owns the
 * quota lookup so the server action stays a thin
 * adapter and the form never sends a quota value.
 *
 * @example
 * const WITHDRAWAL = await ADD_WITHDRAWAL_USE_CASE.execute({
 *   positionId: "position-1",
 *   date: "2026-01-10",
 *   amount: "1000",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export class AddWithdrawalUseCase {
  constructor(
    private positionRepository: IPosition,
    private quotaRepository: IQuota,
    private createWithdrawalUseCase: CreateWithdrawalUseCase
  ) {}

  /**
   * @summary
   * Adds the withdrawal to the position.
   *
   * @remarks
   * Loads the quota price of the withdrawal date and
   * delegates the quantity to the domain withdrawal
   * quotas calculator before the withdrawal is
   * created. The number of quotas is never provided
   * by the caller.
   *
   * @explanation
   * Use this method to add a withdrawal to a
   * position. The quotas are always calculated by
   * the system from the quota price of the given
   * withdrawal date.
   *
   * @param input - Payload with the position, the
   * withdrawal date and the amount.
   *
   * @returns The recorded withdrawal.
   *
   * @example
   * const WITHDRAWAL = await ADD_WITHDRAWAL_USE_CASE.execute({
   *   positionId: "position-1",
   *   date: "2026-01-10",
   *   amount: "1000",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async execute(
    input: AddWithdrawalInput
  ): Promise<WithdrawalResponseDTO> {
    const QUOTAS = await this.resolveQuotas(input)

    return this.createWithdrawalUseCase.execute({
      positionId: input.positionId,
      date: input.date,
      amount: input.amount,
      quotas: QUOTAS,
    })
  }

  // Derives the quotas from the quota price of the
  // withdrawal date. Without a quota price on that
  // day the withdrawal cannot be valued.
  private async resolveQuotas(
    input: AddWithdrawalInput
  ): Promise<string> {
    const FUND_ID = await this.resolveFundId(input.positionId)

    const QUOTA = await this.quotaRepository.findByFundIdAndDate(
      FUND_ID,
      new Date(input.date)
    )

    if (!QUOTA) {
      throw new NotFoundError(
        "`Quota` not found for the withdrawal date."
      )
    }

    const QUOTAS = calculateWithdrawalQuotas({
      withdrawal: PositiveMoney.create(input.amount),
      quota: QUOTA.price,
    })

    return QUOTAS.value.toString()
  }

  // The quota price is indexed by fund, so the fund
  // of the position is resolved first.
  private async resolveFundId(
    positionId: string
  ): Promise<EntityId> {
    const POSITION = await this.positionRepository.findById(
      EntityId.create(positionId)
    )

    if (!POSITION) {
      throw new NotFoundError("`Position` not found.")
    }

    return POSITION.fundId
  }
}
