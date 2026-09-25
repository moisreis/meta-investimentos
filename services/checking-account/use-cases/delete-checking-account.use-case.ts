import { ICheckingAccount } from "@domain/checking-account/interfaces/checking-account.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"

export interface DeleteCheckingAccountInput {
  checkingAccountId: string
}

/**
 * @summary
 * Deletes an existing `CheckingAccount` entry.
 *
 * @remarks
 * Fetches the entry and removes it when it exists.
 * Throws **NotFoundError** when no entry matches the
 * provided id.
 *
 * @explanation
 * Use this use case to remove a checking account
 * balance through the service layer.
 *
 * @example
 * await DELETE_CHECKING_ACCOUNT_USE_CASE.execute({
 *   checkingAccountId: "checking-account-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export class DeleteCheckingAccountUseCase {
  constructor(
    private checkingAccountRepository: ICheckingAccount
  ) {}

  /**
   * @summary
   * Deletes the entry with the provided id.
   *
   * @remarks
   * Fetches the entry and removes it when it exists.
   * Throws **NotFoundError** when no entry matches the
   * provided id.
   *
   * @explanation
   * Use this method to remove a checking account
   * balance through the service layer.
   *
   * @param input - Payload with the target entry id.
   *
   * @returns Resolves when removed.
   *
   * @example
   * await DELETE_CHECKING_ACCOUNT_USE_CASE.execute({
   *   checkingAccountId: "checking-account-1",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async execute(
    input: DeleteCheckingAccountInput
  ): Promise<void> {
    const ID = EntityId.create(input.checkingAccountId)
    const ENTRY =
      await this.checkingAccountRepository.findById(ID)

    if (!ENTRY) {
      throw new NotFoundError("`CheckingAccount` not found.")
    }

    await this.checkingAccountRepository.delete(ID)
  }
}
