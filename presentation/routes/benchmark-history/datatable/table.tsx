"use client"

import { EntityDatatable } from "@/presentation/parts/datatable/layout/entity-datatable"
import type { EntityTable } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { BenchmarkHistoryRow } from "@/presentation/types/benchmark-history-row.types"

interface BenchmarkHistoryDatatableTableProps {
  table: EntityTable<BenchmarkHistoryRow>
  /** Renders placeholder rows until the rows resolve. */
  pending?: boolean
}

/**
 * @summary
 * Renders the benchmark history datatable.
 *
 * @remarks
 * Composes the shared entity datatable. A rate is corrected
 * through its row menu, so the table carries the actions
 * column alongside the three data columns.
 *
 * @param props - The table instance.
 * @param props.table - The shared table instance.
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
}: BenchmarkHistoryDatatableTableProps) {
  return <EntityDatatable table={table} pending={pending} />
}

export { BenchmarkHistoryDatatableTable }
