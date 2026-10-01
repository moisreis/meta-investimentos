"use client"

import { EntityDatatable } from "@/presentation/parts/datatable/layout/entity-datatable"
import type { EntityTable } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { AuditLogRow } from "@/presentation/types/audit-log-row.types"

interface AuditLogDatatableTableProps {
  table: EntityTable<AuditLogRow>
  /** Renders placeholder rows until the rows resolve. */
  pending?: boolean
}

/**
 * @summary
 * Renders the audit log datatable.
 *
 * @remarks
 * Composes the shared entity datatable without any mutation
 * flows. Audit logs are immutable, read-only entries.
 *
 * @param props - The table instance.
 * @param props.table - The shared table instance.
 *
 * @param props.pending - Renders placeholder rows.
 * @returns The audit log datatable.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function AuditLogDatatableTable({
  table,
  pending,
}: AuditLogDatatableTableProps) {
  return <EntityDatatable table={table} pending={pending} />
}

export { AuditLogDatatableTable }
