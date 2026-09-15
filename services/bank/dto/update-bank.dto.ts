/**
 * @summary
 * Defines the payload for updating a `Bank`.
 *
 * @remarks
 * Only the provided fields are changed.
 *
 * @explanation
 * Use this DTO to change the code or name of an
 * existing bank.
 *
 * @example
 * const DTO: UpdateBankDTO = {
 *   name: "Banco do Brasil S.A.",
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface UpdateBankDTO {
  code?: string
  name?: string
}
