import { ICheckingAccount } from "@domain/checking-account/interfaces/checking-account.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"
import type { CheckingAccountResponseDTO } from "../dto/checking-account-response.dto"
import { toResponseDTO } from "../mappers/checking-account.mapper"

export interface GetCheckingAccountInput {
  checkingAccountId: string
}

/**
 * @summary
 * Retrieves an existing `CheckingAccount` by its id.
 *
 * @remarks
 * Throws **NotFoundError** when no entry matches the
 * provided id.
 *
 * @explanation
 * Use this use case to fetch a single checking account
 * entry through the service layer.
 *
 * @example
 * const ENTRY = await GET_CHECKING_ACCOUNT_USE_CASE.execute({
 *   checkingAccountId: "entry-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class GetCheckingAccountUseCase {
  constructor(private checkingAccountRepository: ICheckingAccount) {}

  /**
   * @summary
   * Fetches the entry with the provided id.
   *
   * @remarks
   * Throws **NotFoundError** when no entry matches the
   * provided id.
   *
   * @explanation
   * Use this method to fetch a single checking account
   * entry through the service layer.
   *
   * @param input - Payload with the target entry id.
   *
   * @returns The matching entry.
   *
   * @example
   * const ENTRY = await GET_CHECKING_ACCOUNT_USE_CASE.execute({
   *   checkingAccountId: "entry-1",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(
    input: GetCheckingAccountInput
  ): Promise<CheckingAccountResponseDTO> {
    const ID = EntityId.create(input.checkingAccountId)
    const ENTRY = await this.checkingAccountRepository.findById(ID)
    if (!ENTRY) {
      throw new NotFoundError("`CheckingAccount` not found.")
    }
    return toResponseDTO(ENTRY)
  }
}
