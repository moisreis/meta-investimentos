import type { EntityId } from "@/value-objects"

/**
 * @summary
 * Represents the shape of the bank response.
 *
 * @remarks
 * This DTO is the format of the response for bank
 * queries and mutations.
 *
 * @explanation
 * Use this DTO when exposing a bank to the consumers
 * of the service layer.
 *
 * @example
 * const RESPONSE = TO_RESPONSE_DTO(BANK_ENTITY);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface BankResponseDTO {
  id: EntityId
  code: string
  name: string
  createdAt: Date
  updatedAt: Date
}
