"use client"

import { EntityDatatableToolbar } from "@/presentation/parts/components/entity-datatable-toolbar"

interface QuotaDatatableToolbarProps {
  filters?: React.ReactNode
}

/**
 * @summary
 * Renders the quota datatable toolbar.
 *
 * @remarks
 * Composes the shared datatable toolbar.
 *
 * @param props - The toolbar slots.
 * @param props.filters - The left-side filter group.
 *
 * @returns The quota datatable toolbar.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function QuotaDatatableToolbar({
  filters,
}: QuotaDatatableToolbarProps) {
  return <EntityDatatableToolbar filters={filters} />
}

export { QuotaDatatableToolbar }
