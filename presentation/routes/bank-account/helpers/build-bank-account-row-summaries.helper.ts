import type { BankAccountResponseDTO } from "@/services/bank-account/dto/bank-account-response.dto"
import type { CheckingAccountResponseDTO } from "@/services/checking-account/dto/checking-account-response.dto"

import type { BankAccountRowSummary } from "../types/bank-account-list.types"

/**
 * @summary
 * Composes the derived data of the bank account rows.
 *
 * @remarks
 * Tallies the checking account entries per bank account
 * and merges the counts with the rows, keyed by bank
 * account id. Bank accounts without any linked entry
 * fall back to a zero count.
 *
 * @explanation
 * Use this helper in loaders that need the per-row
 * summary record consumed by the datatable and the KPI
 * hooks.
 *
 * @param bankAccounts - The bank account rows.
 * @param entries - The checking account entries.
 *
 * @returns The summaries keyed by bank account id.
 *
 * @example
 * const SUMMARIES = BuildBankAccountRowSummaries(
 *   BANK_ACCOUNTS, ENTRIES);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function BuildBankAccountRowSummaries(
  bankAccounts: BankAccountResponseDTO[],
  entries: CheckingAccountResponseDTO[]
): Record<string, BankAccountRowSummary> {
  const COUNTS = new Map<string, number>()

  for (const ENTRY of entries) {
    COUNTS.set(
      ENTRY.bankAccountId,
      (COUNTS.get(ENTRY.bankAccountId) ?? 0) + 1
    )
  }

  return Object.fromEntries(
    bankAccounts.map((account) => [
      account.id,
      {
        checkingCount: COUNTS.get(account.id) ?? 0,
      },
    ])
  )
}
