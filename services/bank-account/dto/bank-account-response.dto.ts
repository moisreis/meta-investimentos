/**
 * @summary
 * Represents the shape of the bank account response.
 *
 * @remarks
 * This DTO is the format of the response for bank
 * account queries and mutations. All ids are strings
 * and timestamps are ISO 8601 strings.
 *
 * @explanation
 * Use this DTO when exposing a bank account to the
 * consumers of the service layer.
 *
 * @example
 * const RESPONSE = TO_RESPONSE_DTO(BANK_ACCOUNT_ENTITY);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface BankAccountResponseDTO {
  id: string
  portfolioId: string
  bankId: string
  agency: string
  accountNumber: string
  createdAt: string
  updatedAt: string
}
