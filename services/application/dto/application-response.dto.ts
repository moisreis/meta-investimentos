/**
 * @summary
 * Represents the shape of the application response.
 *
 * @remarks
 * This DTO is the format of the response for application
 * queries and mutations. All ids are strings, dates are
 * ISO 8601 strings, and amounts are decimal strings.
 *
 * @explanation
 * Use this DTO when exposing an application to the
 * consumers of the service layer.
 *
 * @example
 * const RESPONSE = TO_RESPONSE_DTO(APPLICATION_ENTITY);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface ApplicationResponseDTO {
  id: string
  positionId: string
  date: string
  amount: string
  quotas: string
  // Null while the application has not been reversed.
  reversedAt: string | null
  reversedByUserId: string | null
  createdAt: string
  updatedAt: string
}
