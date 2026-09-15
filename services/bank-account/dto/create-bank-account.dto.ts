import type { EntityId } from "@/value-objects"

/**
 * @summary
 * Defines the payload for creating a `BankAccount`.
 *
 * @remarks
 * Agency and account number identify the cash account.
 *
 * @explanation
 * Use this DTO to create a bank account through the
 * service layer.
 *
 * @example
 * const DTO: CreateBankAccountDTO = {
 *   portfolioId: EntityId.create("portfolio-1"),
 *   bankId: EntityId.create("bank-1"),
 *   agency: "1234",
 *   accountNumber: "56789-0",
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface CreateBankAccountDTO {
  portfolioId: EntityId
  bankId: EntityId
  agency: string
  accountNumber: string
}
