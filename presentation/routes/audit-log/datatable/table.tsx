"use client"

import { EntityDatatable } from "@/presentation/parts/datatable/layout/entity-datatable"
import type { EntityTable } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { AuditLogResponseDTO } from "@/services/audit-log/dto/audit-log-response.dto"

interface AuditLogDatatableTableProps {
  table: EntityTable<AuditLogResponseDTO>
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
 * @returns The audit log datatable.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function AuditLogDatatableTable({
  table,
}: AuditLogDatatableTableProps) {
  return <EntityDatatable table={table} />
}

export { AuditLogDatatableTable }
