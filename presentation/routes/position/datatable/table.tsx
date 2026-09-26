"use client"

import { EntityDatatable } from "@/presentation/parts/datatable/layout/entity-datatable"
import type { EntityTable } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { PositionResponseDTO } from "@/services/position/dto/position-response.dto"

interface PositionDatatableTableProps {
  table: EntityTable<PositionResponseDTO>
}

/**
 * @summary
 * Renders the position datatable.
 *
 * @remarks
 * Composes the shared entity datatable without selection
 * or bulk delete flows, since positions are managed from
 * the portfolio screens only.
 *
 * @param props - The shared table instance.
 * @param props.table - The shared table instance.
 *
 * @returns The position datatable.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function PositionDatatableTable({
  table,
}: PositionDatatableTableProps) {
  return <EntityDatatable table={table} />
}

export { PositionDatatableTable }
