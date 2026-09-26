"use client"

import { useCallback } from "react"

import { SumMoney } from "@/lib/money/sum-money"
import type { EntityKpi } from "@/presentation/parts/hooks/use-entity-kpis.hook"
import { useEntityKpis } from "@/presentation/parts/hooks/use-entity-kpis.hook"
import { FormatCount } from "@/presentation/presenters/count.presenter"
import { FormatCurrency } from "@/presentation/presenters/currency.presenter"
import type { PositionPerformanceResponseDTO } from "@/services/position-performance/dto/position-performance-response.dto"

import { POSITION_PERFORMANCE_KPI } from "../settings/labels.settings"

/**
 * @summary
 * Builds the data-driven KPI cards of the position
 * performance list.
 *
 * @remarks
 * Sums the patrimony of the latest snapshot of each
 * position, counts the registered rows and counts the
 * distinct positions holding performances. Amounts are
 * formatted through the currency presenter and the
 * counts through the count presenter.
 *
 * @param performances - The rows of the performance list.
 *
 * @returns The KPI card props.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function BuildPositionPerformanceKpis(
  performances: readonly PositionPerformanceResponseDTO[]
): EntityKpi[] {
  const LATEST_BY_POSITION = new Map<
    string,
    PositionPerformanceResponseDTO
  >()

  for (const performance of performances) {
    const CURRENT = LATEST_BY_POSITION.get(
      performance.positionId
    )

    if (!CURRENT || performance.date > CURRENT.date) {
      LATEST_BY_POSITION.set(performance.positionId, performance)
    }
  }

  const TOTAL_PATRIMONY = SumMoney(
    [...LATEST_BY_POSITION.values()].map(
      (performance) => performance.patrimony
    )
  )

  const POSITION_IDS = new Set(
    performances.map((performance) => performance.positionId)
  )

  return [
    {
      key: "patrimony",
      title: POSITION_PERFORMANCE_KPI.PATRIMONY_TITLE,
      value: FormatCurrency(TOTAL_PATRIMONY),
      comparison: POSITION_PERFORMANCE_KPI.PATRIMONY_COMPARISON,
    },
    {
      key: "performances",
      title: POSITION_PERFORMANCE_KPI.ROW_COUNT_TITLE,
      value: FormatCount(performances.length),
      comparison: POSITION_PERFORMANCE_KPI.ROW_COUNT_COMPARISON,
    },
    {
      key: "positions",
      title: POSITION_PERFORMANCE_KPI.POSITION_COUNT_TITLE,
      value: FormatCount(POSITION_IDS.size),
      comparison:
        POSITION_PERFORMANCE_KPI.POSITION_COUNT_COMPARISON,
    },
  ]
}

/**
 * @summary
 * Resolves the KPI cards of the position performance
 * list.
 *
 * @remarks
 * Delegates the computation to
 * `BuildPositionPerformanceKpis` and the memoization to
 * the shared entity KPI hook.
 *
 * @param input - The performance rows.
 *
 * @returns The KPI card props.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function usePositionPerformanceKpis({
  performances,
}: {
  performances: readonly PositionPerformanceResponseDTO[]
}): EntityKpi[] {
  const compute = useCallback(
    (items: readonly PositionPerformanceResponseDTO[]) =>
      BuildPositionPerformanceKpis(items),
    []
  )

  return useEntityKpis({ items: performances, compute })
}

export { usePositionPerformanceKpis }
