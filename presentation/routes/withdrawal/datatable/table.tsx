"use client"

import { EntityDatatable } from "@/presentation/parts/datatable/layout/entity-datatable"
import type { EntityTable } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { WithdrawalRow } from "@/presentation/types/withdrawal-row.types"

interface WithdrawalDatatableTableProps {
  table: EntityTable<WithdrawalRow>
  /** Renders placeholder rows until the rows resolve. */
  pending?: boolean
  /**
   * Enables the bulk delete confirm flow for the selected
   * rows.
   */
  onBulkDelete?: (items: WithdrawalRow[]) => void | Promise<void>
}

/**
 * @summary
 * Renders the withdrawal datatable.
 *
 * @remarks
 * Composes the shared entity datatable with selection and
 * bulk delete flows enabled.
 *
 * @param props - The shared table instance.
 * @param props.table - The shared table instance.
 * @param props.onBulkDelete - Optional bulk delete handler.
 *
 * @param props.pending - Renders placeholder rows.
 * @returns The withdrawal datatable.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function WithdrawalDatatableTable({
  table,
  pending,
  onBulkDelete,
}: WithdrawalDatatableTableProps) {
  return (
    <EntityDatatable
      table={table}
      onBulkDelete={onBulkDelete}
      pending={pending}
    />
  )
}

export { WithdrawalDatatableTable }
