import { IWithdrawal } from "@domain/withdrawal/interfaces/withdrawal.interface"
import { EntityId } from "@/value-objects"

export interface BulkDeleteWithdrawalsInput {
  withdrawalIds: string[]
}

/**
 * @summary
 * Deletes multiple `Withdrawal` records.
 *
 * @remarks
 * Hydrates each withdrawal by its id and removes the rows
 * that still exist. Rows that no longer exist are silently
 * skipped. The repository contract exposes single-row
 * deletes, so each removal runs through `delete(id)`.
 *
 * @explanation
 * Use this use case to remove many withdrawals of the
 * registry through the service layer.
 *
 * @example
 * await BULK_DELETE_WITHDRAWALS_USE_CASE.execute({
 *   withdrawalIds: ["withdrawal-1", "withdrawal-2"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-10-20
 */
export class BulkDeleteWithdrawalsUseCase {
  constructor(private withdrawalRepository: IWithdrawal) {}

  /**
   * @summary
   * Removes the withdrawals with the provided ids.
   *
   * @remarks
   * Skips ids without a matching row. Returns early when
   * the list is empty.
   *
   * @explanation
   * Use this method to delete the selected withdrawal rows
   * of the registry in a single flow.
   *
   * @param input - Payload with the target withdrawal ids.
   *
   * @returns Resolves when the rows are removed.
   *
   * @example
   * await BULK_DELETE_WITHDRAWALS_USE_CASE.execute({
   *   withdrawalIds: ["withdrawal-1", "withdrawal-2"],
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-10-20
   */
  async execute(
    input: BulkDeleteWithdrawalsInput
  ): Promise<void> {
    if (input.withdrawalIds.length === 0) {
      return
    }

    for (const id of input.withdrawalIds) {
      const ENTITY_ID = EntityId.create(id)
      const WITHDRAWAL =
        await this.withdrawalRepository.findById(ENTITY_ID)

      if (WITHDRAWAL) {
        await this.withdrawalRepository.delete(ENTITY_ID)
      }
    }
  }
}
