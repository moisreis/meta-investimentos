import type { EntityId, QuotaPrice } from "@/value-objects"

/**
 * @summary
 * Represents the shape of the quota response.
 *
 * @remarks
 * This DTO is the format of the response for quota
 * queries.
 *
 * @explanation
 * Use this DTO when exposing a quota to the consumers
 * of the service layer.
 *
 * @example
 * const RESPONSE = TO_RESPONSE_DTO(QUOTA_ENTITY);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface QuotaResponseDTO {
  id: EntityId
  fundId: EntityId
  date: Date
  price: QuotaPrice
  createdAt: Date
}
