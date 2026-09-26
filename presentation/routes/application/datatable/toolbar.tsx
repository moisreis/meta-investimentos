"use client"

import { EntityDatatableToolbar } from "@/presentation/parts/components/entity-datatable-toolbar"

interface ApplicationDatatableToolbarProps {
  filters?: React.ReactNode
}

/**
 * @summary
 * Renders the application datatable toolbar.
 *
 * @remarks
 * Composes the shared datatable toolbar with the filter
 * group on the left slot. The actions slot stays empty,
 * since applications are recorded inside the portfolio
 * screens instead of through this registry.
 *
 * @param props - The toolbar slots.
 * @param props.filters - The left-side filter group.
 *
 * @returns The application datatable toolbar.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function ApplicationDatatableToolbar({
  filters,
}: ApplicationDatatableToolbarProps) {
  return <EntityDatatableToolbar filters={filters} />
}

export { ApplicationDatatableToolbar }
