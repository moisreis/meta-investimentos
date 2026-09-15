import type { EntityId, CNPJ, SignedPercentage } from "@/value-objects"

/**
 * @summary
 * Represents the shape of the fund response.
 *
 * @remarks
 * This DTO is the format of the response for fund
 * queries and mutations.
 *
 * @explanation
 * Use this DTO when exposing a fund to the consumers
 * of the service layer.
 *
 * @example
 * const RESPONSE = TO_RESPONSE_DTO(FUND_ENTITY);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface FundResponseDTO {
  id: EntityId
  cnpj: CNPJ
  name: string
  // Null when no administration fee is set.
  administrationFee: SignedPercentage | null
  // Null when no performance fee is set.
  performanceFee: SignedPercentage | null
  bankId: EntityId
  // Null when no benchmark is linked.
  benchmarkId: EntityId | null
  // Null when no category is linked.
  categoryId: EntityId | null
  createdAt: Date
  updatedAt: Date
}
