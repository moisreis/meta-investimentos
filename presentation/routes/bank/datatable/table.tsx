"use client"

import { EntityDatatable } from "@/presentation/parts/datatable/layout/entity-datatable"
import type { EntityTable } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { BankResponseDTO } from "@/services/bank/dto/bank-response.dto"

interface BankDatatableTableProps {
  table: EntityTable<BankResponseDTO>
  onBulkDelete: (
    items: BankResponseDTO[]
  ) => void | Promise<void>
}

/**
 * @summary
 * Renders the bank datatable.
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
 * @returns The bank datatable.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function BankDatatableTable({
  table,
  onBulkDelete,
}: BankDatatableTableProps) {
  return (
    <EntityDatatable table={table} onBulkDelete={onBulkDelete} />
  )
}

export { BankDatatableTable }
