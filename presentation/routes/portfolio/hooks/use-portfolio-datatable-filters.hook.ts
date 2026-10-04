"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { type DateRange } from "react-day-picker"

import type { PortfolioRow } from "@/presentation/types/portfolio-row.types"
import type { PortfolioPerformanceRow } from "@/presentation/types/portfolio-performance-row.types"

import { listPortfolioPerformancesAction } from "../actions/list-portfolio-performances.action"

// Builds a local-midnight date from a UTC day key.
function FromUtcDayKey(key: string): Date {
  const [YEAR, MONTH, DAY] = key.split("-").map(Number)
  return new Date(YEAR, MONTH - 1, DAY)
}

// Extracts the UTC day key of a date.
function ToUtcDayKey(date: Date): string {
  return date.toISOString().slice(0, 10)
}

// Builds the initial range covering every available day.
function BuildInitialRange(
  keys: string[]
): DateRange | undefined {
  if (keys.length === 0) return undefined
  return {
    from: FromUtcDayKey(keys[0]),
    to: FromUtcDayKey(keys[keys.length - 1]),
  }
}

// Indexes snapshots by their portfolio id.
function BuildPerformanceIndex(
  snapshots: PortfolioPerformanceRow[]
): Record<string, PortfolioPerformanceRow | undefined> {
  return Object.fromEntries(
    snapshots.map((snapshot) => [snapshot.portfolioId, snapshot])
  )
}

interface UsePortfolioDatatableFiltersOutput {
  query: string
  onQueryChange: (query: string) => void
  range: DateRange | undefined
  onRangeChange: (range: DateRange | undefined) => void
  isPerformanceDay: (date: Date) => boolean
  performanceFor: (
    portfolioId: string
  ) => PortfolioPerformanceRow | null
  filteredPortfolios: PortfolioRow[]
}

/**
 * @summary
 * Coordinates the portfolio datatable filters.
 *
 * @remarks
 * Owns the search query, the selected date range and the
 * performance index loaded for that range. The range starts
 * covering the full span of available days; every change
 * refetches the latest snapshot per portfolio through the
 * server action. `isPerformanceDay` reports whether any
 * portfolio has a registry on the given calendar day, so
 * the date range filter can keep only those days enabled.
 * Rows are narrowed by the name query before the table
 * receives them.
 *
 * @param portfolios - The rows rendered by the datatable.
 * @param availableDates - UTC day keys with registries.
 *
 * @returns The filter state and derived data.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function usePortfolioDatatableFilters(
  portfolios: PortfolioRow[],
  availableDates: string[]
): UsePortfolioDatatableFiltersOutput {
  const [QUERY, setQuery] = useState("")

  const AVAILABLE_KEYS = useMemo(
    () => new Set(availableDates),
    [availableDates]
  )

  const [RANGE, setRange] = useState<DateRange | undefined>(() =>
    BuildInitialRange(availableDates)
  )

  const [PERFORMANCES, setPerformances] = useState<
    Record<string, PortfolioPerformanceRow | undefined>
  >({})

  const REQUEST_ID = useRef(0)

  useEffect(() => {
    const FROM = RANGE?.from
    const TO = RANGE?.to
    const REQUEST = ++REQUEST_ID.current

    if (!FROM || !TO) return

    listPortfolioPerformancesAction({
      from: ToUtcDayKey(FROM),
      to: ToUtcDayKey(TO),
    }).then((RESULT) => {
      if (REQUEST !== REQUEST_ID.current) return
      setPerformances(
        RESULT.success ? BuildPerformanceIndex(RESULT.data) : {}
      )
    })
  }, [RANGE])

  const isPerformanceDay = useCallback(
    (date: Date) => AVAILABLE_KEYS.has(ToUtcDayKey(date)),
    [AVAILABLE_KEYS]
  )

  // No range means no snapshot was fetched for it, so the
  // index reads empty rather than handing back the answers of
  // the range the user just discarded.
  const HAS_RANGE = Boolean(RANGE?.from && RANGE?.to)

  const performanceFor = useCallback(
    (portfolioId: string) =>
      HAS_RANGE ? (PERFORMANCES[portfolioId] ?? null) : null,
    [HAS_RANGE, PERFORMANCES]
  )

  const FILTERED_PORTFOLIOS = useMemo(() => {
    const NORMALIZED = QUERY.trim().toLowerCase()

    if (!NORMALIZED) return portfolios

    return portfolios.filter((portfolio) => {
      const nameMatch = portfolio.name
        .toLowerCase()
        .includes(NORMALIZED)
      const acronymMatch = portfolio.acronym
        .toLowerCase()
        .includes(NORMALIZED)
      return nameMatch || acronymMatch
    })
  }, [portfolios, QUERY])

  return {
    query: QUERY,
    onQueryChange: setQuery,
    range: RANGE,
    onRangeChange: setRange,
    isPerformanceDay,
    performanceFor,
    filteredPortfolios: FILTERED_PORTFOLIOS,
  }
}

export { usePortfolioDatatableFilters }
