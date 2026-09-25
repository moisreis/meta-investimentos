import type { BankResponseDTO } from "@/services/bank/dto/bank-response.dto"
import type { BankRowSummaryDTO } from "@/services/bank/use-cases/list-bank-row-summaries.use-case"

import type { BankRowSummary } from "../types/bank-list.types"

/**
 * @summary
 * Composes the derived data of the bank rows.
 *
 * @remarks
 * Merges the grouped bank account counts with the bank
 * rows, keyed by bank id. Banks without any linked
 * account fall back to a zero count.
 *
 * @explanation
 * Use this helper in loaders that need the per-row
 * summary record consumed by the datatable and the KPI
 * hooks.
 *
 * @param banks - The bank rows.
 * @param counts - The account counts from the service.
 *
 * @returns The summaries keyed by bank id.
 *
 * @example
 * const SUMMARIES = BuildBankRowSummaries(BANKS, COUNTS);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function BuildBankRowSummaries(
  banks: BankResponseDTO[],
  counts: BankRowSummaryDTO[]
): Record<string, BankRowSummary> {
  const COUNTS_BY_BANK = new Map(
    counts.map((entry) => [entry.bankId, entry])
  )

  return Object.fromEntries(
    banks.map((bank) => [
      bank.id,
      {
        accountCount:
          COUNTS_BY_BANK.get(bank.id)?.accountCount ?? 0,
      },
    ])
  )
}
