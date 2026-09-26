"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import type { DateRange } from "react-day-picker"

import type { EntityKpi } from "@/presentation/parts/hooks/use-entity-kpis.hook"
import type { PortfolioPeriodReturnsDTO } from "@/services/portfolio-performance/use-cases/resolve-portfolio-period-returns.use-case"

import { getPortfolioPeriodReturnsAction } from "../actions/get-portfolio-period-returns.action"
import { BuildPortfolioOverviewKpis } from "../helpers/build-portfolio-overview-kpis.helper"
import type { PortfolioOverviewData } from "../types/portfolio-overview.types"

// Returns rendered before the server resolves the window.
const EMPTY_PERIOD_RETURNS: PortfolioPeriodReturnsDTO = {
  yearReturn: null,
  monthReturn: null,
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
  // The KPI cards of the detail screen.
  kpis: EntityKpi[]
}

/**
 * @summary
 * Coordinates the portfolio detail screen filters.
 *
 * @remarks
 * Owns the date range and narrows the KPI computation to
 * the selected window. The range starts covering the full
 * span of available snapshot days and every change refetches
 * the chained year and month returns through the server
 * action, then rebuilds the KPI cards through the pure
 * overview builder. The returns stay in a request-keyed cache
 * so moving back to a window already seen does not refetch,
 * and a slow response can never overwrite a newer one.
 * `isPerformanceDay` reports whether the portfolio holds a
 * snapshot on the given calendar day, so the date range
 * filter can keep only those days enabled.
 *
 * @param data - The performance series and its day index.
 *
 * @returns The filter state, the day matcher and the KPIs.
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
    Record<string, PortfolioPeriodReturnsDTO>
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

  const KPIS = useMemo(
    () =>
      BuildPortfolioOverviewKpis(
        data.performances,
        DATE_RANGE,
        PERIOD_RETURNS
      ),
    [data.performances, DATE_RANGE, PERIOD_RETURNS]
  )

  return {
    dateRange: DATE_RANGE,
    onDateRangeChange: setDateRange,
    isPerformanceDay,
    kpis: KPIS,
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
  cache: Record<string, PortfolioPeriodReturnsDTO>,
  portfolioId: string,
  dateRange: DateRange | undefined
): PortfolioPeriodReturnsDTO {
  const FROM = dateRange?.from
  const TO = dateRange?.to

  if (!portfolioId || !FROM || !TO) return EMPTY_PERIOD_RETURNS

  return (
    cache[BuildRangeKey(portfolioId, FROM, TO)] ??
    EMPTY_PERIOD_RETURNS
  )
}

export { usePortfolioOverview }
