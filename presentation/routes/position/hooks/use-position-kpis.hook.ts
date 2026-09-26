"use client"

import { useCallback } from "react"

import { SumMoney } from "@/lib/money/sum-money"
import type { EntityKpi } from "@/presentation/parts/hooks/use-entity-kpis.hook"
import { useEntityKpis } from "@/presentation/parts/hooks/use-entity-kpis.hook"
import { FormatCount } from "@/presentation/presenters/count.presenter"
import { FormatCurrency } from "@/presentation/presenters/currency.presenter"
import type { PositionResponseDTO } from "@/services/position/dto/position-response.dto"

import { POSITION_KPI } from "../settings/labels.settings"

/**
 * @summary
 * Builds the data-driven KPI cards of the position list.
 *
 * @remarks
 * Sums the initial balances of the positions exactly,
 * counts the registered rows and counts the distinct funds
 * holding positions. Amounts are formatted through the
 * currency presenter and the counts through the count
 * presenter.
 *
 * @param positions - The rows of the position list.
 *
 * @returns The KPI card props.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function BuildPositionKpis(
  positions: readonly PositionResponseDTO[]
): EntityKpi[] {
  const TOTAL_BALANCE = SumMoney(
    positions.map((position) => position.initialBalance)
  )

  const FUND_IDS = new Set(
    positions.map((position) => position.fundId)
  )

  return [
    {
      key: "totalBalance",
      title: POSITION_KPI.TOTAL_BALANCE_TITLE,
      value: FormatCurrency(TOTAL_BALANCE),
      comparison: POSITION_KPI.TOTAL_BALANCE_COMPARISON,
    },
    {
      key: "positions",
      title: POSITION_KPI.ROW_COUNT_TITLE,
      value: FormatCount(positions.length),
      comparison: POSITION_KPI.ROW_COUNT_COMPARISON,
    },
    {
      key: "funds",
      title: POSITION_KPI.FUND_COUNT_TITLE,
      value: FormatCount(FUND_IDS.size),
      comparison: POSITION_KPI.FUND_COUNT_COMPARISON,
    },
  ]
}

/**
 * @summary
 * Resolves the KPI cards of the position list.
 *
 * @remarks
 * Delegates the computation to `BuildPositionKpis` and
 * the memoization to the shared entity KPI hook.
 *
 * @param input - The position rows.
 *
 * @returns The KPI card props.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function usePositionKpis({
  positions,
}: {
  positions: readonly PositionResponseDTO[]
}): EntityKpi[] {
  const compute = useCallback(
    (items: readonly PositionResponseDTO[]) =>
      BuildPositionKpis(items),
    []
  )

  return useEntityKpis({ items: positions, compute })
}

export { usePositionKpis }
