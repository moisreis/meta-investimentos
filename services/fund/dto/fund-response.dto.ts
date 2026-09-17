/**
 * @summary
 * Represents the shape of the fund response.
 *
 * @remarks
 * This DTO is the format of the response for fund
 * queries and mutations. Cnpj, ids, and fees are
 * strings; timestamps are ISO 8601 strings.
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
  id: string
  cnpj: string
  name: string
  // Null when no administration fee is set.
  administrationFee: string | null
  // Null when no performance fee is set.
  performanceFee: string | null
  bankId: string
  // Null when no benchmark is linked.
  benchmarkId: string | null
  // Null when no category is linked.
  categoryId: string | null
  createdAt: string
  updatedAt: string
}
