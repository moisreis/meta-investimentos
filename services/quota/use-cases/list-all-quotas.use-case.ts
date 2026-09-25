import { IQuota } from "@domain/quota/interfaces/quota.interface"
import { EntityId } from "@/value-objects"
import type { QuotaResponseDTO } from "../dto/quota-response.dto"
import { toResponseDTO } from "../mappers/quota.mapper"

export interface ListAllQuotasInput {
  fundIds: string[]
}

/**
 * @summary
 * Lists all `Quota` entries across the provided funds.
 *
 * @remarks
 * Maps the fund ids into entity ids, short-circuits when
 * no fund is provided, and delegates the query to the
 * quota repository bulk lookup by fund ids.
 *
 * @explanation
 * Use this use case to feed the quota registry screen,
 * where rows come from many funds instead of a single
 * one.
 *
 * @example
 * const QUOTAS = await LIST_ALL_QUOTAS_USE_CASE.execute({
 *   fundIds: ["fund-1", "fund-2"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export class ListAllQuotasUseCase {
  constructor(private quotaRepository: IQuota) {}

  /**
   * @summary
   * Fetches all quotas of the provided funds.
   *
   * @remarks
   * Returns an empty array when the fund id list is
   * empty.
   *
   * @explanation
   * Use this method to list the quotas of many funds
   * through the service layer.
   *
   * @param input - Payload with the target fund ids.
   *
   * @returns The matching quotas.
   *
   * @example
   * const QUOTAS = await LIST_ALL_QUOTAS_USE_CASE.execute({
   *   fundIds: ["fund-1"],
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async execute(
    input: ListAllQuotasInput
  ): Promise<QuotaResponseDTO[]> {
    if (input.fundIds.length === 0) return []

    const FUND_IDS = input.fundIds.map((fundId) =>
      EntityId.create(fundId)
    )

    const QUOTAS =
      await this.quotaRepository.findAllByFundIds(FUND_IDS)

    return QUOTAS.map(toResponseDTO)
  }
}
