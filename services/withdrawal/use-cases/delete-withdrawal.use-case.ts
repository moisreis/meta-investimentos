import { IWithdrawal } from "@domain/withdrawal/interfaces/withdrawal.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"

export interface DeleteWithdrawalInput {
  withdrawalId: string
}

/**
 * @summary
 * Deletes an existing `Withdrawal`.
 *
 * @remarks
 * Fetches the withdrawal and removes it when it exists.
 * Throws **NotFoundError** when no withdrawal matches the
 * provided id.
 *
 * @explanation
 * Use this use case to remove a withdrawal through the
 * service layer.
 *
 * @example
 * await DELETE_WITHDRAWAL_USE_CASE.execute({
 *   withdrawalId: "withdrawal-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
export class DeleteWithdrawalUseCase {
  constructor(private withdrawalRepository: IWithdrawal) {}

  /**
   * @summary
   * Deletes the withdrawal with the provided id.
   *
   * @remarks
   * Fetches the withdrawal and removes it when it exists.
   * Throws **NotFoundError** when no withdrawal matches the
   * provided id.
   *
   * @explanation
   * Use this method to remove a withdrawal through the
   * service layer.
   *
   * @param input - Payload with the target withdrawal id.
   *
   * @returns Resolves when removed.
   *
   * @example
   * await DELETE_WITHDRAWAL_USE_CASE.execute({
 *   withdrawalId: "withdrawal-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
   */
  async execute(input: DeleteWithdrawalInput): Promise<void> {
    const ID = EntityId.create(input.withdrawalId)
    const WITHDRAWAL = await this.withdrawalRepository.findById(ID)
    if (!WITHDRAWAL) {
      throw new NotFoundError("`Withdrawal` not found.")
    }
    await this.withdrawalRepository.delete(ID)
  }
}