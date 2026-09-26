"use client"

import { EntityDatatableToolbar } from "@/presentation/parts/components/entity-datatable-toolbar"

import { PortfolioPerformanceCalculateButton } from "../components/portfolio-performance-calculate-button"

interface PortfolioPerformanceDatatableToolbarProps {
  onCalculate: () => void
  filters?: React.ReactNode
}

/**
 * @summary
 * Renders the performance datatable toolbar.
 *
 * @remarks
 * Composes the shared datatable toolbar with the
 * calculate button on the actions slot, replacing the
 * add-item button since performances are calculated
 * instead of created manually.
 *
 * @param props - The toolbar callbacks and slots.
 * @param props.onCalculate - Opens the confirm dialog.
 * @param props.filters - The left-side filter group.
 *
 * @returns The performance datatable toolbar.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function PortfolioPerformanceDatatableToolbar({
  onCalculate,
  filters,
}: PortfolioPerformanceDatatableToolbarProps) {
  return (
    <EntityDatatableToolbar
      filters={filters}
      actions={
        <PortfolioPerformanceCalculateButton
          onClick={onCalculate}
        />
      }
    />
  )
}

export { PortfolioPerformanceDatatableToolbar }
