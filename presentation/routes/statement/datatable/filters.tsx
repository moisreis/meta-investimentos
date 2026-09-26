"use client"

import { EntitySearchFilter } from "@/presentation/parts/filters/search"
import { STATEMENT_DATATABLE } from "@/presentation/routes/statement/settings/labels.settings"

interface StatementDatatableFiltersProps {
  query: string
  onQueryChange: (query: string) => void
}

/**
 * @summary
 * Composes the statement datatable filters.
 *
 * @remarks
 * Renders the shared search filter on the toolbar. The query
 * narrows the table by the portfolio acronym or name.
 *
 * @param props - The filter state and handlers.
 * @param props.query - The current portfolio query.
 * @param props.onQueryChange - Reports the next query.
 *
 * @returns The composed statement filters.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function StatementDatatableFilters({
  query,
  onQueryChange,
}: StatementDatatableFiltersProps) {
  return (
    <EntitySearchFilter
      value={query}
      onChange={onQueryChange}
      placeholder={STATEMENT_DATATABLE.FILTER_SEARCH_PLACEHOLDER}
    />
  )
}

export { StatementDatatableFilters }
