"use client"

import { useCallback } from "react"

import type { EntityKpi } from "@/presentation/parts/hooks/use-entity-kpis.hook"
import {
  ResolveEntityKpiTrend,
  useEntityKpis,
} from "@/presentation/parts/hooks/use-entity-kpis.hook"
import { FormatCount } from "@/presentation/presenters/count.presenter"
import { FormatCurrency } from "@/presentation/presenters/currency.presenter"
import type { PortfolioPerformanceResponseDTO } from "@/services/portfolio-performance/dto/portfolio-performance-response.dto"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"

import { PORTFOLIO_KPI } from "../settings/labels.settings"
import type { PortfolioRowSummary } from "../types/portfolio-list.types"

interface UsePortfolioKpisInput {
  portfolios: PortfolioResponseDTO[]
  performanceFor: (
    portfolioId: string
  ) => PortfolioPerformanceResponseDTO | null
  summaries: Record<string, PortfolioRowSummary> | null
}

// Resolves a numeric snapshot field to a finite amount.
function ToAmount(value: string | null | undefined): number {
  if (value === null || value === undefined) return 0
  const PARSED = Number.parseFloat(value)
  return Number.isFinite(PARSED) ? PARSED : 0
}

/**
 * @summary
 * Builds the data-driven KPI cards of the portfolio list.
 *
 * @remarks
 * Sums the patrimony and the earnings of the latest
 * snapshot of every portfolio, derives the trend badges
 * from the weighted daily return and the earnings ratio,
 * and tallies the portfolio and fund counts. All values
 * are formatted through the presenter files.
 *
 * @param portfolios - The rows of the portfolio list.
 * @param performanceFor - Resolves the range snapshot.
 * @param summaries - The derived per-row tallies.
 *
 * @returns The KPI card props.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function BuildPortfolioKpis(
  portfolios: readonly PortfolioResponseDTO[],
  performanceFor: (
    portfolioId: string
  ) => PortfolioPerformanceResponseDTO | null,
  summaries: Record<string, PortfolioRowSummary> | null
): EntityKpi[] {
  const SNAPSHOTS = portfolios
    .map((portfolio) => performanceFor(portfolio.id))
    .filter(
      (snapshot): snapshot is PortfolioPerformanceResponseDTO =>
        snapshot !== null
    )

  const TOTAL_PATRIMONY = SNAPSHOTS.reduce(
    (sum, snapshot) => sum + ToAmount(snapshot.patrimony),
    0
  )

  const TOTAL_EARNINGS = SNAPSHOTS.reduce(
    (sum, snapshot) => sum + ToAmount(snapshot.earnings),
    0
  )

  const WEIGHTED_RETURN =
    TOTAL_PATRIMONY > 0
      ? SNAPSHOTS.reduce(
          (sum, snapshot) =>
            sum +
            ToAmount(snapshot.patrimony) *
              ToAmount(snapshot.returnDaily),
          0
        ) / TOTAL_PATRIMONY
      : null

  const EARNINGS_RATIO =
    TOTAL_PATRIMONY > 0 ? TOTAL_EARNINGS / TOTAL_PATRIMONY : null

  const TOTAL_FUNDS = Object.values(summaries ?? {}).reduce(
    (sum, summary) => sum + summary.fundCount,
    0
  )

  const PATRIMONY_TREND = ResolveEntityKpiTrend(WEIGHTED_RETURN)
  const EARNINGS_TREND = ResolveEntityKpiTrend(EARNINGS_RATIO)

  return [
    {
      key: "patrimony",
      title: PORTFOLIO_KPI.TOTAL_PATRIMONY_TITLE,
      value: FormatCurrency(TOTAL_PATRIMONY),
      trend: PATRIMONY_TREND.trend,
      comparison: PORTFOLIO_KPI.TOTAL_PATRIMONY_COMPARISON,
      dotIndicator: PATRIMONY_TREND.dotIndicator,
      icon: PATRIMONY_TREND.icon,
    },
    {
      key: "earnings",
      title: PORTFOLIO_KPI.TOTAL_EARNINGS_TITLE,
      value: FormatCurrency(TOTAL_EARNINGS),
      trend: EARNINGS_TREND.trend,
      comparison: PORTFOLIO_KPI.TOTAL_EARNINGS_COMPARISON,
      dotIndicator: EARNINGS_TREND.dotIndicator,
      icon: EARNINGS_TREND.icon,
    },
    {
      key: "portfolios",
      title: PORTFOLIO_KPI.PORTFOLIO_COUNT_TITLE,
      value: FormatCount(portfolios.length),
      comparison: PORTFOLIO_KPI.PORTFOLIO_COUNT_COMPARISON,
    },
    {
      key: "funds",
      title: PORTFOLIO_KPI.FUND_COUNT_TITLE,
      value: FormatCount(TOTAL_FUNDS),
      comparison: PORTFOLIO_KPI.FUND_COUNT_COMPARISON,
    },
  ]
}

/**
 * @summary
 * Resolves the KPI cards of the portfolio list.
 *
 * @remarks
 * Delegates the computation to `BuildPortfolioKpis` and
 * the memoization to the shared entity KPI hook.
 *
 * @param input - The rows, the snapshot resolver and the
 * derived per-row tallies.
 *
 * @returns The KPI card props.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function usePortfolioKpis({
  portfolios,
  performanceFor,
  summaries,
}: UsePortfolioKpisInput): EntityKpi[] {
  const compute = useCallback(
    (items: readonly PortfolioResponseDTO[]) =>
      BuildPortfolioKpis(items, performanceFor, summaries),
    [performanceFor, summaries]
  )

  return useEntityKpis({
    items: portfolios,
    compute,
  })
}

export { usePortfolioKpis }
