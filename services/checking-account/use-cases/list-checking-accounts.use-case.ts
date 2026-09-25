import { ICheckingAccount } from "@domain/checking-account/interfaces/checking-account.interface"
import type { CheckingAccountResponseDTO } from "../dto/checking-account-response.dto"
import { toResponseDTO } from "../mappers/checking-account.mapper"

export interface ListCheckingAccountsInput {
  limit?: number
  offset?: number
}

/**
 * @summary
 * Lists all registered `CheckingAccount` entries.
 *
 * @remarks
 * Supports optional pagination through limit and
 * offset.
 *
 * @explanation
 * Use this use case to list checking account balances
 * through the service layer.
 *
 * @example
 * const ENTRIES = await LIST_CHECKING_ACCOUNTS_USE_CASE
 *   .execute({});
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export class ListCheckingAccountsUseCase {
  constructor(
    private checkingAccountRepository: ICheckingAccount
  ) {}

  /**
   * @summary
   * Fetches all checking account entries, optionally
   * paginated.
   *
   * @remarks
   * Supports optional pagination through limit and
   * offset.
   *
   * @explanation
   * Use this method to list checking account balances
   * through the service layer.
   *
   * @param input - Pagination options.
   *
   * @returns The matching entries.
   *
   * @example
   * const ENTRIES = await LIST_CHECKING_ACCOUNTS_USE_CASE
   *   .execute({});
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async execute(
    input: ListCheckingAccountsInput
  ): Promise<CheckingAccountResponseDTO[]> {
    const ENTRIES = await this.checkingAccountRepository.findAll(
      {
        limit: input.limit,
        offset: input.offset,
      }
    )
    return ENTRIES.map(toResponseDTO)
  }
}
