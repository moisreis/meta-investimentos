import { ICheckingAccount } from "@domain/checking-account/interfaces/checking-account.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId, SignedMoney } from "@/value-objects"
import type { CheckingAccountResponseDTO } from "../dto/checking-account-response.dto"
import { toResponseDTO } from "../mappers/checking-account.mapper"

export interface UpdateCheckingAccountInput {
  checkingAccountId: string
  value: string
}

/**
 * @summary
 * Updates the value of an existing `CheckingAccount`.
 *
 * @remarks
 * Fetches the entry, applies `updateValue` with the
 * provided amount and persists the updated entity.
 *
 * @explanation
 * Use this use case to correct the daily balance of an
 * existing checking account entry through the service
 * layer. The bank account and the date stay untouched.
 *
 * @example
 * const ENTRY = await UPDATE_CHECKING_ACCOUNT_USE_CASE
 *   .execute({
 *     checkingAccountId: "checking-account-1",
 *     value: "-1234.56",
 *   });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export class UpdateCheckingAccountUseCase {
  constructor(
    private checkingAccountRepository: ICheckingAccount
  ) {}

  /**
   * @summary
   * Updates and persists a checking account value.
   *
   * @remarks
   * Fetches the entry, applies `updateValue` with the
   * provided amount and persists the updated entity.
   *
   * @explanation
   * Use this method to correct the daily balance of an
   * existing checking account entry. The bank account
   * and the date stay untouched.
   *
   * @param input - Payload with the target id and value.
   *
   * @returns The updated entry.
   *
   * @example
   * const ENTRY = await UPDATE_CHECKING_ACCOUNT_USE_CASE
   *   .execute({
   *     checkingAccountId: "checking-account-1",
   *     value: "-1234.56",
   *   });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async execute(
    input: UpdateCheckingAccountInput
  ): Promise<CheckingAccountResponseDTO> {
    const ID = EntityId.create(input.checkingAccountId)
    const ENTRY =
      await this.checkingAccountRepository.findById(ID)

    if (!ENTRY) {
      throw new NotFoundError("`CheckingAccount` not found.")
    }

    const UPDATED = ENTRY.updateValue(
      SignedMoney.create(input.value)
    )
    const SAVED =
      await this.checkingAccountRepository.save(UPDATED)
    return toResponseDTO(SAVED)
  }
}
