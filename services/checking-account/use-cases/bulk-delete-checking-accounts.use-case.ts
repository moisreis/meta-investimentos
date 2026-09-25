import { ICheckingAccount } from "@domain/checking-account/interfaces/checking-account.interface"
import { EntityId } from "@/value-objects"

export interface BulkDeleteCheckingAccountsInput {
  checkingAccountIds: string[]
}

/**
 * @summary
 * Deletes multiple `CheckingAccount` records.
 *
 * @remarks
 * Hydrates the entries by their ids and removes the
 * rows that still exist. Missing entries are silently
 * skipped.
 *
 * @explanation
 * Use this use case to remove many checking account
 * balances through the service layer.
 *
 * @example
 * await BULK_DELETE_CHECKING_ACCOUNTS_USE_CASE.execute({
 *   checkingAccountIds: ["checking-account-1", "checking-account-2"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export class BulkDeleteCheckingAccountsUseCase {
  constructor(
    private checkingAccountRepository: ICheckingAccount
  ) {}

  /**
   * @summary
   * Removes the entries with the provided ids.
   *
   * @remarks
   * Hydrates the entries by their ids and removes the
   * rows that still exist. Missing entries are silently
   * skipped.
   *
   * @explanation
   * Use this method to delete many checking account
   * balances in one operation.
   *
   * @param input - Payload with the target entry ids.
   *
   * @returns Resolves when the remaining rows are
   *          removed.
   *
   * @example
   * await BULK_DELETE_CHECKING_ACCOUNTS_USE_CASE.execute({
   *   checkingAccountIds: ["checking-account-1", "checking-account-2"],
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async execute(
    input: BulkDeleteCheckingAccountsInput
  ): Promise<void> {
    if (input.checkingAccountIds.length === 0) {
      return
    }

    const IDS = input.checkingAccountIds.map((id) =>
      EntityId.create(id)
    )
    const ENTRIES =
      await this.checkingAccountRepository.findAllByIds(IDS)

    const FOUND_IDS = ENTRIES.map((entry) => entry.id).filter(
      (id): id is EntityId => Boolean(id)
    )

    if (FOUND_IDS.length === 0) {
      return
    }

    await this.checkingAccountRepository.deleteByIds(FOUND_IDS)
  }
}
