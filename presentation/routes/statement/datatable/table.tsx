"use client"

import { EntityDatatable } from "@/presentation/parts/datatable/layout/entity-datatable"
import type { EntityTable } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { StatementRow } from "@/presentation/types/statement-row.types"

interface StatementDatatableTableProps {
  table: EntityTable<StatementRow>
  /** Renders placeholder rows until the rows resolve. */
  pending?: boolean
  onBulkDelete: (items: StatementRow[]) => void | Promise<void>
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
 * @param props.pending - Renders placeholder rows.
 * @returns The statement datatable.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function StatementDatatableTable({
  table,
  pending,
  onBulkDelete,
}: StatementDatatableTableProps) {
  return (
    <EntityDatatable
      table={table}
      onBulkDelete={onBulkDelete}
      pending={pending}
    />
  )
}

export { StatementDatatableTable }
