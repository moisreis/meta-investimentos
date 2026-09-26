"use client"

import { EntityDatatable } from "@/presentation/parts/datatable/layout/entity-datatable"
import type { EntityTable } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { PositionPerformanceResponseDTO } from "@/services/position-performance/dto/position-performance-response.dto"

interface PositionPerformanceDatatableTableProps {
  table: EntityTable<PositionPerformanceResponseDTO>
}

/**
 * @summary
 * Renders the position performance datatable.
 *
 * @remarks
 * Composes the shared entity datatable without selection
 * or bulk delete flows, since performances are produced
 * by the calculation flow only.
 *
 * @param props - The shared table instance.
 * @param props.table - The shared table instance.
 *
 * @returns The position performance datatable.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function PositionPerformanceDatatableTable({
  table,
}: PositionPerformanceDatatableTableProps) {
  return <EntityDatatable table={table} />
}

export { PositionPerformanceDatatableTable }
