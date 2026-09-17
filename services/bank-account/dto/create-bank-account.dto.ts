/**
 * @summary
 * Defines the payload for creating a `BankAccount`.
 *
 * @remarks
 * Agency and account number identify the cash account.
 * Portfolio and bank ids are strings; value objects
 * are built in the service mapper.
 *
 * @explanation
 * Use this DTO to create a bank account through the
 * service layer.
 *
 * @example
 * const DTO: CreateBankAccountDTO = {
 *   portfolioId: "portfolio-1",
 *   bankId: "bank-1",
 *   agency: "1234",
 *   accountNumber: "56789-0",
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface CreateBankAccountDTO {
  portfolioId: string
  bankId: string
  agency: string
  accountNumber: string
}
