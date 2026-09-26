"use client"

import { useMemo, useState } from "react"
import { endOfDay, startOfDay } from "date-fns"
import type { DateRange } from "react-day-picker"

import type { PositionPerformanceResponseDTO } from "@/services/position-performance/dto/position-performance-response.dto"

interface UsePositionPerformanceDatatableFiltersOutput {
  positionId: string | undefined
  dateRange: DateRange | undefined
  onPositionChange: (value: string | undefined) => void
  onDateRangeChange: (range: DateRange | undefined) => void
  filteredPerformances: PositionPerformanceResponseDTO[]
}

/**
 * @summary
 * Coordinates the position performance datatable filters.
 *
 * @remarks
 * Owns the position and period filters and narrows the
 * rows by the performance position and the calculation
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
function usePositionPerformanceDatatableFilters(
  performances: PositionPerformanceResponseDTO[]
): UsePositionPerformanceDatatableFiltersOutput {
  const [POSITION_ID, setPositionId] = useState<
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
        POSITION_ID &&
        performance.positionId !== POSITION_ID
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
  }, [performances, POSITION_ID, DATE_RANGE])

  return {
    positionId: POSITION_ID,
    dateRange: DATE_RANGE,
    onPositionChange: setPositionId,
    onDateRangeChange: setDateRange,
    filteredPerformances: FILTERED_PERFORMANCES,
  }
}

export { usePositionPerformanceDatatableFilters }
