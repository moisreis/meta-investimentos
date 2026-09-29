import { ICheckingAccount } from "@domain/checking-account/interfaces/checking-account.interface"
import { EntityId } from "@/value-objects"
import type { CheckingAccountResponseDTO } from "../dto/checking-account-response.dto"
import { toResponseDTO } from "../mappers/checking-account.mapper"

export interface ListCheckingAccountsByBankAccountsInput {
  // The bank accounts whose balance series are loaded.
  bankAccountIds: string[]
}

/**
 * @summary
 * Lists the `CheckingAccount` balances of many bank
 * accounts.
 *
 * @remarks
 * Batches the entries of the provided bank account ids in a
 * single query, so a portfolio detail screen can hydrate the
 * daily balance series of every account it owns without an
 * N+1 pattern. An empty id list resolves to an empty list.
 *
 * @explanation
 * Use this use case to load the balance series of the bank
 * accounts of a portfolio through the service layer. The
 * entries are the raw daily snapshots, so the caller decides
 * which window to clamp them to.
 *
 * @example
 * const ENTRIES = await LIST_CHECKING_BY_ACCOUNTS_USE_CASE
 *   .execute({
 *     bankAccountIds: ["bank-account-1"],
 *   });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export class ListCheckingAccountsByBankAccountsUseCase {
  constructor(
    private checkingAccountRepository: ICheckingAccount
  ) {}

  /**
   * @summary
   * Fetches the balance entries of the provided bank
   * accounts.
   *
   * @remarks
   * Delegates the batched lookup to the repository and maps
   * every entry to the response DTO.
   *
   * @param input - Payload with the target bank account ids.
   *
   * @returns The matching balance entries.
   *
   * @example
   * const ENTRIES = await LIST_CHECKING_BY_ACCOUNTS_USE_CASE
   *   .execute({
   *     bankAccountIds: ["bank-account-1"],
   *   });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-28
   */
  async execute(
    input: ListCheckingAccountsByBankAccountsInput
  ): Promise<CheckingAccountResponseDTO[]> {
    const ENTRIES =
      await this.checkingAccountRepository.findAllByBankAccountIds(
        input.bankAccountIds.map((id) => EntityId.create(id))
      )

    return ENTRIES.map(toResponseDTO)
  }
}