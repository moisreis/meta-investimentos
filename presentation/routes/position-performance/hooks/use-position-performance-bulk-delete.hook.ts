"use client"

import { useEntityBulkDeleteAction } from "@/presentation/parts/hooks/use-entity-bulk-delete-action.hook"
import { bulkDeletePositionPerformancesAction } from "@/presentation/routes/position-performance/actions/bulk-delete-position-performances.action"
import { POSITION_PERFORMANCE_DATATABLE } from "@/presentation/routes/position-performance/settings/labels.settings"
import type { PositionPerformanceRow } from "@/presentation/types/position-performance-row.types"

/**
 * @summary
 * Binds the position performance bulk delete flow to the
 * shared entity bulk delete action.
 *
 * @remarks
 * Maps the selected row ids to the route bulk delete
 * server action and reuses the route datatable copy for
 * the outcome toast.
 *
 * @returns The bulk delete callback for the datatable.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-20
 */
function usePositionPerformanceBulkDelete() {
  return useEntityBulkDeleteAction<PositionPerformanceRow>({
    run: (ids) =>
      bulkDeletePositionPerformancesAction({
        performanceIds: ids,
      }),
    labels: POSITION_PERFORMANCE_DATATABLE,
  })
}

export { usePositionPerformanceBulkDelete }
