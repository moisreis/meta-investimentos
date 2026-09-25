"use client"

import { EntitySearchFilter } from "@/presentation/parts/filters/search"
import { CATEGORY_DATATABLE } from "@/presentation/routes/category/settings/labels.settings"

interface CategoryDatatableFiltersProps {
  query: string
  onQueryChange: (query: string) => void
}

/**
 * @summary
 * Composes the category datatable filters.
 *
 * @remarks
 * Renders the shared search filter on the toolbar,
 * narrowing the table by the category name.
 *
 * @param props - The filter state and handlers.
 * @param props.query - The current name query.
 * @param props.onQueryChange - Reports the next query.
 *
 * @returns The composed category filters.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function CategoryDatatableFilters({
  query,
  onQueryChange,
}: CategoryDatatableFiltersProps) {
  return (
    <EntitySearchFilter
      value={query}
      onChange={onQueryChange}
      placeholder={CATEGORY_DATATABLE.FILTER_SEARCH_PLACEHOLDER}
    />
  )
}

export { CategoryDatatableFilters }
