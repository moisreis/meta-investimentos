import { IBankAccount } from "@domain/bank-account/interfaces/bank-account.interface"
import type { BankAccountResponseDTO } from "../dto/bank-account-response.dto"
import { toResponseDTO } from "../mappers/bank-account.mapper"

export interface ListBankAccountsInput {
  limit?: number
  offset?: number
}

/**
 * @summary
 * Lists all registered `BankAccount` entries.
 *
 * @remarks
 * Supports optional pagination through limit and
 * offset.
 *
 * @explanation
 * Use this use case to list bank accounts through the
 * service layer.
 *
 * @example
 * const ACCOUNTS = await LIST_BANK_ACCOUNTS_USE_CASE
 *   .execute({});
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export class ListBankAccountsUseCase {
  constructor(private bankAccountRepository: IBankAccount) {}

  /**
   * @summary
   * Fetches all bank accounts, optionally paginated.
   *
   * @remarks
   * Supports optional pagination through limit and
   * offset.
   *
   * @explanation
   * Use this method to list bank accounts through the
   * service layer.
   *
   * @param input - Pagination options.
   *
   * @returns The matching entries.
   *
   * @example
   * const ACCOUNTS = await LIST_BANK_ACCOUNTS_USE_CASE
   *   .execute({});
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async execute(
    input: ListBankAccountsInput
  ): Promise<BankAccountResponseDTO[]> {
    const ACCOUNTS = await this.bankAccountRepository.findAll({
      limit: input.limit,
      offset: input.offset,
    })
    return ACCOUNTS.map(toResponseDTO)
  }
}
