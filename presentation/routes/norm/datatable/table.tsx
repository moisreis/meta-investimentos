"use client"

import { EntityDatatable } from "@/presentation/parts/datatable/layout/entity-datatable"
import type { EntityTable } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { NormRow } from "@/presentation/types/norm-row.types"

interface NormDatatableTableProps {
  table: EntityTable<NormRow>
  /** Renders placeholder rows until the rows resolve. */
  pending?: boolean
}

/**
 * @summary
 * Renders the norm datatable.
 *
 * @remarks
 * Composes the shared entity datatable without any delete
 * flow. Norms are reference rows that are edited, not
 * removed.
 *
 * @param props - The table instance.
 * @param props.table - The shared table instance.
 * @param props.pending - Renders placeholder rows.
 *
 * @returns The norm datatable.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function NormDatatableTable({
  table,
  pending,
}: NormDatatableTableProps) {
  return <EntityDatatable table={table} pending={pending} />
}

export { NormDatatableTable }
