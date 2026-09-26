"use client"

import { useMemo, useState } from "react"
import { endOfDay, startOfDay } from "date-fns"
import type { DateRange } from "react-day-picker"

import type { PositionResponseDTO } from "@/services/position/dto/position-response.dto"

interface UsePositionDatatableFiltersOutput {
  portfolioId: string | undefined
  fundId: string | undefined
  dateRange: DateRange | undefined
  onPortfolioChange: (value: string | undefined) => void
  onFundChange: (value: string | undefined) => void
  onDateRangeChange: (range: DateRange | undefined) => void
  filteredPositions: PositionResponseDTO[]
}

/**
 * @summary
 * Coordinates the position datatable filters.
 *
 * @remarks
 * Owns the portfolio, fund and opening period filters and
 * narrows the rows by the position portfolio, the
 * position fund and the position creation date before
 * the table receives them. The period is inclusive of
 * both edges.
 *
 * @param positions - The rows rendered by the table.
 *
 * @returns The filter state and the filtered rows.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function usePositionDatatableFilters(
  positions: PositionResponseDTO[]
): UsePositionDatatableFiltersOutput {
  const [PORTFOLIO_ID, setPortfolioId] = useState<
    string | undefined
  >(undefined)
  const [FUND_ID, setFundId] = useState<string | undefined>(
    undefined
  )
  const [DATE_RANGE, setDateRange] = useState<
    DateRange | undefined
  >(undefined)

  const FILTERED_POSITIONS = useMemo(() => {
    const FROM = DATE_RANGE?.from
      ? startOfDay(DATE_RANGE.from).getTime()
      : null
    const TO = DATE_RANGE?.to
      ? endOfDay(DATE_RANGE.to).getTime()
      : null

    return positions.filter((position) => {
      if (
        PORTFOLIO_ID &&
        position.portfolioId !== PORTFOLIO_ID
      ) {
        return false
      }

      if (FUND_ID && position.fundId !== FUND_ID) {
        return false
      }

      if (FROM !== null || TO !== null) {
        const TIME = new Date(position.createdAt).getTime()

        if (FROM !== null && TIME < FROM) return false
        if (TO !== null && TIME > TO) return false
      }

      return true
    })
  }, [positions, PORTFOLIO_ID, FUND_ID, DATE_RANGE])

  return {
    portfolioId: PORTFOLIO_ID,
    fundId: FUND_ID,
    dateRange: DATE_RANGE,
    onPortfolioChange: setPortfolioId,
    onFundChange: setFundId,
    onDateRangeChange: setDateRange,
    filteredPositions: FILTERED_POSITIONS,
  }
}

export { usePositionDatatableFilters }
