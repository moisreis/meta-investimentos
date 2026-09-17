/**
 * @summary
 * Defines the payload for reversing an `Application`.
 *
 * @remarks
 * Records the user who performed the reversal as a
 * string id.
 *
 * @explanation
 * Use this DTO to reverse an application through the
 * service layer.
 *
 * @example
 * const DTO: ReverseApplicationDTO = {
 *   reversedByUserId: "user-1",
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface ReverseApplicationDTO {
  reversedByUserId: string
}
