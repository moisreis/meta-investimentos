"use client"

import { EntityDatatable } from "@/presentation/parts/datatable/layout/entity-datatable"
import type { EntityTable } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { PositionRow } from "@/presentation/types/position-row.types"

interface PositionDatatableTableProps {
  table: EntityTable<PositionRow>
  /** Renders placeholder rows until the rows resolve. */
  pending?: boolean
  /**
   * Enables the bulk delete confirm flow for the selected
   * rows.
   */
  onBulkDelete?: (items: PositionRow[]) => void | Promise<void>
}

/**
 * @summary
 * Renders the position datatable.
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
 * @returns The position datatable.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
function PositionDatatableTable({
  table,
  pending,
  onBulkDelete,
}: PositionDatatableTableProps) {
  return (
    <EntityDatatable
      table={table}
      onBulkDelete={onBulkDelete}
      pending={pending}
    />
  )
}

export { PositionDatatableTable }
