"use client"

import { EntitySearchFilter } from "@/presentation/parts/filters/search"
import { FUND_DATATABLE } from "@/presentation/routes/fund/settings/labels.settings"

interface FundDatatableFiltersProps {
  query: string
  onQueryChange: (query: string) => void
}

/**
 * @summary
 * Composes the fund datatable filters.
 *
 * @remarks
 * Renders the shared search filter on the toolbar,
 * narrowing the table by the fund name or **CNPJ**.
 *
 * @param props - The filter state and handlers.
 * @param props.query - The current search query.
 * @param props.onQueryChange - Reports the next query.
 *
 * @returns The composed fund filters.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function FundDatatableFilters({
  query,
  onQueryChange,
}: FundDatatableFiltersProps) {
  return (
    <EntitySearchFilter
      value={query}
      onChange={onQueryChange}
      placeholder={FUND_DATATABLE.FILTER_SEARCH_PLACEHOLDER}
    />
  )
}

export { FundDatatableFilters }
