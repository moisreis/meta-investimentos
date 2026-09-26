"use client"

import { useCallback } from "react"

import type { EntityKpi } from "@/presentation/parts/hooks/use-entity-kpis.hook"
import { useEntityKpis } from "@/presentation/parts/hooks/use-entity-kpis.hook"
import { FormatCount } from "@/presentation/presenters/count.presenter"
import type { BankAccountResponseDTO } from "@/services/bank-account/dto/bank-account-response.dto"

import { BANK_ACCOUNT_KPI } from "../settings/labels.settings"
import type { BankAccountRowSummary } from "../types/bank-account-list.types"

interface UseBankAccountKpisInput {
  bankAccounts: BankAccountResponseDTO[]
  summaries: Record<string, BankAccountRowSummary> | null
}

/**
 * @summary
 * Builds the data-driven KPI cards of the bank account
 * list.
 *
 * @remarks
 * Tallies the registered bank accounts, the portfolios
 * and banks linked to them and the checking entries
 * across all accounts. All values are formatted
 * through the count presenter.
 *
 * @param bankAccounts - The rows of the bank account
 *                       list.
 * @param summaries - The derived per-row entry counts.
 *
 * @returns The KPI card props.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function BuildBankAccountKpis(
  bankAccounts: readonly BankAccountResponseDTO[],
  summaries: Record<string, BankAccountRowSummary> | null
): EntityKpi[] {
  const PORTFOLIOS = new Set(
    bankAccounts.map((account) => account.portfolioId)
  ).size

  const BANKS = new Set(
    bankAccounts.map((account) => account.bankId)
  ).size

  const CHECKING = Object.values(summaries ?? {}).reduce(
    (sum, summary) => sum + summary.checkingCount,
    0
  )

  return [
    {
      key: "accounts",
      title: BANK_ACCOUNT_KPI.ACCOUNT_COUNT_TITLE,
      value: FormatCount(bankAccounts.length),
      comparison: BANK_ACCOUNT_KPI.ACCOUNT_COUNT_COMPARISON,
    },
    {
      key: "portfolios",
      title: BANK_ACCOUNT_KPI.PORTFOLIO_COUNT_TITLE,
      value: FormatCount(PORTFOLIOS),
      comparison: BANK_ACCOUNT_KPI.PORTFOLIO_COUNT_COMPARISON,
    },
    {
      key: "banks",
      title: BANK_ACCOUNT_KPI.BANK_COUNT_TITLE,
      value: FormatCount(BANKS),
      comparison: BANK_ACCOUNT_KPI.BANK_COUNT_COMPARISON,
    },
    {
      key: "checking",
      title: BANK_ACCOUNT_KPI.CHECKING_COUNT_TITLE,
      value: FormatCount(CHECKING),
      comparison: BANK_ACCOUNT_KPI.CHECKING_COUNT_COMPARISON,
    },
  ]
}

/**
 * @summary
 * Resolves the KPI cards of the bank account list.
 *
 * @remarks
 * Delegates the computation to `BuildBankAccountKpis`
 * and the memoization to the shared entity KPI hook.
 *
 * @param input - The rows and the derived summaries.
 *
 * @returns The KPI card props.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useBankAccountKpis({
  bankAccounts,
  summaries,
}: UseBankAccountKpisInput): EntityKpi[] {
  const compute = useCallback(
    (items: readonly BankAccountResponseDTO[]) =>
      BuildBankAccountKpis(items, summaries),
    [summaries]
  )

  return useEntityKpis({
    items: bankAccounts,
    compute,
  })
}

export { useBankAccountKpis }
