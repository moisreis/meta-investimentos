"use client"

import { EntityDatatable } from "@/presentation/parts/datatable/layout/entity-datatable"
import type { EntityTable } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { BankAccountRow } from "@/presentation/types/bank-account-row.types"

interface BankAccountDatatableTableProps {
  table: EntityTable<BankAccountRow>
  onBulkDelete: (items: BankAccountRow[]) => void | Promise<void>
}

/**
 * @summary
 * Renders the bank account datatable.
 *
 * @remarks
 * Composes the shared entity datatable with the bulk
 * delete flow. The row dialogs render at the list page
 * level above this component.
 *
 * @param props - The table and its bulk delete callback.
 * @param props.table - The shared table instance.
 * @param props.onBulkDelete - Runs the bulk delete flow.
 *
 * @returns The bank account datatable.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function BankAccountDatatableTable({
  table,
  onBulkDelete,
}: BankAccountDatatableTableProps) {
  return (
    <EntityDatatable table={table} onBulkDelete={onBulkDelete} />
  )
}

export { BankAccountDatatableTable }
