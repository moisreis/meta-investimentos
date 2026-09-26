"use client"

import { EntityDatatableToolbar } from "@/presentation/parts/components/entity-datatable-toolbar"

interface PositionDatatableToolbarProps {
  filters?: React.ReactNode
}

/**
 * @summary
 * Renders the position datatable toolbar.
 *
 * @remarks
 * Composes the shared datatable toolbar with the filter
 * group on the left slot. The actions slot stays empty,
 * since positions are created inside the portfolio
 * screens instead of through this registry.
 *
 * @param props - The toolbar slots.
 * @param props.filters - The left-side filter group.
 *
 * @returns The position datatable toolbar.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function PositionDatatableToolbar({
  filters,
}: PositionDatatableToolbarProps) {
  return <EntityDatatableToolbar filters={filters} />
}

export { PositionDatatableToolbar }
