import { IBank } from "@domain/bank/interfaces/bank.interface"
import { EntityId } from "@/value-objects"

export interface BulkDeleteBanksInput {
  bankIds: string[]
}

/**
 * @summary
 * Deletes multiple `Bank` records.
 *
 * @remarks
 * Hydrates the banks by their ids and removes the rows
 * that still exist. Missing banks are silently skipped.
 *
 * @explanation
 * Use this use case to remove many banks through the
 * service layer.
 *
 * @example
 * await BULK_DELETE_BANKS_USE_CASE.execute({
 *   bankIds: ["bank-1", "bank-2"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export class BulkDeleteBanksUseCase {
  constructor(private bankRepository: IBank) {}

  /**
   * @summary
   * Removes the banks with the provided ids.
   *
   * @remarks
   * Hydrates the banks by their ids and removes the rows
   * that still exist. Missing banks are silently skipped.
   *
   * @explanation
   * Use this method to delete many banks in one operation.
   *
   * @param input - Payload with the target bank ids.
   *
   * @returns Resolves when the remaining rows are removed.
   *
   * @example
   * await BULK_DELETE_BANKS_USE_CASE.execute({
   *   bankIds: ["bank-1", "bank-2"],
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async execute(input: BulkDeleteBanksInput): Promise<void> {
    if (input.bankIds.length === 0) {
      return
    }

    const IDS = input.bankIds.map((id) => EntityId.create(id))
    const BANKS = await this.bankRepository.findAllByIds(IDS)

    const FOUND_IDS = BANKS.map((bank) => bank.id).filter(
      (id): id is EntityId => Boolean(id)
    )

    if (FOUND_IDS.length === 0) {
      return
    }

    await this.bankRepository.deleteByIds(FOUND_IDS)
  }
}
