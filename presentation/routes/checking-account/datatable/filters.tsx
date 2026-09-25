"use client"

import { EntitySearchFilter } from "@/presentation/parts/filters/search"
import { CHECKING_ACCOUNT_DATATABLE } from "@/presentation/routes/checking-account/settings/labels.settings"

interface CheckingAccountDatatableFiltersProps {
  query: string
  onQueryChange: (query: string) => void
}

/**
 * @summary
 * Composes the checking account datatable filters.
 *
 * @remarks
 * Renders the shared search filter on the toolbar,
 * narrowing the table by the bank account label, the
 * balance date or the value.
 *
 * @param props - The filter state and handlers.
 * @param props.query - The current search query.
 * @param props.onQueryChange - Reports the next query.
 *
 * @returns The composed checking account filters.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function CheckingAccountDatatableFilters({
  query,
  onQueryChange,
}: CheckingAccountDatatableFiltersProps) {
  return (
    <EntitySearchFilter
      value={query}
      onChange={onQueryChange}
      placeholder={
        CHECKING_ACCOUNT_DATATABLE.FILTER_SEARCH_PLACEHOLDER
      }
    />
  )
}

export { CheckingAccountDatatableFilters }
