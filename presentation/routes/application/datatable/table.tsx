"use client"

import { EntityDatatable } from "@/presentation/parts/datatable/layout/entity-datatable"
import type { EntityTable } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { ApplicationResponseDTO } from "@/services/application/dto/application-response.dto"

interface ApplicationDatatableTableProps {
  table: EntityTable<ApplicationResponseDTO>
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
 * @returns The application datatable.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function ApplicationDatatableTable({
  table,
}: ApplicationDatatableTableProps) {
  return <EntityDatatable table={table} />
}

export { ApplicationDatatableTable }
