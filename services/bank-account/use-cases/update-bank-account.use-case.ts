import { IBankAccount } from "@domain/bank-account/interfaces/bank-account.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"
import type { BankAccountResponseDTO } from "../dto/bank-account-response.dto"
import { toResponseDTO } from "../mappers/bank-account.mapper"

export interface UpdateBankAccountInput {
  bankAccountId: string
  agency?: string
  accountNumber?: string
}

/**
 * @summary
 * Updates an existing `BankAccount`.
 *
 * @remarks
 * Fetches the bank account, applies `update` with the
 * provided fields, and persists the updated entity.
 *
 * @explanation
 * Use this use case to edit the editable fields of an
 * existing bank account through the service layer.
 *
 * @example
 * const BANK_ACCOUNT = await UPDATE_BANK_ACCOUNT_USE_CASE.execute({
 *   bankAccountId: "bank-account-1",
 *   accountNumber: "54321-6",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class UpdateBankAccountUseCase {
  constructor(private bankAccountRepository: IBankAccount) {}

  /**
   * @summary
   * Updates and persists a bank account.
   *
   * @param input - Payload with the target bank account
   *                id and field updates.
   * @returns The updated bank account response.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(input: UpdateBankAccountInput): Promise<BankAccountResponseDTO> {
    const ID = EntityId.create(input.bankAccountId)
    const BANK_ACCOUNT = await this.bankAccountRepository.findById(ID)
    if (!BANK_ACCOUNT) {
      throw new NotFoundError("`BankAccount` not found.")
    }
    const UPDATED = BANK_ACCOUNT.update({
      agency: input.agency,
      accountNumber: input.accountNumber,
    })
    const SAVED = await this.bankAccountRepository.save(UPDATED)
    return toResponseDTO(SAVED)
  }
}