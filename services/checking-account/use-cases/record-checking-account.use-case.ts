import { CheckingAccount } from "@domain/checking-account/entities/checking-account.entity"
import { ICheckingAccount } from "@domain/checking-account/interfaces/checking-account.interface"
import { NotFoundError } from "@errors/not-found.error"
import { IBankAccount } from "@domain/bank-account/interfaces/bank-account.interface"
import { EntityId } from "@/value-objects"
import type { CheckingAccountResponseDTO } from "../dto/checking-account-response.dto"
import {
  toCreateCheckingAccountProps,
  toResponseDTO,
} from "../mappers/checking-account.mapper"

export interface RecordCheckingAccountInput {
  bankAccountId: string
  date: string
  value: string
}

/**
 * @summary
 * Records a `CheckingAccount` entry and persists it.
 *
 * @remarks
 * Verifies the target bank account exists, builds
 * entity props through the create mapper, and saves
 * the entry with the checking account repository.
 *
 * @explanation
 * Use this use case to register a checking account
 * entry through the service layer.
 *
 * @example
 * const ENTRY = await RECORD_CHECKING_ACCOUNT_USE_CASE.execute({
 *   bankAccountId: "bank-account-1",
 *   date: "2026-03-01T00:00:00.000Z",
 *   value: "15000",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class RecordCheckingAccountUseCase {
  constructor(
    private checkingAccountRepository: ICheckingAccount,
    private bankAccountRepository: IBankAccount
  ) {}

  /**
   * @summary
   * Records and persists the checking account entry.
   *
   * @remarks
   * Verifies the target bank account exists, builds
   * entity props through the create mapper, and saves
   * the entry with the checking account repository.
   *
   * @explanation
   * Use this method to register a checking account
   * entry through the service layer.
   *
   * @param input - The entry creation payload.
   *
   * @returns The persisted entry.
   *
   * @example
   * const ENTRY = await RECORD_CHECKING_ACCOUNT_USE_CASE
   *   .execute({
   *     bankAccountId: "bank-account-1",
   *     date: "2026-03-01T00:00:00.000Z",
   *     value: "15000",
   *   });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(
    input: RecordCheckingAccountInput
  ): Promise<CheckingAccountResponseDTO> {
    const BANK_ACCOUNT_ID = EntityId.create(input.bankAccountId)
    const BANK_ACCOUNT =
      await this.bankAccountRepository.findById(BANK_ACCOUNT_ID)
    if (!BANK_ACCOUNT) {
      throw new NotFoundError("`BankAccount` not found.")
    }
    const PROPS = toCreateCheckingAccountProps(input)
    const ENTRY = CheckingAccount.create(PROPS)
    const SAVED =
      await this.checkingAccountRepository.save(ENTRY)
    return toResponseDTO(SAVED)
  }
}
