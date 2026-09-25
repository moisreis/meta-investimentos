"use client"

import { EntitySearchFilter } from "@/presentation/parts/filters/search"
import { BANK_DATATABLE } from "@/presentation/routes/bank/settings/labels.settings"

interface BankDatatableFiltersProps {
  query: string
  onQueryChange: (query: string) => void
}

/**
 * @summary
 * Composes the bank datatable filters.
 *
 * @remarks
 * Renders the shared search filter on the toolbar,
 * narrowing the table by the bank name.
 *
 * @param props - The filter state and handlers.
 * @param props.query - The current name query.
 * @param props.onQueryChange - Reports the next query.
 *
 * @returns The composed bank filters.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function BankDatatableFilters({
  query,
  onQueryChange,
}: BankDatatableFiltersProps) {
  return (
    <EntitySearchFilter
      value={query}
      onChange={onQueryChange}
      placeholder={BANK_DATATABLE.FILTER_SEARCH_PLACEHOLDER}
    />
  )
}

export { BankDatatableFilters }
