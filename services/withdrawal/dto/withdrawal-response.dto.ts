/**
 * @summary
 * Represents the shape of the withdrawal response.
 *
 * @remarks
 * This DTO is the format of the response for withdrawal
 * queries and mutations. All ids are strings, dates are
 * ISO 8601 strings, and amounts are decimal strings.
 *
 * @explanation
 * Use this DTO when exposing a withdrawal to the
 * consumers of the service layer.
 *
 * @example
 * const RESPONSE = TO_RESPONSE_DTO(WITHDRAWAL_ENTITY);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface WithdrawalResponseDTO {
  id: string
  positionId: string
  date: string
  amount: string
  quotas: string
  // Null while the withdrawal has not been reversed.
  reversedAt: string | null
  reversedByUserId: string | null
  createdAt: string
  updatedAt: string
}
