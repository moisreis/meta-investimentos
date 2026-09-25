"use client"

import { EntitySearchFilter } from "@/presentation/parts/filters/search"

import { QUOTA_DATATABLE } from "../settings/labels.settings"

interface QuotaDatatableFiltersProps {
  query: string
  onQueryChange: (query: string) => void
}

/**
 * @summary
 * Composes the quota datatable filters.
 *
 * @remarks
 * Renders the shared search filter on the toolbar,
 * narrowing the table by the fund name, cnpj or date.
 *
 * @param props - The filter state and handlers.
 * @param props.query - The current search query.
 * @param props.onQueryChange - Reports the next query.
 *
 * @returns The composed quota filters.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function QuotaDatatableFilters({
  query,
  onQueryChange,
}: QuotaDatatableFiltersProps) {
  return (
    <EntitySearchFilter
      value={query}
      onChange={onQueryChange}
      placeholder={QUOTA_DATATABLE.FILTER_SEARCH_PLACEHOLDER}
    />
  )
}

export { QuotaDatatableFilters }
