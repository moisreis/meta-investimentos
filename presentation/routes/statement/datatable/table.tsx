"use client"

import { EntityDatatable } from "@/presentation/parts/datatable/layout/entity-datatable"
import type { EntityTable } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { StatementResponseDTO } from "@/services/statement/dto/statement-response.dto"

interface StatementDatatableTableProps {
  table: EntityTable<StatementResponseDTO>
  onBulkDelete: (
    items: StatementResponseDTO[]
  ) => void | Promise<void>
}

/**
 * @summary
 * Renders the statement datatable.
 *
 * @remarks
 * Composes the shared entity datatable with the bulk delete
 * flow. The row dialogs render at the list page level above
 * this component.
 *
 * @param props - The table and its bulk delete callback.
 * @param props.table - The shared table instance.
 * @param props.onBulkDelete - Runs the bulk delete flow.
 *
 * @returns The statement datatable.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function StatementDatatableTable({
  table,
  onBulkDelete,
}: StatementDatatableTableProps) {
  return (
    <EntityDatatable table={table} onBulkDelete={onBulkDelete} />
  )
}

export { StatementDatatableTable }
