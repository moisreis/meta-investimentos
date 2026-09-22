import { ICheckingAccount } from "@domain/checking-account/interfaces/checking-account.interface"
import { EntityId } from "@/value-objects"
import type { CheckingAccountResponseDTO } from "../dto/checking-account-response.dto"
import { toResponseDTO } from "../mappers/checking-account.mapper"

export interface ListCheckingAccountHistoryInput {
  bankAccountId: string
}

/**
 * @summary
 * Lists the `CheckingAccount` history of a bank
 * account.
 *
 * @remarks
 * Uses the bank account id to scope the entry query.
 *
 * @explanation
 * Use this use case to list the entries of a given
 * bank account through the service layer.
 *
 * @example
 * const ENTRIES = await LIST_CHECKING_ACCOUNT_HISTORY_USE_CASE
 *   .execute({
 *     bankAccountId: "bank-account-1",
 *   });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class ListCheckingAccountHistoryUseCase {
  constructor(private checkingAccountRepository: ICheckingAccount) {}

  /**
   * @summary
   * Fetches all entries of the provided bank account.
   *
   * @remarks
   * Uses the bank account id to scope the entry query.
   *
   * @explanation
   * Use this method to list the entries of a given
   * bank account through the service layer.
   *
   * @param input - Payload with the target bank account
   *                id.
   *
   * @returns The matching entries.
   *
   * @example
   * const ENTRIES = await LIST_CHECKING_ACCOUNT_HISTORY_USE_CASE
   *   .execute({
   *     bankAccountId: "bank-account-1",
   *   });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(
    input: ListCheckingAccountHistoryInput
  ): Promise<CheckingAccountResponseDTO[]> {
    const BANK_ACCOUNT_ID = EntityId.create(input.bankAccountId)
    const ENTRIES =
      await this.checkingAccountRepository.findAllByBankAccountId(
        BANK_ACCOUNT_ID
      )
    return ENTRIES.map(toResponseDTO)
  }
}
