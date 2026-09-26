"use client"

import { useCallback } from "react"

import { SumMoney, SumQuotas } from "@/lib/money/sum-money"
import type { EntityKpi } from "@/presentation/parts/hooks/use-entity-kpis.hook"
import { useEntityKpis } from "@/presentation/parts/hooks/use-entity-kpis.hook"
import { FormatCount } from "@/presentation/presenters/count.presenter"
import { FormatCurrency } from "@/presentation/presenters/currency.presenter"
import { FormatQuotaQuantity } from "@/presentation/presenters/quota-quantity.presenter"
import type { WithdrawalResponseDTO } from "@/services/withdrawal/dto/withdrawal-response.dto"

import { WITHDRAWAL_KPI } from "../settings/labels.settings"

/**
 * @summary
 * Builds the data-driven KPI cards of the withdrawal
 * list.
 *
 * @remarks
 * Totals the amounts and quotas of the non-reversed
 * withdrawals and counts the registered rows. Amounts
 * are formatted through the currency presenter, quotas
 * through the quota quantity presenter and the count
 * through the count presenter.
 *
 * @param withdrawals - The rows of the withdrawal list.
 *
 * @returns The KPI card props.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function BuildWithdrawalKpis(
  withdrawals: readonly WithdrawalResponseDTO[]
): EntityKpi[] {
  const ACTIVE = withdrawals.filter(
    (withdrawal) => !withdrawal.reversedAt
  )

  const TOTAL_AMOUNT = SumMoney(
    ACTIVE.map((withdrawal) => withdrawal.amount)
  )

  const TOTAL_QUOTAS = SumQuotas(
    ACTIVE.map((withdrawal) => withdrawal.quotas)
  )

  return [
    {
      key: "totalAmount",
      title: WITHDRAWAL_KPI.TOTAL_AMOUNT_TITLE,
      value: FormatCurrency(TOTAL_AMOUNT),
      comparison: WITHDRAWAL_KPI.TOTAL_AMOUNT_COMPARISON,
    },
    {
      key: "totalQuotas",
      title: WITHDRAWAL_KPI.TOTAL_QUOTAS_TITLE,
      value: FormatQuotaQuantity(TOTAL_QUOTAS),
      comparison: WITHDRAWAL_KPI.TOTAL_QUOTAS_COMPARISON,
    },
    {
      key: "withdrawals",
      title: WITHDRAWAL_KPI.ROW_COUNT_TITLE,
      value: FormatCount(withdrawals.length),
      comparison: WITHDRAWAL_KPI.ROW_COUNT_COMPARISON,
    },
  ]
}

/**
 * @summary
 * Resolves the KPI cards of the withdrawal list.
 *
 * @remarks
 * Delegates the computation to `BuildWithdrawalKpis`
 * and the memoization to the shared entity KPI hook.
 *
 * @param input - The withdrawal rows.
 *
 * @returns The KPI card props.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useWithdrawalKpis({
  withdrawals,
}: {
  withdrawals: readonly WithdrawalResponseDTO[]
}): EntityKpi[] {
  const compute = useCallback(
    (items: readonly WithdrawalResponseDTO[]) =>
      BuildWithdrawalKpis(items),
    []
  )

  return useEntityKpis({ items: withdrawals, compute })
}

export { useWithdrawalKpis }
