import { IQuota } from "@domain/quota/interfaces/quota.interface"
import { EntityId } from "@/value-objects"

/**
 * @summary
 * Retrieves all quota dates for a fund.
 *
 * @remarks
 * Returns an array of dates (as strings in `yyyy-MM-dd` format)
 * that have quota entries for the fund. Returns an empty
 * array when the fund has no quotas.
 *
 * @explanation
 * Use this use case to get available dates for a fund when
 * populating a date picker for applications or withdrawals.
 *
 * @example
 * const DATES = await LIST_QUOTA_DATES_USE_CASE.execute(
 *   "fund-1"
 * );
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
export interface ListQuotaDatesInput {
  fundId: string
}

export class ListQuotaDatesUseCase {
  constructor(private quotaRepository: IQuota) {}

  /**
   * @summary
   * Retrieves all quota dates for the provided fund.
   *
   * @remarks
   * Returns an array of dates (as strings in `yyyy-MM-dd` format)
   * that have quota entries for the fund. Returns an empty
   * array when the fund has no quotas.
   *
   * @explanation
   * Use this method to get available dates for a fund when
   * populating a date picker for applications or withdrawals.
   *
   * @param fundId - The unique identifier of the fund.
   *
   * @returns Array of date strings in `yyyy-MM-dd` format.
   *
   * @example
   * const DATES = await LIST_QUOTA_DATES_USE_CASE.execute(
   *   "fund-1"
   * );
   *
   * @author Moisés Reis
   *
   * @date 2026-09-27
   */
  async execute(fundId: string): Promise<string[]> {
    const ID = EntityId.create(fundId)
    return this.quotaRepository.findAllDatesByFundId(ID)
  }
}
