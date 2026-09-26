"use client"

import { EntitySearchFilter } from "@/presentation/parts/filters/search"
import { AUDIT_LOG_DATATABLE } from "@/presentation/routes/audit-log/settings/labels.settings"

interface AuditLogDatatableFiltersProps {
  query: string
  onQueryChange: (query: string) => void
}

/**
 * @summary
 * Composes the audit log datatable filters.
 *
 * @remarks
 * Renders the shared search filter on the toolbar. The query
 * narrows the rows by entity, action, entity id or actor.
 *
 * @param props - The filter state and handlers.
 * @param props.query - The current search query.
 * @param props.onQueryChange - Reports the next query.
 *
 * @returns The composed audit log filters.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function AuditLogDatatableFilters({
  query,
  onQueryChange,
}: AuditLogDatatableFiltersProps) {
  return (
    <EntitySearchFilter
      value={query}
      onChange={onQueryChange}
      placeholder={AUDIT_LOG_DATATABLE.FILTER_SEARCH_PLACEHOLDER}
    />
  )
}

export { AuditLogDatatableFilters }
