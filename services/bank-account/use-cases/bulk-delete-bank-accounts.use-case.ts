import { IBankAccount } from "@domain/bank-account/interfaces/bank-account.interface"
import { EntityId } from "@/value-objects"

export interface BulkDeleteBankAccountsInput {
  bankAccountIds: string[]
}

/**
 * @summary
 * Deletes multiple `BankAccount` records.
 *
 * @remarks
 * Hydrates each bank account by its id and removes the
 * rows that still exist. Missing bank accounts are
 * silently skipped.
 *
 * @explanation
 * Use this use case to remove many bank accounts through
 * the service layer.
 *
 * @example
 * await BULK_DELETE_BANK_ACCOUNTS_USE_CASE.execute({
 *   bankAccountIds: ["bank-account-1", "bank-account-2"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export class BulkDeleteBankAccountsUseCase {
  constructor(private bankAccountRepository: IBankAccount) {}

  /**
   * @summary
   * Removes the bank accounts with the provided ids.
   *
   * @remarks
   * Hydrates each bank account by its id and removes the
   * rows that still exist. Missing bank accounts are
   * silently skipped.
   *
   * @explanation
   * Use this method to delete many bank accounts in one
   * operation.
   *
   * @param input - Payload with the target bank account
   *                ids.
   *
   * @returns Resolves when the remaining rows are removed.
   *
   * @example
   * await BULK_DELETE_BANK_ACCOUNTS_USE_CASE.execute({
   *   bankAccountIds: ["bank-account-1", "bank-account-2"],
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async execute(
    input: BulkDeleteBankAccountsInput
  ): Promise<void> {
    if (input.bankAccountIds.length === 0) {
      return
    }

    const IDS = input.bankAccountIds.map((id) =>
      EntityId.create(id)
    )

    for (const ID of IDS) {
      const EXISTING =
        await this.bankAccountRepository.findById(ID)
      if (!EXISTING) continue

      await this.bankAccountRepository.delete(ID)
    }
  }
}
