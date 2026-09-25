import type { IBankAccount } from "@domain/bank-account/interfaces/bank-account.interface"
import { EntityId } from "@/value-objects"

export interface ListBankRowSummariesInput {
  bankIds: string[]
}

export interface BankRowSummaryDTO {
  bankId: string
  accountCount: number
}

/**
 * @summary
 * Summarizes the holdings of a set of banks.
 *
 * @remarks
 * Runs a single grouped query over the `bank_account`
 * rows so no rows are materialized.
 *
 * @explanation
 * Use this use case whenever a loader needs the derived
 * count of bank accounts linked to each bank. The bank
 * repository stays untouched; this service composes the
 * count into one payload.
 *
 * @example
 * const SUMMARIES = await LIST_SUMMARIES_USE_CASE.execute({
 *   bankIds: ["bank-1", "bank-2"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export class ListBankRowSummariesUseCase {
  constructor(private bankAccountRepository: IBankAccount) {}

  /**
   * @summary
   * Tallies the bank accounts of each bank.
   *
   * @remarks
   * Returns an entry only for banks that matched at
   * least one row; callers fall back to zero when a
   * bank is absent from the result.
   *
   * @explanation
   * Use this method to resolve the derived account
   * counts of a bank list in a single service call.
   *
   * @param input - Payload with the bank ids.
   *
   * @returns The per-bank account summaries.
   *
   * @example
   * const SUMMARIES = await LIST_SUMMARIES_USE_CASE.execute({
   *   bankIds: ["bank-1", "bank-2"],
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async execute(
    input: ListBankRowSummariesInput
  ): Promise<BankRowSummaryDTO[]> {
    const IDS = input.bankIds.map((id) => EntityId.create(id))

    const ACCOUNT_COUNTS =
      await this.bankAccountRepository.countByBankIds(IDS)

    return ACCOUNT_COUNTS.map((entry) => ({
      bankId: entry.bankId as string,
      accountCount: entry.count,
    }))
  }
}
