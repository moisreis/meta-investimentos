"use client"

import type { DateRange } from "react-day-picker"

import { EntityDateRangeFilter } from "@/presentation/parts/filters/date-range"
import { EntitySearchFilter } from "@/presentation/parts/filters/search"
import { PORTFOLIO_DATATABLE } from "@/presentation/routes/portfolio/settings/labels.settings"
import { EntityDatatableToolbarSeparator } from "@/presentation/parts/components/entity-datatable-toolbar-separator"

interface PortfolioDatatableFiltersProps {
  range: DateRange | undefined
  onRangeChange: (range: DateRange | undefined) => void
  query: string
  onQueryChange: (query: string) => void
  isPerformanceDay: (date: Date) => boolean
}

/**
 * @summary
 * Composes the portfolio datatable filters.
 *
 * @remarks
 * Renders the shared date range and search filters on the
 * toolbar. The date range filter disables every day without
 * performance registries and the search filter narrows the
 * table by the portfolio name.
 *
 * @param props - The filter state and handlers.
 * @param props.range - The selected date range.
 * @param props.onRangeChange - Reports the next range.
 * @param props.query - The current name query.
 * @param props.onQueryChange - Reports the next query.
 * @param props.isPerformanceDay - Matches days with registry.
 *
 * @returns The composed portfolio filters.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function PortfolioDatatableFilters({
  range,
  onRangeChange,
  query,
  onQueryChange,
  isPerformanceDay,
}: PortfolioDatatableFiltersProps) {
  return (
    <>
      <EntitySearchFilter
        value={query}
        onChange={onQueryChange}
        placeholder={
          PORTFOLIO_DATATABLE.FILTER_SEARCH_PLACEHOLDER
        }
      />
      <EntityDatatableToolbarSeparator />
      <EntityDateRangeFilter
        value={range}
        isDateDisabled={(date) => !isPerformanceDay(date)}
        onChange={onRangeChange}
        placeholder={
          PORTFOLIO_DATATABLE.FILTER_DATE_RANGE_PLACEHOLDER
        }
      />
    </>
  )
}

export { PortfolioDatatableFilters }
