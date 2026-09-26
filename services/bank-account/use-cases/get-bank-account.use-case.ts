import { IBankAccount } from "@domain/bank-account/interfaces/bank-account.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"
import type { BankAccountResponseDTO } from "../dto/bank-account-response.dto"
import { toResponseDTO } from "../mappers/bank-account.mapper"

export interface GetBankAccountInput {
  bankAccountId: string
}

/**
 * @summary
 * Retrieves an existing `BankAccount` by its id.
 *
 * @remarks
 * Throws **NotFoundError** when no bank account matches
 * the provided id.
 *
 * @explanation
 * Use this use case to fetch a single bank account
 * through the service layer.
 *
 * @example
 * const BANK_ACCOUNT = await GET_BANK_ACCOUNT_USE_CASE.execute({
 *   bankAccountId: "bank-account-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class GetBankAccountUseCase {
  constructor(private bankAccountRepository: IBankAccount) {}

  /**
   * @summary
   * Fetches the bank account with the provided id.
   *
   * @remarks
   * Throws **NotFoundError** when no bank account matches
   * the provided id.
   *
   * @explanation
   * Use this method to fetch a single bank account
   * through the service layer.
   *
   * @param input - Payload with the target bank account
   *                id.
   *
   * @returns The matched bank account.
   *
   * @example
   * const BANK_ACCOUNT = await GET_BANK_ACCOUNT_USE_CASE
   *   .execute({
   *     bankAccountId: "bank-account-1",
   *   });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(
    input: GetBankAccountInput
  ): Promise<BankAccountResponseDTO> {
    const ID = EntityId.create(input.bankAccountId)
    const BANK_ACCOUNT =
      await this.bankAccountRepository.findById(ID)
    if (!BANK_ACCOUNT) {
      throw new NotFoundError("`BankAccount` not found.")
    }
    return toResponseDTO(BANK_ACCOUNT)
  }
}
