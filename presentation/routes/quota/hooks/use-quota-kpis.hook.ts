"use client"

import { useCallback } from "react"

import type { EntityKpi } from "@/presentation/parts/hooks/use-entity-kpis.hook"
import { useEntityKpis } from "@/presentation/parts/hooks/use-entity-kpis.hook"
import { FormatCount } from "@/presentation/presenters/count.presenter"
import { FormatDate } from "@/presentation/presenters/date.presenter"
import type { QuotaResponseDTO } from "@/services/quota/dto/quota-response.dto"

import { QUOTA_KPI } from "../settings/labels.settings"

/**
 * @summary
 * Builds the data-driven KPI cards of the quota list.
 *
 * @remarks
 * Tallies the imported quotas, the distinct funds linked
 * to them and the most recent quota date. Counts are
 * formatted through the count presenter and the latest
 * date through the date presenter.
 *
 * @param quotas - The rows of the quota list.
 *
 * @returns The KPI card props.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function BuildQuotaKpis(
  quotas: readonly QuotaResponseDTO[]
): EntityKpi[] {
  const FUNDS = new Set(quotas.map((quota) => quota.fundId)).size

  const LAST_DATE = quotas.reduce(
    (latest, quota) =>
      quota.date > latest ? quota.date : latest,
    ""
  )

  return [
    {
      key: "quotas",
      title: QUOTA_KPI.ROW_COUNT_TITLE,
      value: FormatCount(quotas.length),
      comparison: QUOTA_KPI.ROW_COUNT_COMPARISON,
    },
    {
      key: "funds",
      title: QUOTA_KPI.FUND_COUNT_TITLE,
      value: FormatCount(FUNDS),
      comparison: QUOTA_KPI.FUND_COUNT_COMPARISON,
    },
    {
      key: "lastDate",
      title: QUOTA_KPI.LAST_DATE_TITLE,
      value: FormatDate(LAST_DATE || null),
      comparison: QUOTA_KPI.LAST_DATE_COMPARISON,
    },
  ]
}

/**
 * @summary
 * Resolves the KPI cards of the quota list.
 *
 * @remarks
 * Delegates the computation to `BuildQuotaKpis` and the
 * memoization to the shared entity KPI hook.
 *
 * @param input - The quota rows.
 *
 * @returns The KPI card props.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useQuotaKpis({
  quotas,
}: {
  quotas: readonly QuotaResponseDTO[]
}): EntityKpi[] {
  const compute = useCallback(
    (items: readonly QuotaResponseDTO[]) =>
      BuildQuotaKpis(items),
    []
  )

  return useEntityKpis({ items: quotas, compute })
}

export { useQuotaKpis }
