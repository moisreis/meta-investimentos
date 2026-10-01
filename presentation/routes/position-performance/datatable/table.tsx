"use client"

import { EntityDatatable } from "@/presentation/parts/datatable/layout/entity-datatable"
import type { EntityTable } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { PositionPerformanceRow } from "@/presentation/types/position-performance-row.types"

interface PositionPerformanceDatatableTableProps {
  table: EntityTable<PositionPerformanceRow>
  /** Renders placeholder rows until the rows resolve. */
  pending?: boolean
  /**
   * Enables the bulk delete confirm flow for the selected
   * rows.
   */
  onBulkDelete?: (
    items: PositionPerformanceRow[]
  ) => void | Promise<void>
}

/**
 * @summary
 * Renders the position performance datatable.
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
 * @returns The position performance datatable.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
function PositionPerformanceDatatableTable({
  table,
  pending,
  onBulkDelete,
}: PositionPerformanceDatatableTableProps) {
  return (
    <EntityDatatable
      table={table}
      onBulkDelete={onBulkDelete}
      pending={pending}
    />
  )
}

export { PositionPerformanceDatatableTable }
