"use client"

import { useCallback } from "react"

import { SumMoney } from "@/lib/money/sum-money"
import type { EntityKpi } from "@/presentation/parts/hooks/use-entity-kpis.hook"
import { useEntityKpis } from "@/presentation/parts/hooks/use-entity-kpis.hook"
import { FormatCount } from "@/presentation/presenters/count.presenter"
import { FormatCurrency } from "@/presentation/presenters/currency.presenter"
import type { PortfolioPerformanceResponseDTO } from "@/services/portfolio-performance/dto/portfolio-performance-response.dto"

import { PORTFOLIO_PERFORMANCE_KPI } from "../settings/labels.settings"

/**
 * @summary
 * Builds the data-driven KPI cards of the performance
 * list.
 *
 * @remarks
 * Sums the patrimony of the latest snapshot of each
 * portfolio, counts the registered rows and counts the
 * distinct portfolios holding performances. Amounts are
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
export function BuildPortfolioPerformanceKpis(
  performances: readonly PortfolioPerformanceResponseDTO[]
): EntityKpi[] {
  const LATEST_BY_PORTFOLIO = new Map<
    string,
    PortfolioPerformanceResponseDTO
  >()

  for (const performance of performances) {
    const CURRENT = LATEST_BY_PORTFOLIO.get(
      performance.portfolioId
    )

    if (!CURRENT || performance.date > CURRENT.date) {
      LATEST_BY_PORTFOLIO.set(
        performance.portfolioId,
        performance
      )
    }
  }

  const TOTAL_PATRIMONY = SumMoney(
    [...LATEST_BY_PORTFOLIO.values()].map(
      (performance) => performance.patrimony
    )
  )

  const PORTFOLIO_IDS = new Set(
    performances.map((performance) => performance.portfolioId)
  )

  return [
    {
      key: "patrimony",
      title: PORTFOLIO_PERFORMANCE_KPI.PATRIMONY_TITLE,
      value: FormatCurrency(TOTAL_PATRIMONY),
      comparison: PORTFOLIO_PERFORMANCE_KPI.PATRIMONY_COMPARISON,
    },
    {
      key: "performances",
      title: PORTFOLIO_PERFORMANCE_KPI.ROW_COUNT_TITLE,
      value: FormatCount(performances.length),
      comparison: PORTFOLIO_PERFORMANCE_KPI.ROW_COUNT_COMPARISON,
    },
    {
      key: "portfolios",
      title: PORTFOLIO_PERFORMANCE_KPI.PORTFOLIO_COUNT_TITLE,
      value: FormatCount(PORTFOLIO_IDS.size),
      comparison:
        PORTFOLIO_PERFORMANCE_KPI.PORTFOLIO_COUNT_COMPARISON,
    },
  ]
}

/**
 * @summary
 * Resolves the KPI cards of the performance list.
 *
 * @remarks
 * Delegates the computation to
 * `BuildPortfolioPerformanceKpis` and the memoization to
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
function usePortfolioPerformanceKpis({
  performances,
}: {
  performances: readonly PortfolioPerformanceResponseDTO[]
}): EntityKpi[] {
  const compute = useCallback(
    (items: readonly PortfolioPerformanceResponseDTO[]) =>
      BuildPortfolioPerformanceKpis(items),
    []
  )

  return useEntityKpis({ items: performances, compute })
}

export { usePortfolioPerformanceKpis }
