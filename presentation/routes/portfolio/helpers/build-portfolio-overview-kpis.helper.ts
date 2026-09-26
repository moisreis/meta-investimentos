import type { ComponentType } from "react"
import {
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react"
import type { DateRange } from "react-day-picker"

import {
  ResolvePeriodWindow,
  SumSeriesEarnings,
} from "@/services/portfolio-performance/calculators/period-window.calculator"
import type { PortfolioPeriodReturnsDTO } from "@/services/portfolio-performance/use-cases/resolve-portfolio-period-returns.use-case"
import type { KpiDotIndicator } from "@/presentation/parts/components/entity-datatable-kpi-card"
import type { EntityKpi } from "@/presentation/parts/hooks/use-entity-kpis.hook"
import { ResolveEntityKpiTrend } from "@/presentation/parts/hooks/use-entity-kpis.hook"
import { FormatCurrency } from "@/presentation/presenters/currency.presenter"
import { FormatPercentage } from "@/presentation/presenters/percentage.presenter"
import type { PortfolioPerformanceResponseDTO } from "@/services/portfolio-performance/dto/portfolio-performance-response.dto"

import { PORTFOLIO_OVERVIEW } from "../settings/labels.settings"

// Parses a numeric snapshot field to a finite amount.
function ToAmount(value: string | null | undefined): number {
  if (value === null || value === undefined) return 0
  const PARSED = Number.parseFloat(value)
  return Number.isFinite(PARSED) ? PARSED : 0
}

// Formats a timestamp as a `dd/mm/yyyy` UTC day.
function FormatUtcDate(time: number): string {
  const DATE = new Date(time)
  const DAY = String(DATE.getUTCDate()).padStart(2, "0")
  const MONTH = String(DATE.getUTCMonth() + 1).padStart(2, "0")
  return `${DAY}/${MONTH}/${DATE.getUTCFullYear()}`
}

// Formats a year and month pair in Brazilian Portuguese.
function FormatMonthYear(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date)
}

// Resolves the sign badge and the icon of a ratio.
function SignBadge(ratio: string | number): {
  dotIndicator: KpiDotIndicator
  icon: ComponentType<{ size?: number; stroke?: number }>
} {
  const POSITIVE =
    ToAmount(
      typeof ratio === "number" ? String(ratio) : ratio
    ) >= 0
  return {
    dotIndicator: POSITIVE ? "success" : "negative",
    icon: POSITIVE ? IconTrendingUp : IconTrendingDown,
  }
}

/**
 * @summary
 * Builds the data-driven KPI cards of the portfolio
 * detail screen.
 *
 * @remarks
 * Clamps the snapshot series to the selected `[from, to]`
 * window through the shared period window calculator and
 * derives the five cards from real registry data: the
 * end-of-window patrimony with the patrimony delta against
 * the opening snapshot, the year and month gains
 * accumulated from the sum of the daily earnings inside the
 * window, and the year and month returns. The returns are
 * not computed here: they arrive already chained by the
 * server, so the domain return formula never reaches the
 * browser. Boundaries follow the UTC day key convention of
 * the registry filters.
 *
 * @explanation
 * Use this helper from the overview hook. The window is
 * shared with the period return use case, so a card label
 * and its value can never drift apart.
 *
 * @param performances - The daily snapshots of the
 *   portfolio, not necessarily ordered.
 * @param dateRange - The selected window. Days fall back
 *   to the earliest and latest snapshot when omitted.
 * @param periodReturns - The returns the server already
 *   chained for the same window.
 *
 * @returns The KPI card props, or an empty array when
 *   the series has no snapshot.
 *
 * @example
 * const KPIS = BuildPortfolioOverviewKpis(
 *   PERFORMANCES,
 *   { from: START, to: END },
 *   PERIOD_RETURNS
 * );
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function BuildPortfolioOverviewKpis(
  performances: readonly PortfolioPerformanceResponseDTO[],
  dateRange: DateRange | undefined,
  periodReturns: PortfolioPeriodReturnsDTO
): EntityKpi[] {
  if (performances.length === 0) return []

  const WINDOW = ResolvePeriodWindow(
    performances,
    dateRange?.from ?? null,
    dateRange?.to ?? null
  )

  const { end: END, opening: OPENING } = WINDOW

  const YEAR_GAIN = SumSeriesEarnings(WINDOW.yearSeries)
  const MONTH_GAIN = SumSeriesEarnings(WINDOW.monthSeries)

  const YEAR_RETURN = periodReturns.yearReturn
  const MONTH_RETURN = periodReturns.monthReturn

  const PATRIMONY_DELTA =
    END && OPENING
      ? (ToAmount(END.patrimony) - ToAmount(OPENING.patrimony)) /
        ToAmount(OPENING.patrimony)
      : null

  const PATRIMONY_TREND = ResolveEntityKpiTrend(PATRIMONY_DELTA)
  const YEAR_GAIN_BADGE = END ? SignBadge(YEAR_GAIN) : null
  const MONTH_GAIN_BADGE = END ? SignBadge(MONTH_GAIN) : null
  const YEAR_RETURN_BADGE =
    END && YEAR_RETURN !== null ? SignBadge(YEAR_RETURN) : null
  const MONTH_RETURN_BADGE =
    END && MONTH_RETURN !== null ? SignBadge(MONTH_RETURN) : null

  const OPENING_COMPARISON = OPENING
    ? `${PORTFOLIO_OVERVIEW.COMPARISON_VS} ${FormatUtcDate(
        new Date(OPENING.date).getTime()
      )}`
    : undefined

  return [
    {
      key: "patrimony",
      title: PORTFOLIO_OVERVIEW.KPI_PATRIMONY_TITLE,
      value: FormatCurrency(END ? END.patrimony : null),
      trend: PATRIMONY_TREND.trend,
      comparison: OPENING_COMPARISON,
      dotIndicator: PATRIMONY_TREND.dotIndicator,
      icon: PATRIMONY_TREND.icon,
    },
    {
      key: "year-gain",
      title: PORTFOLIO_OVERVIEW.KPI_YEAR_GAIN_TITLE,
      value: FormatCurrency(END ? YEAR_GAIN : null),
      comparison: END
        ? `${PORTFOLIO_OVERVIEW.COMPARISON_SINCE} ${FormatUtcDate(
            WINDOW.yearAnchor
          )}`
        : undefined,
      dotIndicator: YEAR_GAIN_BADGE?.dotIndicator,
      icon: YEAR_GAIN_BADGE?.icon,
    },
    {
      key: "month-gain",
      title: PORTFOLIO_OVERVIEW.KPI_MONTH_GAIN_TITLE,
      value: FormatCurrency(END ? MONTH_GAIN : null),
      comparison: END
        ? `${PORTFOLIO_OVERVIEW.COMPARISON_SINCE} ${FormatUtcDate(
            WINDOW.monthAnchor
          )}`
        : undefined,
      dotIndicator: MONTH_GAIN_BADGE?.dotIndicator,
      icon: MONTH_GAIN_BADGE?.icon,
    },
    {
      key: "year-return",
      title: PORTFOLIO_OVERVIEW.KPI_YEAR_RETURN_TITLE,
      value: FormatPercentage(YEAR_RETURN),
      comparison: END
        ? WINDOW.yearAnchor === WINDOW.yearStart
          ? `${PORTFOLIO_OVERVIEW.COMPARISON_YEAR} ${new Date(
              WINDOW.yearStart
            ).getUTCFullYear()}`
          : `${PORTFOLIO_OVERVIEW.COMPARISON_SINCE} ${FormatUtcDate(
              WINDOW.yearAnchor
            )}`
        : undefined,
      dotIndicator: YEAR_RETURN_BADGE?.dotIndicator,
      icon: YEAR_RETURN_BADGE?.icon,
    },
    {
      key: "month-return",
      title: PORTFOLIO_OVERVIEW.KPI_MONTH_RETURN_TITLE,
      value: FormatPercentage(MONTH_RETURN),
      comparison: END
        ? WINDOW.monthAnchor === WINDOW.monthStart
          ? `${PORTFOLIO_OVERVIEW.COMPARISON_MONTH} ${FormatMonthYear(
              new Date(WINDOW.monthStart)
            )}`
          : `${PORTFOLIO_OVERVIEW.COMPARISON_SINCE} ${FormatUtcDate(
              WINDOW.monthAnchor
            )}`
        : undefined,
      dotIndicator: MONTH_RETURN_BADGE?.dotIndicator,
      icon: MONTH_RETURN_BADGE?.icon,
    },
  ]
}
