import { IBank } from "@domain/bank/interfaces/bank.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"

export interface DeleteBankInput {
  bankId: string
}

/**
 * @summary
 * Deletes an existing `Bank`.
 *
 * @remarks
 * Fetches the bank and removes it when it exists. Throws
 * **NotFoundError** when no bank matches the provided id.
 *
 * @explanation
 * Use this use case to remove a bank through the service
 * layer.
 *
 * @example
 * await DELETE_BANK_USE_CASE.execute({
 *   bankId: "bank-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export class DeleteBankUseCase {
  constructor(private bankRepository: IBank) {}

  /**
   * @summary
   * Deletes the bank with the provided id.
   *
   * @remarks
   * Fetches the bank and removes it when it exists.
   * Throws **NotFoundError** when no bank matches the
   * provided id.
   *
   * @explanation
   * Use this method to remove a bank through the
   * service layer.
   *
   * @param input - Payload with the target bank id.
   *
   * @returns Resolves when removed.
   *
   * @example
   * await DELETE_BANK_USE_CASE.execute({
   *   bankId: "bank-1",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async execute(input: DeleteBankInput): Promise<void> {
    const ID = EntityId.create(input.bankId)
    const BANK = await this.bankRepository.findById(ID)

    if (!BANK) {
      throw new NotFoundError("`Bank` not found.")
    }

    await this.bankRepository.delete(ID)
  }
}
