import type { EntityId } from "@/value-objects"

/**
 * @summary
 * Defines the payload for reversing a `Withdrawal`.
 *
 * @remarks
 * Records the user who performed the reversal.
 *
 * @explanation
 * Use this DTO to reverse a withdrawal through the
 * service layer.
 *
 * @example
 * const DTO: ReverseWithdrawalDTO = {
 *   reversedByUserId: EntityId.create("user-1"),
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface ReverseWithdrawalDTO {
  reversedByUserId: EntityId
}
