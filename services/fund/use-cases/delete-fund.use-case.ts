import { IFund } from "@domain/fund/interfaces/fund.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"

export interface DeleteFundInput {
  fundId: string
}

/**
 * @summary
 * Deletes an existing `Fund`.
 *
 * @remarks
 * Fetches the fund and removes it when it exists.
 * Throws **NotFoundError** when no fund matches the
 * provided id.
 *
 * @explanation
 * Use this use case to remove a fund through the
 * service layer.
 *
 * @example
 * await DELETE_FUND_USE_CASE.execute({
 *   fundId: "fund-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export class DeleteFundUseCase {
  constructor(private fundRepository: IFund) {}

  /**
   * @summary
   * Deletes the fund with the provided id.
   *
   * @remarks
   * Fetches the fund and removes it when it exists.
   * Throws **NotFoundError** when no fund matches the
   * provided id.
   *
   * @explanation
   * Use this method to remove a fund through the
   * service layer.
   *
   * @param input - Payload with the target fund id.
   *
   * @returns Resolves when removed.
   *
   * @example
   * await DELETE_FUND_USE_CASE.execute({
   *   fundId: "fund-1",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async execute(input: DeleteFundInput): Promise<void> {
    const ID = EntityId.create(input.fundId)
    const FUND = await this.fundRepository.findById(ID)

    if (!FUND) {
      throw new NotFoundError("`Fund` not found.")
    }

    await this.fundRepository.delete(ID)
  }
}
