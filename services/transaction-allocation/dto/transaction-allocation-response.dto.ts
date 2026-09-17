/**
 * @summary
 * Represents the shape of the allocation response.
 *
 * @remarks
 * This DTO is the format of the response for allocation
 * queries and mutations. All ids are strings, the date
 * is ISO 8601, and consumed quotas are a decimal string.
 *
 * @explanation
 * Use this DTO when exposing a transaction allocation to
 * the consumers of the service layer.
 *
 * @example
 * const RESPONSE = TO_RESPONSE_DTO(ALLOCATION_ENTITY);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface TransactionAllocationResponseDTO {
  id: string
  applicationId: string
  withdrawId: string
  quotasConsumed: string
  createdAt: string
}
