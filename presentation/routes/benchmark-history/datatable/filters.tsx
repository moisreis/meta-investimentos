"use client"

import { EntitySearchFilter } from "@/presentation/parts/filters/entity-search"
import { BENCHMARK_HISTORY_DATATABLE } from "@/presentation/routes/benchmark-history/settings/labels.settings"

interface BenchmarkHistoryDatatableFiltersProps {
  query: string
  onQueryChange: (query: string) => void
}

/**
 * @summary
 * Composes the benchmark history datatable filters.
 *
 * @remarks
 * Renders the shared search filter on the toolbar. The query
 * narrows the rows by benchmark name or rate.
 *
 * @param props - The filter state and handlers.
 * @param props.query - The current search query.
 * @param props.onQueryChange - Reports the next query.
 *
 * @returns The composed benchmark history filters.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function BenchmarkHistoryDatatableFilters({
  query,
  onQueryChange,
}: BenchmarkHistoryDatatableFiltersProps) {
  return (
    <EntitySearchFilter
      value={query}
      onChange={onQueryChange}
      placeholder={
        BENCHMARK_HISTORY_DATATABLE.FILTER_SEARCH_PLACEHOLDER
      }
    />
  )
}

export { BenchmarkHistoryDatatableFilters }
