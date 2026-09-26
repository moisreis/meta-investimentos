"use client"

import { useCallback, useMemo, useState } from "react"
import type { DateRange } from "react-day-picker"

import type { EntityKpi } from "@/presentation/parts/hooks/use-entity-kpis.hook"

import { BuildPortfolioOverviewKpis } from "../helpers/build-portfolio-overview-kpis.helper"
import type { PortfolioOverviewData } from "../types/portfolio-overview.types"

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
 * span of available snapshot days and every change rebuilds
 * the KPI cards through the pure overview builder.
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

  const isPerformanceDay = useCallback(
    (date: Date) => AVAILABLE_KEYS.has(ToUtcDayKey(date)),
    [AVAILABLE_KEYS]
  )

  const KPIS = useMemo(
    () =>
      BuildPortfolioOverviewKpis(data.performances, DATE_RANGE),
    [data.performances, DATE_RANGE]
  )

  return {
    dateRange: DATE_RANGE,
    onDateRangeChange: setDateRange,
    isPerformanceDay,
    kpis: KPIS,
  }
}

export { usePortfolioOverview }
