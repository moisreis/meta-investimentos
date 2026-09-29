import type {
  EntityChartModel,
  EntityChartSeries,
} from "@/presentation/parts/charts/types"
import {
  FormatCompactCurrency,
  FormatCurrency,
} from "@/presentation/presenters/currency.presenter"
import { FormatSignedPercentage } from "@/presentation/presenters/percentage.presenter"
import type { PortfolioPerformanceResponseDTO } from "@/services/portfolio-performance/dto/portfolio-performance-response.dto"

import { PORTFOLIO_ANNUAL } from "../settings/labels.settings"

// Keys of the chart container ids, kept stable so the
// generated gradients and the injected colors survive a
// re-render of the same chart.
const EARNINGS_CHART_ID = "portfolio-annual-earnings"
const PATRIMONY_CHART_ID = "portfolio-annual-patrimony"
const RETURN_CHART_ID = "portfolio-annual-return"

// The twelve months of the year, in calendar order.
const MONTH_COUNT = 12

// Parses a numeric snapshot field to a finite amount.
function ToAmount(value: string | null | undefined): number {
  if (value === null || value === undefined) return 0
  const PARSED = Number.parseFloat(value)
  return Number.isFinite(PARSED) ? PARSED : 0
}

// Parses a numeric snapshot field to a finite amount, keeping
// a missing value missing so a month without a return leaves
// a gap in the series instead of dropping it.
function ToNullableAmount(
  value: string | null | undefined
): number | null {
  if (value === null || value === undefined) return null
  const PARSED = Number.parseFloat(value)
  return Number.isFinite(PARSED) ? PARSED : null
}

// Names the month of an index with the short `pt-BR` label,
// so the axis of a twelve-month series stays readable.
function FormatMonthLabel(year: number, monthIndex: number): string {
  return new Intl.DateTimeFormat("pt-BR", {
    month: "short",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, monthIndex, 1)))
}

// Groups the snapshots of a year by calendar month, keeping
// only the months that actually hold a snapshot.
function GroupSnapshotsByMonth(
  performances: readonly PortfolioPerformanceResponseDTO[],
  year: number
): Map<number, PortfolioPerformanceResponseDTO[]> {
  const BY_MONTH = new Map<number, PortfolioPerformanceResponseDTO[]>()

  for (const performance of performances) {
    const DATE = new Date(performance.date)
    if (DATE.getUTCFullYear() !== year) continue

    const MONTH = DATE.getUTCMonth()
    const CURRENT = BY_MONTH.get(MONTH)
    BY_MONTH.set(
      MONTH,
      CURRENT ? [...CURRENT, performance] : [performance]
    )
  }

  for (const [month, snapshots] of BY_MONTH) {
    BY_MONTH.set(
      month,
      [...snapshots].sort((left, right) =>
        left.date.localeCompare(right.date)
      )
    )
  }

  return BY_MONTH
}

// Series of the monthly earnings chart, signed so a month
// that gained reads green and a month that lost reads red.
function BuildEarningsSeries(): EntityChartSeries[] {
  return [
    {
      key: "earnings",
      label: PORTFOLIO_ANNUAL.EARNINGS_SERIES,
      formatValue: FormatCurrency,
      formatTick: FormatCompactCurrency,
      tone: "sign",
    },
  ]
}

// Series of the monthly patrimony chart, in **BRL**.
function BuildPatrimonySeries(): EntityChartSeries[] {
  return [
    {
      key: "patrimony",
      label: PORTFOLIO_ANNUAL.PATRIMONY_SERIES,
      formatValue: FormatCurrency,
      formatTick: FormatCompactCurrency,
    },
  ]
}

// Series of the monthly return chart, in percent units and
// signed by direction.
function BuildReturnSeries(): EntityChartSeries[] {
  return [
    {
      key: "returnMonthly",
      label: PORTFOLIO_ANNUAL.RETURN_SERIES,
      formatValue: FormatSignedPercentage,
      tone: "sign",
    },
  ]
}

/**
 * @summary
 * Builds the monthly earnings chart of the portfolio detail
 * screen.
 *
 * @remarks
 * Sums the daily earnings of each calendar month of the year
 * and plots one column per month, so the reader sees which
 * months of the year the portfolio gained and which it lost.
 * A month with no snapshot keeps a gap, because no recorded
 * earnings cannot be told apart from a zero on this axis.
 *
 * @param byMonth - The snapshots of the year, grouped and
 *   ordered by calendar month.
 *
 * @returns The monthly earnings chart model.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
function BuildMonthlyEarningsChart(
  byMonth: ReadonlyMap<number, PortfolioPerformanceResponseDTO[]>,
  year: number
): EntityChartModel {
  return {
    id: EARNINGS_CHART_ID,
    title: PORTFOLIO_ANNUAL.EARNINGS_TITLE,
    description: PORTFOLIO_ANNUAL.EARNINGS_DESCRIPTION,
    kind: "bar",
    series: BuildEarningsSeries(),
    points: Array.from({ length: MONTH_COUNT }, (_, month) => {
      const SNAPSHOTS = byMonth.get(month)

      return {
        label: FormatMonthLabel(year, month),
        values: {
          earnings:
            SNAPSHOTS && SNAPSHOTS.length > 0
              ? SNAPSHOTS.reduce(
                  (sum, snapshot) =>
                    sum + ToAmount(snapshot.earnings),
                  0
                )
              : null,
        },
      }
    }),
  }
}

/**
 * @summary
 * Builds the monthly patrimony chart of the portfolio detail
 * screen.
 *
 * @remarks
 * Plots the closing patrimony of each calendar month of the
 * year as a filled area, so the reader sees the size of the
 * portfolio settle month by month. A month with no snapshot
 * keeps a gap, because the closing value of a month the
 * portfolio was not measured in cannot be invented.
 *
 * @param byMonth - The snapshots of the year, grouped and
 *   ordered by calendar month.
 *
 * @returns The monthly patrimony chart model.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
function BuildMonthlyPatrimonyChart(
  byMonth: ReadonlyMap<number, PortfolioPerformanceResponseDTO[]>,
  year: number
): EntityChartModel {
  return {
    id: PATRIMONY_CHART_ID,
    title: PORTFOLIO_ANNUAL.PATRIMONY_TITLE,
    description: PORTFOLIO_ANNUAL.PATRIMONY_DESCRIPTION,
    kind: "area",
    series: BuildPatrimonySeries(),
    points: Array.from({ length: MONTH_COUNT }, (_, month) => {
      const CLOSING = ReadClosingSnapshot(byMonth, month)

      return {
        label: FormatMonthLabel(year, month),
        values: {
          patrimony: CLOSING
            ? ToNullableAmount(CLOSING.patrimony)
            : null,
        },
      }
    }),
  }
}

/**
 * @summary
 * Builds the monthly return chart of the portfolio detail
 * screen.
 *
 * @remarks
 * Plots the accumulated month return carried by the closing
 * snapshot of each calendar month of the year, signed by
 * direction, so the reader sees which months carried the
 * year. A month with no closing return keeps a gap, because
 * the horizon needs at least two snapshots to chain.
 *
 * @param byMonth - The snapshots of the year, grouped and
 *   ordered by calendar month.
 *
 * @returns The monthly return chart model.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
function BuildMonthlyReturnChart(
  byMonth: ReadonlyMap<number, PortfolioPerformanceResponseDTO[]>,
  year: number
): EntityChartModel {
  return {
    id: RETURN_CHART_ID,
    title: PORTFOLIO_ANNUAL.RETURN_TITLE,
    description: PORTFOLIO_ANNUAL.RETURN_DESCRIPTION,
    kind: "bar",
    series: BuildReturnSeries(),
    points: Array.from({ length: MONTH_COUNT }, (_, month) => {
      const CLOSING = ReadClosingSnapshot(byMonth, month)

      return {
        label: FormatMonthLabel(year, month),
        values: {
          returnMonthly: CLOSING
            ? ToNullableAmount(CLOSING.returnMonthly)
            : null,
        },
      }
    }),
  }
}

// Reads the last snapshot of a month, or `null` when the
// month holds no snapshot.
function ReadClosingSnapshot(
  byMonth: ReadonlyMap<number, PortfolioPerformanceResponseDTO[]>,
  month: number
): PortfolioPerformanceResponseDTO | null {
  const SNAPSHOTS = byMonth.get(month)
  if (!SNAPSHOTS || SNAPSHOTS.length === 0) return null
  return SNAPSHOTS[SNAPSHOTS.length - 1]
}

/**
 * @summary
 * Builds the annual monthly charts of the portfolio detail
 * screen.
 *
 * @remarks
 * Derives the monthly earnings, patrimony and return of a
 * calendar year from the daily snapshots of the portfolio.
 * Every chart plots the same twelve month slots — from
 * January to December — so the months of the year line up
 * across the three charts, and a month without a snapshot
 * keeps a gap on every one of them. The three charts are
 * independent of the selected window: the year is a fixed
 * horizon, so narrowing the date range must not change what
 * a month of the year reports.
 *
 * Returns an empty array when the year holds no snapshot, so
 * the screen shows no annual section at all instead of a row
 * of empty frames.
 *
 * @explanation
 * Use this helper from the overview hook, passing the current
 * UTC year. It is pure, so the models can be asserted without
 * a browser and a monthly chart can be added later by adding
 * one builder and one entry here.
 *
 * @param performances - The daily snapshots of the
 *   portfolio, in any order.
 * @param year - The calendar year the charts describe.
 *
 * @returns The annual chart models, in render order.
 *
 * @example
 * const MODELS = BuildPortfolioAnnualCharts(PERFORMANCES, YEAR);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export function BuildPortfolioAnnualCharts(
  performances: readonly PortfolioPerformanceResponseDTO[],
  year: number
): EntityChartModel[] {
  const BY_MONTH = GroupSnapshotsByMonth(performances, year)

  if (BY_MONTH.size === 0) return []

  return [
    BuildMonthlyEarningsChart(BY_MONTH, year),
    BuildMonthlyPatrimonyChart(BY_MONTH, year),
    BuildMonthlyReturnChart(BY_MONTH, year),
  ]
}