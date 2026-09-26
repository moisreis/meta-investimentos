import type { ComponentType } from "react"
import {
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react"
import type { DateRange } from "react-day-picker"

import { calculatePortfolioReturn } from "@domain/portfolio/calculators/return.calculator"
import { GrowthFactor } from "@/value-objects"
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

// Starts the UTC day of the provided date, in millis.
function StartOfUtcDay(date: Date): number {
  return Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  )
}

// Ends the UTC day of the provided date, in millis.
function EndOfUtcDay(date: Date): number {
  return StartOfUtcDay(date) + 86_400_000 - 1
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
function SignBadge(ratio: number): {
  dotIndicator: KpiDotIndicator
  icon: ComponentType<{ size?: number; stroke?: number }>
} {
  const POSITIVE = ratio >= 0
  return {
    dotIndicator: POSITIVE ? "success" : "negative",
    icon: POSITIVE ? IconTrendingUp : IconTrendingDown,
  }
}

// Chains the daily returns of a series into a period
// return, falling back to the stored trailing return.
function ResolvePeriodReturn(
  series: readonly PortfolioPerformanceResponseDTO[],
  stored: string | null
): number | null {
  const FACTORS: { value: GrowthFactor }[] = []

  for (const snapshot of series) {
    const FACTOR_VALUE = 1 + ToAmount(snapshot.returnDaily) / 100
    if (!Number.isFinite(FACTOR_VALUE) || FACTOR_VALUE < 0) {
      continue
    }
    FACTORS.push({ value: GrowthFactor.create(FACTOR_VALUE) })
  }

  if (FACTORS.length >= 2) {
    return calculatePortfolioReturn({
      dailyGrowthFactors: FACTORS,
    }).value.toNumber()
  }

  return stored === null ? null : ToAmount(stored)
}

/**
 * @summary
 * Builds the data-driven KPI cards of the portfolio
 * detail screen.
 *
 * @remarks
 * Clamps the snapshot series to the selected `[from, to]`
 * window and derives the five cards from real registry
 * data: the end-of-window patrimony with the patrimony
 * delta against the opening snapshot, the year and month
 * gains accumulated from the sum of the daily earnings
 * inside the window, and the year and month returns
 * chained from the daily growth factors through the
 * domain return calculator. When a horizon holds fewer
 * than two snapshots the stored trailing return of the
 * closing snapshot is used as fallback. Boundaries follow
 * the UTC day key convention of the registry filters.
 *
 * @param performances - The daily snapshots of the
 *   portfolio, not necessarily ordered.
 * @param dateRange - The selected window. Days fall back
 *   to the earliest and latest snapshot when omitted.
 *
 * @returns The KPI card props, or an empty array when
 *   the series has no snapshot.
 *
 * @example
 * const KPIS = BuildPortfolioOverviewKpis(
 *   PERFORMANCES,
 *   { from: START, to: END }
 * );
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function BuildPortfolioOverviewKpis(
  performances: readonly PortfolioPerformanceResponseDTO[],
  dateRange: DateRange | undefined
): EntityKpi[] {
  if (performances.length === 0) return []

  const SNAPSHOTS = [...performances].sort((left, right) =>
    left.date.localeCompare(right.date)
  )

  const FIRST_TIME = new Date(SNAPSHOTS[0].date).getTime()
  const LAST_TIME = new Date(
    SNAPSHOTS[SNAPSHOTS.length - 1].date
  ).getTime()

  const FROM_TIME = dateRange?.from
    ? StartOfUtcDay(dateRange.from)
    : FIRST_TIME
  const TO_TIME = dateRange?.to
    ? EndOfUtcDay(dateRange.to)
    : LAST_TIME

  const IN_WINDOW = SNAPSHOTS.filter((snapshot) => {
    const TIME = new Date(snapshot.date).getTime()
    return TIME >= FROM_TIME && TIME <= TO_TIME
  })

  const END = IN_WINDOW[IN_WINDOW.length - 1] ?? null

  let OPENING: PortfolioPerformanceResponseDTO | null = null
  for (
    let INDEX = SNAPSHOTS.length - 1;
    INDEX >= 0;
    INDEX -= 1
  ) {
    const SNAPSHOT = SNAPSHOTS[INDEX]
    if (new Date(SNAPSHOT.date).getTime() < FROM_TIME) {
      OPENING = SNAPSHOT
      break
    }
  }

  const END_DATE = END ? new Date(END.date) : null
  const END_YEAR = END_DATE?.getUTCFullYear() ?? 0
  const END_MONTH = END_DATE?.getUTCMonth() ?? 0

  const YEAR_START_TIME = Date.UTC(END_YEAR, 0, 1)
  const MONTH_START_TIME = Date.UTC(END_YEAR, END_MONTH, 1)

  const YEAR_ANCHOR = Math.max(FROM_TIME, YEAR_START_TIME)
  const MONTH_ANCHOR = Math.max(FROM_TIME, MONTH_START_TIME)

  const YEAR_SERIES = IN_WINDOW.filter(
    (snapshot) =>
      new Date(snapshot.date).getTime() >= YEAR_ANCHOR
  )
  const MONTH_SERIES = IN_WINDOW.filter(
    (snapshot) =>
      new Date(snapshot.date).getTime() >= MONTH_ANCHOR
  )

  const YEAR_GAIN = YEAR_SERIES.reduce(
    (sum, snapshot) => sum + ToAmount(snapshot.earnings),
    0
  )
  const MONTH_GAIN = MONTH_SERIES.reduce(
    (sum, snapshot) => sum + ToAmount(snapshot.earnings),
    0
  )

  const YEAR_RETURN = ResolvePeriodReturn(
    YEAR_SERIES,
    END?.returnYearly ?? null
  )
  const MONTH_RETURN = ResolvePeriodReturn(
    MONTH_SERIES,
    END?.returnMonthly ?? null
  )

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
            YEAR_ANCHOR
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
            MONTH_ANCHOR
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
        ? YEAR_ANCHOR === YEAR_START_TIME
          ? `${PORTFOLIO_OVERVIEW.COMPARISON_YEAR} ${END_YEAR}`
          : `${PORTFOLIO_OVERVIEW.COMPARISON_SINCE} ${FormatUtcDate(
              YEAR_ANCHOR
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
        ? MONTH_ANCHOR === MONTH_START_TIME
          ? `${PORTFOLIO_OVERVIEW.COMPARISON_MONTH} ${FormatMonthYear(
              new Date(MONTH_START_TIME)
            )}`
          : `${PORTFOLIO_OVERVIEW.COMPARISON_SINCE} ${FormatUtcDate(
              MONTH_ANCHOR
            )}`
        : undefined,
      dotIndicator: MONTH_RETURN_BADGE?.dotIndicator,
      icon: MONTH_RETURN_BADGE?.icon,
    },
  ]
}
