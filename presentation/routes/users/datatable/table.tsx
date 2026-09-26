"use client"

import { EntityDatatable } from "@/presentation/parts/datatable/layout/entity-datatable"
import type { EntityTable } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { UserResponseDTO } from "@/services/user/dto/user-response.dto"

interface UserDatatableTableProps {
  table: EntityTable<UserResponseDTO>
  onBulkDelete: (
    items: UserResponseDTO[]
  ) => void | Promise<void>
}

/**
 * @summary
 * Renders the user datatable.
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
 * @returns The user datatable.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function UserDatatableTable({
  table,
  onBulkDelete,
}: UserDatatableTableProps) {
  return (
    <EntityDatatable table={table} onBulkDelete={onBulkDelete} />
  )
}

export { UserDatatableTable }
