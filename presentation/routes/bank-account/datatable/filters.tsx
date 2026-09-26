"use client"

import { EntitySearchFilter } from "@/presentation/parts/filters/search"
import { BANK_ACCOUNT_DATATABLE } from "@/presentation/routes/bank-account/settings/labels.settings"

interface BankAccountDatatableFiltersProps {
  query: string
  onQueryChange: (query: string) => void
}

/**
 * @summary
 * Composes the bank account datatable filters.
 *
 * @remarks
 * Renders the shared search filter on the toolbar,
 * narrowing the table by the portfolio, bank, agency or
 * account number.
 *
 * @param props - The filter state and handlers.
 * @param props.query - The current search query.
 * @param props.onQueryChange - Reports the next query.
 *
 * @returns The composed bank account filters.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function BankAccountDatatableFilters({
  query,
  onQueryChange,
}: BankAccountDatatableFiltersProps) {
  return (
    <EntitySearchFilter
      value={query}
      onChange={onQueryChange}
      placeholder={
        BANK_ACCOUNT_DATATABLE.FILTER_SEARCH_PLACEHOLDER
      }
    />
  )
}

export { BankAccountDatatableFilters }
