"use client"

import { EntityDatatable } from "@/presentation/parts/datatable/layout/entity-datatable"
import type { EntityTable } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { ApplicationRow } from "@/presentation/types/application-row.types"

interface ApplicationDatatableTableProps {
  table: EntityTable<ApplicationRow>
  /** Renders placeholder rows until the rows resolve. */
  pending?: boolean
}

/**
 * @summary
 * Renders the application datatable.
 *
 * @remarks
 * Composes the shared entity datatable without selection
 * or bulk delete flows, since applications are managed
 * from the portfolio screens only.
 *
 * @param props - The shared table instance.
 * @param props.table - The shared table instance.
 *
 * @param props.pending - Renders placeholder rows.
 * @returns The application datatable.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function ApplicationDatatableTable({
  table,
  pending,
}: ApplicationDatatableTableProps) {
  return <EntityDatatable table={table} pending={pending} />
}

export { ApplicationDatatableTable }
