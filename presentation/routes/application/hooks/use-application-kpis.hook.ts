"use client"

import { useCallback } from "react"

import { SumMoney, SumQuotas } from "@/lib/money/sum-money"
import type { EntityKpi } from "@/presentation/parts/hooks/use-entity-kpis.hook"
import { useEntityKpis } from "@/presentation/parts/hooks/use-entity-kpis.hook"
import { FormatCount } from "@/presentation/presenters/count.presenter"
import { FormatCurrency } from "@/presentation/presenters/currency.presenter"
import { FormatQuotaQuantity } from "@/presentation/presenters/quota-quantity.presenter"
import type { ApplicationResponseDTO } from "@/services/application/dto/application-response.dto"

import { APPLICATION_KPI } from "../settings/labels.settings"

/**
 * @summary
 * Builds the data-driven KPI cards of the application
 * list.
 *
 * @remarks
 * Totals the amounts and quotas of the non-reversed
 * applications and counts the registered rows. Amounts
 * are formatted through the currency presenter, quotas
 * through the quota quantity presenter and the count
 * through the count presenter.
 *
 * @param applications - The rows of the application list.
 *
 * @returns The KPI card props.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function BuildApplicationKpis(
  applications: readonly ApplicationResponseDTO[]
): EntityKpi[] {
  const ACTIVE = applications.filter(
    (application) => !application.reversedAt
  )

  const TOTAL_AMOUNT = SumMoney(
    ACTIVE.map((application) => application.amount)
  )

  const TOTAL_QUOTAS = SumQuotas(
    ACTIVE.map((application) => application.quotas)
  )

  return [
    {
      key: "totalAmount",
      title: APPLICATION_KPI.TOTAL_AMOUNT_TITLE,
      value: FormatCurrency(TOTAL_AMOUNT),
      comparison: APPLICATION_KPI.TOTAL_AMOUNT_COMPARISON,
    },
    {
      key: "totalQuotas",
      title: APPLICATION_KPI.TOTAL_QUOTAS_TITLE,
      value: FormatQuotaQuantity(TOTAL_QUOTAS),
      comparison: APPLICATION_KPI.TOTAL_QUOTAS_COMPARISON,
    },
    {
      key: "applications",
      title: APPLICATION_KPI.ROW_COUNT_TITLE,
      value: FormatCount(applications.length),
      comparison: APPLICATION_KPI.ROW_COUNT_COMPARISON,
    },
  ]
}

/**
 * @summary
 * Resolves the KPI cards of the application list.
 *
 * @remarks
 * Delegates the computation to `BuildApplicationKpis`
 * and the memoization to the shared entity KPI hook.
 *
 * @param input - The application rows.
 *
 * @returns The KPI card props.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useApplicationKpis({
  applications,
}: {
  applications: readonly ApplicationResponseDTO[]
}): EntityKpi[] {
  const compute = useCallback(
    (items: readonly ApplicationResponseDTO[]) =>
      BuildApplicationKpis(items),
    []
  )

  return useEntityKpis({ items: applications, compute })
}

export { useApplicationKpis }
