"use client"

import { EntityDatatable } from "@/presentation/parts/datatable/layout/entity-datatable"
import type { EntityTable } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { BenchmarkHistoryRow } from "@/presentation/types/benchmark-history-row.types"

interface BenchmarkHistoryDatatableTableProps {
  table: EntityTable<BenchmarkHistoryRow>
  /** Renders placeholder rows until the rows resolve. */
  pending?: boolean
  /**
   * Enables the bulk delete confirm flow for the selected
   * rows.
   */
  onBulkDelete?: (
    items: BenchmarkHistoryRow[]
  ) => void | Promise<void>
}

/**
 * @summary
 * Renders the benchmark history datatable.
 *
 * @remarks
 * Composes the shared entity datatable with selection and
 * bulk delete flows enabled. A rate is corrected through
 * its row menu, so the table carries the actions column
 * alongside the three data columns.
 *
 * @param props - The table instance.
 * @param props.table - The shared table instance.
 * @param props.onBulkDelete - Optional bulk delete handler.
 * @param props.pending - Renders placeholder rows.
 *
 * @returns The benchmark history datatable.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function BenchmarkHistoryDatatableTable({
  table,
  pending,
  onBulkDelete,
}: BenchmarkHistoryDatatableTableProps) {
  return (
    <EntityDatatable
      table={table}
      onBulkDelete={onBulkDelete}
      pending={pending}
    />
  )
}

export { BenchmarkHistoryDatatableTable }
