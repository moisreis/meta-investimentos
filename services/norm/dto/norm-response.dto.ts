/**
 * @summary
 * Represents the shape of the norm response.
 *
 * @remarks
 * This DTO is the format of the response for norm
 * queries and mutations.
 *
 * @explanation
 * Use this DTO when exposing a norm to the consumers
 * of the service layer.
 *
 * @example
 * const RESPONSE = TO_RESPONSE_DTO(NORM_ENTITY);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface NormResponseDTO {
  id: string
  articleNumber: string
  name: string
  categoryId: string
  minAllocation: string
  maxAllocation: string
  targetAllocation: string
  createdAt: string
  updatedAt: string
}
