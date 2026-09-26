import { BankAccount } from "@domain/bank-account/entities/bank-account.entity"
import { IBankAccount } from "@domain/bank-account/interfaces/bank-account.interface"
import type { BankAccountResponseDTO } from "../dto/bank-account-response.dto"
import {
  toCreateBankAccountProps,
  toResponseDTO,
} from "../mappers/bank-account.mapper"

export interface CreateBankAccountInput {
  portfolioId: string
  bankId: string
  agency: string
  accountNumber: string
}

/**
 * @summary
 * Creates a new `BankAccount` and persists it.
 *
 * @remarks
 * Builds entity props through the create mapper and
 * saves the bank account with the bank account
 * repository.
 *
 * @explanation
 * Use this use case to register a new bank account
 * through the service layer.
 *
 * @example
 * const BANK_ACCOUNT = await CREATE_BANK_ACCOUNT_USE_CASE
 *   .execute({
 *     portfolioId: "portfolio-1",
 *     bankId: "bank-1",
 *     agency: "0001",
 *     accountNumber: "12345-6",
 *   });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class CreateBankAccountUseCase {
  constructor(private bankAccountRepository: IBankAccount) {}

  /**
   * @summary
   * Creates and persists a new bank account.
   *
   * @remarks
   * Builds entity props through the create mapper and
   * saves the bank account with the bank account
   * repository.
   *
   * @explanation
   * Use this method to register a new bank account
   * through the service layer.
   *
   * @param input - The bank account creation payload.
   *
   * @returns The saved bank account.
   *
   * @example
   * const BANK_ACCOUNT = await CREATE_BANK_ACCOUNT_USE_CASE
   *   .execute({
   *     portfolioId: "portfolio-1",
   *     bankId: "bank-1",
   *     agency: "0001",
   *     accountNumber: "12345-6",
   *   });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(
    input: CreateBankAccountInput
  ): Promise<BankAccountResponseDTO> {
    const PROPS = toCreateBankAccountProps(input)
    const BANK_ACCOUNT = BankAccount.create(PROPS)
    const SAVED =
      await this.bankAccountRepository.save(BANK_ACCOUNT)
    return toResponseDTO(SAVED)
  }
}
