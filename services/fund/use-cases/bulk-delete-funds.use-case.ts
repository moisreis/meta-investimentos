import { IFund } from "@domain/fund/interfaces/fund.interface"
import { EntityId } from "@/value-objects"

export interface BulkDeleteFundsInput {
  fundIds: string[]
}

/**
 * @summary
 * Deletes multiple `Fund` records.
 *
 * @remarks
 * Hydrates the funds by their ids and removes the
 * rows that still exist. Missing funds are silently
 * skipped.
 *
 * @explanation
 * Use this use case to remove many funds through the
 * service layer.
 *
 * @example
 * await BULK_DELETE_FUNDS_USE_CASE.execute({
 *   fundIds: ["fund-1", "fund-2"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export class BulkDeleteFundsUseCase {
  constructor(private fundRepository: IFund) {}

  /**
   * @summary
   * Removes the funds with the provided ids.
   *
   * @remarks
   * Hydrates the funds by their ids and removes the
   * rows that still exist. Missing funds are silently
   * skipped.
   *
   * @explanation
   * Use this method to delete many funds in one
   * operation.
   *
   * @param input - Payload with the target fund ids.
   *
   * @returns Resolves when the remaining rows are
   *          removed.
   *
   * @example
   * await BULK_DELETE_FUNDS_USE_CASE.execute({
   *   fundIds: ["fund-1", "fund-2"],
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async execute(input: BulkDeleteFundsInput): Promise<void> {
    if (input.fundIds.length === 0) {
      return
    }

    const IDS = input.fundIds.map((id) => EntityId.create(id))
    const FUNDS = await this.fundRepository.findAllByIds(IDS)

    const FOUND_IDS = FUNDS.map((fund) => fund.id).filter(
      (id): id is EntityId => Boolean(id)
    )

    if (FOUND_IDS.length === 0) {
      return
    }

    await this.fundRepository.deleteByIds(FOUND_IDS)
  }
}
