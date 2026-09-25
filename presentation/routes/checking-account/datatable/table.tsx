"use client"

import { EntityDatatable } from "@/presentation/parts/datatable/layout/entity-datatable"
import type { EntityTable } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { CheckingAccountResponseDTO } from "@/services/checking-account/dto/checking-account-response.dto"

interface CheckingAccountDatatableTableProps {
  table: EntityTable<CheckingAccountResponseDTO>
  onBulkDelete: (
    items: CheckingAccountResponseDTO[]
  ) => void | Promise<void>
}

/**
 * @summary
 * Renders the checking account datatable.
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
 * @returns The checking account datatable.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function CheckingAccountDatatableTable({
  table,
  onBulkDelete,
}: CheckingAccountDatatableTableProps) {
  return (
    <EntityDatatable table={table} onBulkDelete={onBulkDelete} />
  )
}

export { CheckingAccountDatatableTable }
