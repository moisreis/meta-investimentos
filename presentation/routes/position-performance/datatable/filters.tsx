"use client"

import type { DateRange } from "react-day-picker"

import { EntityDateRangeFilter } from "@/presentation/parts/filters/date-range"
import type { EntitySelectFilterOption } from "@/presentation/parts/filters/entity-select-filter"
import { EntitySelectFilter } from "@/presentation/parts/filters/entity-select-filter"

import { POSITION_PERFORMANCE_DATATABLE } from "../settings/labels.settings"

interface PositionPerformanceDatatableFiltersProps {
  positionId: string | undefined
  dateRange: DateRange | undefined
  positionOptions: EntitySelectFilterOption[]
  onPositionChange: (value: string | undefined) => void
  onDateRangeChange: (range: DateRange | undefined) => void
}

/**
 * @summary
 * Composes the position performance datatable filters.
 *
 * @remarks
 * Renders the shared select and date range filters on
 * the toolbar, narrowing the table by the position and
 * the calculation period.
 *
 * @param props - The filter state and handlers.
 * @param props.positionId - The selected position.
 * @param props.dateRange - The selected period.
 * @param props.positionOptions - The position options.
 * @param props.onPositionChange - Reports the position.
 * @param props.onDateRangeChange - Reports the period.
 *
 * @returns The composed position performance filters.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function PositionPerformanceDatatableFilters({
  positionId,
  dateRange,
  positionOptions,
  onPositionChange,
  onDateRangeChange,
}: PositionPerformanceDatatableFiltersProps) {
  return (
    <>
      <EntitySelectFilter
        value={positionId}
        onChange={onPositionChange}
        options={positionOptions}
        placeholder={
          POSITION_PERFORMANCE_DATATABLE.FILTER_POSITION_PLACEHOLDER
        }
        label={
          POSITION_PERFORMANCE_DATATABLE.FILTER_POSITION_LABEL
        }
      />
      <EntityDateRangeFilter
        value={dateRange}
        onChange={onDateRangeChange}
        placeholder={
          POSITION_PERFORMANCE_DATATABLE.FILTER_DATE_PLACEHOLDER
        }
      />
    </>
  )
}

export { PositionPerformanceDatatableFilters }
