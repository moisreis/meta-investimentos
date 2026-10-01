"use client"

import { EntityDatatable } from "@/presentation/parts/datatable/layout/entity-datatable"
import type { EntityTable } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { BenchmarkRow } from "@/presentation/types/benchmark-row.types"

interface BenchmarkDatatableTableProps {
  table: EntityTable<BenchmarkRow>
  /** Renders placeholder rows until the rows resolve. */
  pending?: boolean
}

/**
 * @summary
 * Renders the benchmark datatable.
 *
 * @remarks
 * Composes the shared entity datatable without any delete
 * flow. Benchmarks are reference rows that are edited, not
 * removed.
 *
 * @param props - The table instance.
 * @param props.table - The shared table instance.
 * @param props.pending - Renders placeholder rows.
 *
 * @returns The benchmark datatable.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function BenchmarkDatatableTable({
  table,
  pending,
}: BenchmarkDatatableTableProps) {
  return <EntityDatatable table={table} pending={pending} />
}

export { BenchmarkDatatableTable }
