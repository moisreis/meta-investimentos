import { IBankAccount } from "@domain/bank-account/interfaces/bank-account.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"

export interface DeleteBankAccountInput {
  bankAccountId: string
}

/**
 * @summary
 * Deletes an existing `BankAccount`.
 *
 * @remarks
 * Fetches the bank account and removes it when it
 * exists. Throws **NotFoundError** when no bank account
 * matches the provided id.
 *
 * @explanation
 * Use this use case to remove a bank account through
 * the service layer.
 *
 * @example
 * await DELETE_BANK_ACCOUNT_USE_CASE.execute({
 *   bankAccountId: "bank-account-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class DeleteBankAccountUseCase {
  constructor(private bankAccountRepository: IBankAccount) {}

  /**
   * @summary
   * Deletes the bank account with the provided id.
   *
   * @remarks
   * Fetches the bank account and removes it when it
   * exists. Throws **NotFoundError** when no bank account
   * matches the provided id.
   *
   * @explanation
   * Use this method to remove a bank account through
   * the service layer.
   *
   * @param input - Payload with the target bank account
   *                id.
   *
   * @returns Resolves when removed.
   *
   * @example
   * await DELETE_BANK_ACCOUNT_USE_CASE.execute({
   *   bankAccountId: "bank-account-1",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(input: DeleteBankAccountInput): Promise<void> {
    const ID = EntityId.create(input.bankAccountId)
    const BANK_ACCOUNT =
      await this.bankAccountRepository.findById(ID)
    if (!BANK_ACCOUNT) {
      throw new NotFoundError("`BankAccount` not found.")
    }
    await this.bankAccountRepository.delete(ID)
  }
}
