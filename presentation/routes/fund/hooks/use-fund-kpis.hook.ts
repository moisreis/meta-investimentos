"use client"

import { useCallback } from "react"

import type { EntityKpi } from "@/presentation/parts/hooks/use-entity-kpis.hook"
import { useEntityKpis } from "@/presentation/parts/hooks/use-entity-kpis.hook"
import { FormatCount } from "@/presentation/presenters/count.presenter"
import type { FundResponseDTO } from "@/services/fund/dto/fund-response.dto"

import { FUND_KPI } from "../settings/labels.settings"
import type { FundRowSummary } from "../types/fund-list.types"

interface UseFundKpisInput {
  funds: FundResponseDTO[]
  summaries: Record<string, FundRowSummary> | null
}

/**
 * @summary
 * Builds the data-driven KPI cards of the fund list.
 *
 * @remarks
 * Tallies the registered funds, the positions linked
 * to them and the number of funds with and without
 * linked positions. All values are formatted through
 * the count presenter.
 *
 * @param funds - The rows of the fund list.
 * @param summaries - The per-row position counts.
 *
 * @returns The KPI card props.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function BuildFundKpis(
  funds: readonly FundResponseDTO[],
  summaries: Record<string, FundRowSummary> | null
): EntityKpi[] {
  const TOTAL_POSITIONS = Object.values(summaries ?? {}).reduce(
    (sum, summary) => sum + summary.positionCount,
    0
  )

  const FUNDS_WITH_POSITIONS = Object.values(
    summaries ?? {}
  ).filter((summary) => summary.positionCount > 0).length

  return [
    {
      key: "funds",
      title: FUND_KPI.FUND_COUNT_TITLE,
      value: FormatCount(funds.length),
      comparison: FUND_KPI.FUND_COUNT_COMPARISON,
    },
    {
      key: "positions",
      title: FUND_KPI.POSITION_COUNT_TITLE,
      value: FormatCount(TOTAL_POSITIONS),
      comparison: FUND_KPI.POSITION_COUNT_COMPARISON,
    },
    {
      key: "fundsWithPositions",
      title: FUND_KPI.FUNDS_WITH_POSITIONS_TITLE,
      value: FormatCount(FUNDS_WITH_POSITIONS),
      comparison: FUND_KPI.FUNDS_WITH_POSITIONS_COMPARISON,
    },
    {
      key: "fundsWithoutPositions",
      title: FUND_KPI.FUNDS_WITHOUT_POSITIONS_TITLE,
      value: FormatCount(funds.length - FUNDS_WITH_POSITIONS),
      comparison: FUND_KPI.FUNDS_WITHOUT_POSITIONS_COMPARISON,
    },
  ]
}

/**
 * @summary
 * Resolves the KPI cards of the fund list.
 *
 * @remarks
 * Delegates the computation to `BuildFundKpis` and
 * the memoization to the shared entity KPI hook.
 *
 * @param input - The rows and the per-row counts.
 *
 * @returns The KPI card props.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useFundKpis({
  funds,
  summaries,
}: UseFundKpisInput): EntityKpi[] {
  const compute = useCallback(
    (items: readonly FundResponseDTO[]) =>
      BuildFundKpis(items, summaries),
    [summaries]
  )

  return useEntityKpis({
    items: funds,
    compute,
  })
}

export { useFundKpis }
