import { IQuota } from "@domain/quota/interfaces/quota.interface"
import { EntityId } from "@/value-objects"
import type { QuotaResponseDTO } from "../dto/quota-response.dto"
import { toResponseDTO } from "../mappers/quota.mapper"

export interface ListQuotasInput {
  fundId: string
}

/**
 * @summary
 * Lists all `Quota` entries of a fund.
 *
 * @remarks
 * Uses the fund id to scope the quota query.
 *
 * @explanation
 * Use this use case to list the quotas of a given fund
 * through the service layer.
 *
 * @example
 * const QUOTAS = await LIST_QUOTAS_USE_CASE.execute({
 *   fundId: "fund-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class ListQuotasUseCase {
  constructor(private quotaRepository: IQuota) {}

  /**
   * @summary
   * Fetches all quotas of the provided fund.
   *
   * @remarks
   * Uses the fund id to scope the quota query.
   *
   * @explanation
   * Use this method to list the quotas of a given fund
   * through the service layer.
   *
   * @param input - Payload with the target fund id.
   *
   * @returns The matching quotas.
   *
   * @example
   * const QUOTAS = await LIST_QUOTAS_USE_CASE.execute({
   *   fundId: "fund-1",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(
    input: ListQuotasInput
  ): Promise<QuotaResponseDTO[]> {
    const FUND_ID = EntityId.create(input.fundId)
    const QUOTAS =
      await this.quotaRepository.findAllByFundId(FUND_ID)
    return QUOTAS.map(toResponseDTO)
  }
}
