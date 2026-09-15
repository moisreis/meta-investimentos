import type { EntityId, SignedMoney } from "@/value-objects"

/**
 * @summary
 * Represents the shape of the checking account response.
 *
 * @remarks
 * This DTO is the format of the response for checking
 * account queries and mutations.
 *
 * @explanation
 * Use this DTO when exposing a checking account entry
 * to the consumers of the service layer.
 *
 * @example
 * const RESPONSE = TO_RESPONSE_DTO(CHECKING_ACCOUNT_ENTITY);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface CheckingAccountResponseDTO {
  id: EntityId
  bankAccountId: EntityId
  date: Date
  value: SignedMoney
}
