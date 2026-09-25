"use client"

import type { ComponentType } from "react"
import { useMemo } from "react"
import {
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react"

import type { KpiDotIndicator } from "@/presentation/parts/components/entity-datatable-kpi-card"
import { FormatCount } from "@/presentation/presenters/count.presenter"
import { FormatCurrency } from "@/presentation/presenters/currency.presenter"
import { FormatPercentage } from "@/presentation/presenters/percentage.presenter"
import type { PortfolioPerformanceResponseDTO } from "@/services/portfolio-performance/dto/portfolio-performance-response.dto"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"

import { PORTFOLIO_KPI } from "../settings/labels.settings"
import type { PortfolioHoldingsCount } from "../types/portfolio-list.types"

// Props of a portfolio KPI card.
export interface PortfolioKpi {
  key: string
  title: string
  value: string
  trend?: string
  comparison?: string
  dotIndicator?: KpiDotIndicator
  icon?: ComponentType<{ size?: number; stroke?: number }>
}

interface UsePortfolioKpisInput {
  portfolios: PortfolioResponseDTO[]
  performanceFor: (
    portfolioId: string
  ) => PortfolioPerformanceResponseDTO | null
  holdingsCounts: Record<string, PortfolioHoldingsCount> | null
}

// Resolves a numeric snapshot field to a finite amount.
function ToAmount(value: string | null | undefined): number {
  if (value === null || value === undefined) return 0
  const PARSED = Number.parseFloat(value)
  return Number.isFinite(PARSED) ? PARSED : 0
}

// Formats a ratio with an explicit sign for the badge.
function FormatKpiTrend(ratio: number): string {
  if (ratio === 0) return "+ 0,00%"
  const SIGN = ratio < 0 ? "-" : "+"
  return `${SIGN} ${FormatPercentage(Math.abs(ratio))}`
}

// Resolves the trend badge data from a nullable ratio.
function ResolveTrend(ratio: number | null): {
  trend: string | undefined
  dotIndicator: KpiDotIndicator | undefined
  icon:
    ComponentType<{ size?: number; stroke?: number }> | undefined
} {
  if (ratio === null || !Number.isFinite(ratio)) {
    return {
      trend: undefined,
      dotIndicator: undefined,
      icon: undefined,
    }
  }

  const POSITIVE = ratio >= 0

  return {
    trend: FormatKpiTrend(ratio),
    dotIndicator: POSITIVE ? "success" : "negative",
    icon: POSITIVE ? IconTrendingUp : IconTrendingDown,
  }
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
 * @param input - The rows, the snapshot resolver and the
 * derived holdings tallies.
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
  holdingsCounts,
}: UsePortfolioKpisInput): PortfolioKpi[] {
  return useMemo(() => {
    const SNAPSHOTS = portfolios
      .map((portfolio) => performanceFor(portfolio.id))
      .filter(
        (
          snapshot
        ): snapshot is PortfolioPerformanceResponseDTO =>
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
      TOTAL_PATRIMONY > 0
        ? TOTAL_EARNINGS / TOTAL_PATRIMONY
        : null

    const TOTAL_FUNDS = Object.values(
      holdingsCounts ?? {}
    ).reduce((sum, count) => sum + count.fundCount, 0)

    const PATRIMONY_TREND = ResolveTrend(WEIGHTED_RETURN)
    const EARNINGS_TREND = ResolveTrend(EARNINGS_RATIO)

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
  }, [holdingsCounts, performanceFor, portfolios])
}

export { usePortfolioKpis }
