"use client"

import { EntitySearchFilter } from "@/presentation/parts/filters/search"
import { USER_DATATABLE } from "@/presentation/routes/users/settings/labels.settings"

interface UserDatatableFiltersProps {
  query: string
  onQueryChange: (query: string) => void
}

/**
 * @summary
 * Composes the user datatable filters.
 *
 * @remarks
 * Renders the shared search filter on the toolbar,
 * narrowing the table by the user name or email.
 *
 * @param props - The filter state and handlers.
 * @param props.query - The current name/email query.
 * @param props.onQueryChange - Reports the next query.
 *
 * @returns The composed user filters.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function UserDatatableFilters({
  query,
  onQueryChange,
}: UserDatatableFiltersProps) {
  return (
    <EntitySearchFilter
      value={query}
      onChange={onQueryChange}
      placeholder={USER_DATATABLE.FILTER_SEARCH_PLACEHOLDER}
    />
  )
}

export { UserDatatableFilters }
