"use client"

import { useMemo, useState } from "react"
import { endOfDay, startOfDay } from "date-fns"
import type { DateRange } from "react-day-picker"

import type { PortfolioPerformanceResponseDTO } from "@/services/portfolio-performance/dto/portfolio-performance-response.dto"

interface UsePortfolioPerformanceDatatableFiltersOutput {
  portfolioId: string | undefined
  dateRange: DateRange | undefined
  onPortfolioChange: (value: string | undefined) => void
  onDateRangeChange: (range: DateRange | undefined) => void
  filteredPerformances: PortfolioPerformanceResponseDTO[]
}

/**
 * @summary
 * Coordinates the performance datatable filters.
 *
 * @remarks
 * Owns the portfolio and period filters and narrows the
 * rows by the performance portfolio and the calculation
 * date before the table receives them. The period is
 * inclusive of both edges.
 *
 * @param performances - The rows rendered by the table.
 *
 * @returns The filter state and the filtered rows.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function usePortfolioPerformanceDatatableFilters(
  performances: PortfolioPerformanceResponseDTO[]
): UsePortfolioPerformanceDatatableFiltersOutput {
  const [PORTFOLIO_ID, setPortfolioId] = useState<
    string | undefined
  >(undefined)
  const [DATE_RANGE, setDateRange] = useState<
    DateRange | undefined
  >(undefined)

  const FILTERED_PERFORMANCES = useMemo(() => {
    const FROM = DATE_RANGE?.from
      ? startOfDay(DATE_RANGE.from).getTime()
      : null
    const TO = DATE_RANGE?.to
      ? endOfDay(DATE_RANGE.to).getTime()
      : null

    return performances.filter((performance) => {
      if (
        PORTFOLIO_ID &&
        performance.portfolioId !== PORTFOLIO_ID
      ) {
        return false
      }

      if (FROM !== null || TO !== null) {
        const TIME = new Date(performance.date).getTime()

        if (FROM !== null && TIME < FROM) return false
        if (TO !== null && TIME > TO) return false
      }

      return true
    })
  }, [performances, PORTFOLIO_ID, DATE_RANGE])

  return {
    portfolioId: PORTFOLIO_ID,
    dateRange: DATE_RANGE,
    onPortfolioChange: setPortfolioId,
    onDateRangeChange: setDateRange,
    filteredPerformances: FILTERED_PERFORMANCES,
  }
}

export { usePortfolioPerformanceDatatableFilters }
