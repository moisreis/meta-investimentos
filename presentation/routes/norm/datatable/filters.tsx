"use client"

import { EntitySearchFilter } from "@/presentation/parts/filters/entity-search"
import { NORM_DATATABLE } from "@/presentation/routes/norm/settings/labels.settings"

interface NormDatatableFiltersProps {
  query: string
  onQueryChange: (query: string) => void
}

/**
 * @summary
 * Composes the norm datatable filters.
 *
 * @remarks
 * Renders the shared search filter on the toolbar. The query
 * narrows the rows by norm name.
 *
 * @param props - The filter state and handlers.
 * @param props.query - The current search query.
 * @param props.onQueryChange - Reports the next query.
 *
 * @returns The composed norm filters.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function NormDatatableFilters({
  query,
  onQueryChange,
}: NormDatatableFiltersProps) {
  return (
    <EntitySearchFilter
      value={query}
      onChange={onQueryChange}
      placeholder={NORM_DATATABLE.FILTER_SEARCH_PLACEHOLDER}
    />
  )
}

export { NormDatatableFilters }
