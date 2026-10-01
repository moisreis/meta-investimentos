"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import type { DateRange } from "react-day-picker"

import type { PortfolioPeriodReturns } from "@/presentation/types/portfolio-period-returns.types"
import type { EntitySummary } from "@/presentation/parts/components/entity-detail-summary"

import { getPortfolioPeriodReturnsAction } from "../actions/get-portfolio-period-returns.action"
import { FilterPortfolioActivity } from "../helpers/filter-portfolio-activity.helper"
import { BuildPortfolioChartSections } from "../helpers/build-portfolio-chart-sections.helper"
import { BuildPortfolioSummary } from "../helpers/build-portfolio-summary.helper"
import type { PortfolioOverviewData } from "../types/portfolio-overview.types"
import type { PortfolioChartSection } from "../types/portfolio-chart-section.types"
import type { PortfolioActivityRow } from "@/presentation/types/portfolio-activity-row.types"

// Returns rendered before the server resolves the window.
const EMPTY_PERIOD_RETURNS: PortfolioPeriodReturns = {
  yearReturn: null,
  monthReturn: null,
  periodReturn: null,
}

// Builds a local-midnight date from a UTC day key.
function FromUtcDayKey(key: string): Date {
  const [YEAR, MONTH, DAY] = key.split("-").map(Number)
  return new Date(YEAR, MONTH - 1, DAY)
}

// Extracts the UTC day key of a date.
function ToUtcDayKey(date: Date): string {
  return date.toISOString().slice(0, 10)
}

// Builds the initial range covering every snapshot day.
function BuildInitialRange(
  keys: string[]
): DateRange | undefined {
  if (keys.length === 0) return undefined
  return {
    from: FromUtcDayKey(keys[0]),
    to: FromUtcDayKey(keys[keys.length - 1]),
  }
}

interface UsePortfolioOverviewOutput {
  // The selected analysis window.
  dateRange: DateRange | undefined
  // Reports the next selection of the window.
  onDateRangeChange: (range: DateRange | undefined) => void
  // Matches the calendar days holding a snapshot.
  isPerformanceDay: (date: Date) => boolean
  // The opening block of the screen: the closing balance of
  // the window, its return and the figures reconciling the
  // opening balance with the closing one. Null when the
  // series holds no snapshot.
  summary: EntitySummary | null
  // The charts of the detail screen, grouped into titled
  // sections: the performance series clamped to the same
  // window as the summary, and the distributions, the checking
  // accounts and the annual monthly history, which describe
  // the portfolio as it is today and are not window-clamped.
  chartSections: PortfolioChartSection[]
  // The activity rows inside the selected window, newest
  // first, fed to the recent activity datatable.
  activityRows: PortfolioActivityRow[]
}

/**
 * @summary
 * Coordinates the portfolio detail screen filters.
 *
 * @remarks
 * Owns the date range and narrows the summary to the selected
 * window. The range starts covering the full span of available
 * snapshot days and every change refetches the chained returns
 * through the server action, then rebuilds the summary and the
 * chart models through their pure builders, both clamped to
 * the same window. The returns stay in a request-keyed cache
 * so moving back to a window already seen does not refetch,
 * and a slow response can never overwrite a newer one.
 * `isPerformanceDay` reports whether the portfolio holds a
 * snapshot on the given calendar day, so the date range
 * filter can keep only those days enabled.
 *
 * @param data - The performance series and its day index.
 *
 * @returns The filter state, the day matcher, the summary and
 *   the chart models.
 *
 * @example
 * const OVERVIEW = usePortfolioOverview(DATA);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function usePortfolioOverview(
  data: PortfolioOverviewData
): UsePortfolioOverviewOutput {
  const [DATE_RANGE, setDateRange] = useState<
    DateRange | undefined
  >(() => BuildInitialRange(data.availableDates))

  const AVAILABLE_KEYS = useMemo(
    () => new Set(data.availableDates),
    [data.availableDates]
  )

  const [RETURNS_CACHE, setReturnsCache] = useState<
    Record<string, PortfolioPeriodReturns>
  >({})

  const PERIOD_RETURNS = ResolveCachedReturns(
    RETURNS_CACHE,
    data.portfolioId,
    DATE_RANGE
  )

  const REQUEST_ID = useRef(0)

  useEffect(() => {
    const FROM = DATE_RANGE?.from
    const TO = DATE_RANGE?.to
    const REQUEST = ++REQUEST_ID.current

    if (!data.portfolioId || !FROM || !TO) return
    if (
      RETURNS_CACHE[BuildRangeKey(data.portfolioId, FROM, TO)]
    ) {
      return
    }

    getPortfolioPeriodReturnsAction({
      portfolioId: data.portfolioId,
      from: ToUtcDayKey(FROM),
      to: ToUtcDayKey(TO),
    }).then((RESULT) => {
      if (REQUEST !== REQUEST_ID.current || !RESULT.success)
        return
      setReturnsCache((CACHE) => ({
        ...CACHE,
        [BuildRangeKey(data.portfolioId, FROM, TO)]: RESULT.data,
      }))
    })
  }, [data.portfolioId, DATE_RANGE, RETURNS_CACHE])

  const isPerformanceDay = useCallback(
    (date: Date) => AVAILABLE_KEYS.has(ToUtcDayKey(date)),
    [AVAILABLE_KEYS]
  )

  const SUMMARY = useMemo(
    () =>
      BuildPortfolioSummary(
        data.performances,
        DATE_RANGE,
        PERIOD_RETURNS
      ),
    [data.performances, DATE_RANGE, PERIOD_RETURNS]
  )

  // The charts are clamped by the same period window the
  // summary is, so a plotted point can never fall outside the
  // window the numbers above it describe. The distributions,
  // the checking balances and the annual monthly history
  // follow in their own sections, but they are not clamped: a
  // holding and a balance are facts about the portfolio today,
  // and the year is a fixed horizon, so narrowing the range
  // must not re-slice the money or the months.
  const CURRENT_YEAR = useMemo(
    () => new Date().getUTCFullYear(),
    []
  )

  const CHART_SECTIONS = useMemo(
    () =>
      BuildPortfolioChartSections({
        performances: data.performances,
        holdings: data.holdings,
        bankAccounts: data.bankAccounts,
        balances: data.balances,
        dateRange: DATE_RANGE,
        year: CURRENT_YEAR,
      }),
    [
      data.performances,
      data.holdings,
      data.bankAccounts,
      data.balances,
      DATE_RANGE,
      CURRENT_YEAR,
    ]
  )

  // The activity is clamped to the same window as the summary
  // and the performance charts, so the table always describes
  // the movements behind the numbers above it.
  const ACTIVITY_ROWS = useMemo(
    () => FilterPortfolioActivity(data.activity, DATE_RANGE),
    [data.activity, DATE_RANGE]
  )

  return {
    dateRange: DATE_RANGE,
    onDateRangeChange: setDateRange,
    isPerformanceDay,
    summary: SUMMARY,
    chartSections: CHART_SECTIONS,
    activityRows: ACTIVITY_ROWS,
  }
}

// Identifies a window, so its returns are fetched once.
function BuildRangeKey(
  portfolioId: string,
  from: Date,
  to: Date
): string {
  return `${portfolioId}:${ToUtcDayKey(from)}:${ToUtcDayKey(to)}`
}

// Reads the returns of the window from the cache, falling
// back to the neutral payload while the server resolves it.
function ResolveCachedReturns(
  cache: Record<string, PortfolioPeriodReturns>,
  portfolioId: string,
  dateRange: DateRange | undefined
): PortfolioPeriodReturns {
  const FROM = dateRange?.from
  const TO = dateRange?.to

  if (!portfolioId || !FROM || !TO) return EMPTY_PERIOD_RETURNS

  return (
    cache[BuildRangeKey(portfolioId, FROM, TO)] ??
    EMPTY_PERIOD_RETURNS
  )
}

export { usePortfolioOverview }
