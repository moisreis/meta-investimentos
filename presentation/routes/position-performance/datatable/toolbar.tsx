"use client"

import { EntityDatatableToolbar } from "@/presentation/parts/components/entity-datatable-toolbar"

import { PositionPerformanceCalculateButton } from "../components/position-performance-calculate-button"

interface PositionPerformanceDatatableToolbarProps {
  onCalculate: () => void
  filters?: React.ReactNode
}

/**
 * @summary
 * Renders the position performance datatable toolbar.
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
 * @returns The position performance datatable toolbar.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function PositionPerformanceDatatableToolbar({
  onCalculate,
  filters,
}: PositionPerformanceDatatableToolbarProps) {
  return (
    <EntityDatatableToolbar
      filters={filters}
      actions={
        <PositionPerformanceCalculateButton
          onClick={onCalculate}
        />
      }
    />
  )
}

export { PositionPerformanceDatatableToolbar }
