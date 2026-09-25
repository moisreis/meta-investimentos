"use client"

import { useCallback } from "react"

import type { EntityKpi } from "@/presentation/parts/hooks/use-entity-kpis.hook"
import { useEntityKpis } from "@/presentation/parts/hooks/use-entity-kpis.hook"
import { FormatCount } from "@/presentation/presenters/count.presenter"
import type { BankResponseDTO } from "@/services/bank/dto/bank-response.dto"

import { BANK_KPI } from "../settings/labels.settings"
import type { BankRowSummary } from "../types/bank-list.types"

interface UseBankKpisInput {
  banks: BankResponseDTO[]
  summaries: Record<string, BankRowSummary> | null
}

/**
 * @summary
 * Builds the data-driven KPI cards of the bank list.
 *
 * @remarks
 * Tallies the registered banks, the bank accounts linked
 * to them and the number of banks with and without linked
 * accounts. All values are formatted through the count
 * presenter.
 *
 * @param banks - The rows of the bank list.
 * @param summaries - The derived per-row account counts.
 *
 * @returns The KPI card props.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function BuildBankKpis(
  banks: readonly BankResponseDTO[],
  summaries: Record<string, BankRowSummary> | null
): EntityKpi[] {
  const TOTAL_ACCOUNTS = Object.values(summaries ?? {}).reduce(
    (sum, summary) => sum + summary.accountCount,
    0
  )

  const BANKS_WITH_ACCOUNTS = Object.values(
    summaries ?? {}
  ).filter((summary) => summary.accountCount > 0).length

  return [
    {
      key: "banks",
      title: BANK_KPI.BANK_COUNT_TITLE,
      value: FormatCount(banks.length),
      comparison: BANK_KPI.BANK_COUNT_COMPARISON,
    },
    {
      key: "accounts",
      title: BANK_KPI.ACCOUNT_COUNT_TITLE,
      value: FormatCount(TOTAL_ACCOUNTS),
      comparison: BANK_KPI.ACCOUNT_COUNT_COMPARISON,
    },
    {
      key: "banksWithAccounts",
      title: BANK_KPI.BANKS_WITH_ACCOUNTS_TITLE,
      value: FormatCount(BANKS_WITH_ACCOUNTS),
      comparison: BANK_KPI.BANKS_WITH_ACCOUNTS_COMPARISON,
    },
    {
      key: "banksWithoutAccounts",
      title: BANK_KPI.BANKS_WITHOUT_ACCOUNTS_TITLE,
      value: FormatCount(banks.length - BANKS_WITH_ACCOUNTS),
      comparison: BANK_KPI.BANKS_WITHOUT_ACCOUNTS_COMPARISON,
    },
  ]
}

/**
 * @summary
 * Resolves the KPI cards of the bank list.
 *
 * @remarks
 * Delegates the computation to `BuildBankKpis` and the
 * memoization to the shared entity KPI hook.
 *
 * @param input - The rows and the derived per-row counts.
 *
 * @returns The KPI card props.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useBankKpis({
  banks,
  summaries,
}: UseBankKpisInput): EntityKpi[] {
  const compute = useCallback(
    (items: readonly BankResponseDTO[]) =>
      BuildBankKpis(items, summaries),
    [summaries]
  )

  return useEntityKpis({
    items: banks,
    compute,
  })
}

export { useBankKpis }
