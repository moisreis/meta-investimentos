/**
 * @summary
 * Represents the shape of the quota response.
 *
 * @remarks
 * This DTO is the format of the response for quota
 * queries. All ids are strings, dates are ISO 8601
 * strings, and the price is a decimal string.
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
  id: string
  fundId: string
  date: string
  price: string
  createdAt: string
}
