"use client"

import { EntitySearchFilter } from "@/presentation/parts/filters/entity-search"
import { BENCHMARK_DATATABLE } from "@/presentation/routes/benchmark/settings/labels.settings"

interface BenchmarkDatatableFiltersProps {
  query: string
  onQueryChange: (query: string) => void
}

/**
 * @summary
 * Composes the benchmark datatable filters.
 *
 * @remarks
 * Renders the shared search filter on the toolbar. The query
 * narrows the rows by benchmark name.
 *
 * @param props - The filter state and handlers.
 * @param props.query - The current search query.
 * @param props.onQueryChange - Reports the next query.
 *
 * @returns The composed benchmark filters.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function BenchmarkDatatableFilters({
  query,
  onQueryChange,
}: BenchmarkDatatableFiltersProps) {
  return (
    <EntitySearchFilter
      value={query}
      onChange={onQueryChange}
      placeholder={BENCHMARK_DATATABLE.FILTER_SEARCH_PLACEHOLDER}
    />
  )
}

export { BenchmarkDatatableFilters }
