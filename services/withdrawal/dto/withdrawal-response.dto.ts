import type { EntityId, PositiveMoney, QuotaQuantity } from "@/value-objects"

/**
 * @summary
 * Represents the shape of the withdrawal response.
 *
 * @remarks
 * This DTO is the format of the response for withdrawal
 * queries and mutations.
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
  id: EntityId
  positionId: EntityId
  date: Date
  amount: PositiveMoney
  quotas: QuotaQuantity
  // Null while the withdrawal has not been reversed.
  reversedAt: Date | null
  reversedByUserId: EntityId | null
  createdAt: Date
  updatedAt: Date
}
