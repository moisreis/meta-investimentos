"use client"

import { useEntityRowActions } from "@/presentation/parts/hooks/use-entity-row-actions.hook"
import { deletePositionPerformanceAction } from "@/presentation/routes/position-performance/actions/delete-position-performance.action"
import type { PositionPerformanceRow } from "@/presentation/types/position-performance-row.types"

/**
 * @summary
 * Binds the position performance row actions to the shared
 * entity row actions hook.
 *
 * @remarks
 * Maps the row id to the route delete server action
 * only. The shared hook owns the confirm dialog
 * state and the delete result toast status.
 *
 * @returns The row actions and delete dialog state.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
function usePositionPerformanceRowActions() {
  return useEntityRowActions<PositionPerformanceRow>({
    runDelete: (id) =>
      deletePositionPerformanceAction({ performanceId: id }),
  })
}

export { usePositionPerformanceRowActions }
