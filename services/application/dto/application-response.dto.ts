import type { EntityId, PositiveMoney, QuotaQuantity } from "@/value-objects"

/**
 * @summary
 * Represents the shape of the application response.
 *
 * @remarks
 * This DTO is the format of the response for application
 * queries and mutations.
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
  id: EntityId
  positionId: EntityId
  date: Date
  amount: PositiveMoney
  quotas: QuotaQuantity
  // Null while the application has not been reversed.
  reversedAt: Date | null
  reversedByUserId: EntityId | null
  createdAt: Date
  updatedAt: Date
}
