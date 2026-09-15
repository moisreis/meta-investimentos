/**
 * @summary
 * Defines the payload for updating a `BankAccount`.
 *
 * @remarks
 * Only the provided fields are changed.
 *
 * @explanation
 * Use this DTO to edit the agency or account number of
 * an existing bank account.
 *
 * @example
 * const DTO: UpdateBankAccountDTO = {
 *   accountNumber: "56789-1",
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface UpdateBankAccountDTO {
  agency?: string
  accountNumber?: string
}
