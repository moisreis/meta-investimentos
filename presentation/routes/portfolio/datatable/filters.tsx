"use client"

import type { DateRange } from "react-day-picker"

import { EntityDateRangeFilter } from "@/presentation/parts/filters/date-range"
import { EntitySearchFilter } from "@/presentation/parts/filters/search"
import { PORTFOLIO_DATATABLE } from "@/presentation/routes/portfolio/settings/labels.settings"

interface PortfolioDatatableFiltersProps {
  dates: Date[]
  range: DateRange | undefined
  onRangeChange: (range: DateRange | undefined) => void
  query: string
  onQueryChange: (query: string) => void
}

/**
 * @summary
 * Composes the portfolio datatable filters.
 *
 * @remarks
 * Renders the shared date range and search filters on the
 * toolbar. The date range filter disables the days without
 * performance registries and the search filter narrows the
 * table by the portfolio name.
 *
 * @param props - The filter state and handlers.
 * @param props.dates - Calendar days with registries.
 * @param props.range - The selected date range.
 * @param props.onRangeChange - Reports the next range.
 * @param props.query - The current name query.
 * @param props.onQueryChange - Reports the next query.
 *
 * @returns The composed portfolio filters.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function PortfolioDatatableFilters({
  dates,
  range,
  onRangeChange,
  query,
  onQueryChange,
}: PortfolioDatatableFiltersProps) {
  return (
    <>
      <EntityDateRangeFilter
        value={range}
        disabledDates={dates}
        onChange={onRangeChange}
        placeholder={
          PORTFOLIO_DATATABLE.FILTER_DATE_RANGE_PLACEHOLDER
        }
      />
      <EntitySearchFilter
        value={query}
        onChange={onQueryChange}
        placeholder={
          PORTFOLIO_DATATABLE.FILTER_SEARCH_PLACEHOLDER
        }
      />
    </>
  )
}

export { PortfolioDatatableFilters }
