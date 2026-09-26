import { IQuota } from "@domain/quota/interfaces/quota.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"
import type { QuotaResponseDTO } from "../dto/quota-response.dto"
import { toResponseDTO } from "../mappers/quota.mapper"

export interface GetQuotaInput {
  quotaId: string
}

/**
 * @summary
 * Retrieves an existing `Quota` by its id.
 *
 * @remarks
 * Throws **NotFoundError** when no quota matches the
 * provided id.
 *
 * @explanation
 * Use this use case to fetch a single quota through
 * the service layer.
 *
 * @example
 * const QUOTA = await GET_QUOTA_USE_CASE.execute({
 *   quotaId: "quota-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class GetQuotaUseCase {
  constructor(private quotaRepository: IQuota) {}

  /**
   * @summary
   * Fetches the quota with the provided id.
   *
   * @remarks
   * Throws **NotFoundError** when no quota matches the
   * provided id.
   *
   * @explanation
   * Use this method to fetch a single quota through
   * the service layer.
   *
   * @param input - Payload with the target quota id.
   *
   * @returns The matching quota.
   *
   * @example
   * const QUOTA = await GET_QUOTA_USE_CASE.execute({
   *   quotaId: "quota-1",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(
    input: GetQuotaInput
  ): Promise<QuotaResponseDTO> {
    const ID = EntityId.create(input.quotaId)
    const QUOTA = await this.quotaRepository.findById(ID)
    if (!QUOTA) {
      throw new NotFoundError("`Quota` not found.")
    }
    return toResponseDTO(QUOTA)
  }
}
