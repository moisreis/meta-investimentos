"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { type DateRange } from "react-day-picker"

import type { PortfolioPerformanceResponseDTO } from "@/services/portfolio-performance/dto/portfolio-performance-response.dto"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"

import { listPortfolioPerformanceAction } from "../actions/list-portfolio-performance.action"

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
  snapshots: PortfolioPerformanceResponseDTO[]
): Record<string, PortfolioPerformanceResponseDTO | undefined> {
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
  ) => PortfolioPerformanceResponseDTO | null
  filteredPortfolios: PortfolioResponseDTO[]
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
  portfolios: PortfolioResponseDTO[],
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
    Record<string, PortfolioPerformanceResponseDTO | undefined>
  >({})

  const REQUEST_ID = useRef(0)

  useEffect(() => {
    const FROM = RANGE?.from
    const TO = RANGE?.to
    const REQUEST = ++REQUEST_ID.current

    if (!FROM || !TO) {
      setPerformances({})
      return
    }

    listPortfolioPerformanceAction({
      from: ToUtcDayKey(FROM),
      to: ToUtcDayKey(TO),
    }).then((RESULT) => {
      if (REQUEST !== REQUEST_ID.current) return
      setPerformances(
        RESULT.data ? BuildPerformanceIndex(RESULT.data) : {}
      )
    })
  }, [RANGE])

  const isPerformanceDay = useCallback(
    (date: Date) => AVAILABLE_KEYS.has(ToUtcDayKey(date)),
    [AVAILABLE_KEYS]
  )

  const performanceFor = useCallback(
    (portfolioId: string) => PERFORMANCES[portfolioId] ?? null,
    [PERFORMANCES]
  )

  const FILTERED_PORTFOLIOS = useMemo(() => {
    const NORMALIZED = QUERY.trim().toLowerCase()

    if (!NORMALIZED) return portfolios

    return portfolios.filter((portfolio) =>
      portfolio.name.toLowerCase().includes(NORMALIZED)
    )
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
