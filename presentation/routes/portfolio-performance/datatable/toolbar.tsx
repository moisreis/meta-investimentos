"use client"

import { EntityDatatableToolbar } from "@/presentation/parts/components/entity-datatable-toolbar"

interface PortfolioPerformanceDatatableToolbarProps {
  filters?: React.ReactNode
}

/**
 * @summary
 * Renders the performance datatable toolbar.
 *
 * @remarks
 * Composes the shared datatable toolbar.
 *
 * @param props - The toolbar slots.
 * @param props.filters - The left-side filter group.
 *
 * @returns The performance datatable toolbar.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function PortfolioPerformanceDatatableToolbar({
  filters,
}: PortfolioPerformanceDatatableToolbarProps) {
  return <EntityDatatableToolbar filters={filters} />
}

export { PortfolioPerformanceDatatableToolbar }
