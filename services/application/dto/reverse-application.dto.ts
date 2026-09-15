import type { EntityId } from "@/value-objects"

/**
 * @summary
 * Defines the payload for reversing an `Application`.
 *
 * @remarks
 * Records the user who performed the reversal.
 *
 * @explanation
 * Use this DTO to reverse an application through the
 * service layer.
 *
 * @example
 * const DTO: ReverseApplicationDTO = {
 *   reversedByUserId: EntityId.create("user-1"),
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface ReverseApplicationDTO {
  reversedByUserId: EntityId
}
