"use client"

import { useCallback } from "react"

import type { EntityKpi } from "@/presentation/parts/hooks/use-entity-kpis.hook"
import { useEntityKpis } from "@/presentation/parts/hooks/use-entity-kpis.hook"
import { FormatCount } from "@/presentation/presenters/count.presenter"
import type { CheckingAccountResponseDTO } from "@/services/checking-account/dto/checking-account-response.dto"

import { CHECKING_ACCOUNT_KPI } from "../settings/labels.settings"

interface UseCheckingAccountKpisInput {
  entries: CheckingAccountResponseDTO[]
}

/**
 * @summary
 * Builds the data-driven KPI cards of the checking
 * account list.
 *
 * @remarks
 * Tallies the registered balances, the bank accounts
 * linked to them and the number of positive and
 * negative balances. All values are formatted through
 * the count presenter.
 *
 * @param entries - The rows of the checking account list.
 *
 * @returns The KPI card props.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function BuildCheckingAccountKpis(
  entries: readonly CheckingAccountResponseDTO[]
): EntityKpi[] {
  const ACCOUNTS = new Set(
    entries.map((entry) => entry.bankAccountId)
  ).size

  const POSITIVE = entries.filter(
    (entry) => Number.parseFloat(entry.value) > 0
  ).length

  const NEGATIVE = entries.filter(
    (entry) => Number.parseFloat(entry.value) < 0
  ).length

  return [
    {
      key: "entries",
      title: CHECKING_ACCOUNT_KPI.ENTRY_COUNT_TITLE,
      value: FormatCount(entries.length),
      comparison: CHECKING_ACCOUNT_KPI.ENTRY_COUNT_COMPARISON,
    },
    {
      key: "accounts",
      title: CHECKING_ACCOUNT_KPI.ACCOUNT_COUNT_TITLE,
      value: FormatCount(ACCOUNTS),
      comparison: CHECKING_ACCOUNT_KPI.ACCOUNT_COUNT_COMPARISON,
    },
    {
      key: "positive",
      title: CHECKING_ACCOUNT_KPI.POSITIVE_COUNT_TITLE,
      value: FormatCount(POSITIVE),
      comparison: CHECKING_ACCOUNT_KPI.POSITIVE_COUNT_COMPARISON,
    },
    {
      key: "negative",
      title: CHECKING_ACCOUNT_KPI.NEGATIVE_COUNT_TITLE,
      value: FormatCount(NEGATIVE),
      comparison: CHECKING_ACCOUNT_KPI.NEGATIVE_COUNT_COMPARISON,
    },
  ]
}

/**
 * @summary
 * Resolves the KPI cards of the checking account list.
 *
 * @remarks
 * Delegates the computation to `BuildCheckingAccountKpis`
 * and the memoization to the shared entity KPI hook.
 *
 * @param input - The rows rendered by the datatable.
 *
 * @returns The KPI card props.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useCheckingAccountKpis({
  entries,
}: UseCheckingAccountKpisInput): EntityKpi[] {
  const compute = useCallback(
    (items: readonly CheckingAccountResponseDTO[]) =>
      BuildCheckingAccountKpis(items),
    []
  )

  return useEntityKpis({
    items: entries,
    compute,
  })
}

export { useCheckingAccountKpis }
