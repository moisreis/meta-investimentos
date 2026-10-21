"use client"

import { useEntityBulkDeleteAction } from "@/presentation/parts/hooks/use-entity-bulk-delete-action.hook"
import { bulkDeletePositionsAction } from "@/presentation/routes/position/actions/bulk-delete-positions.action"
import { POSITION_DATATABLE } from "@/presentation/routes/position/settings/labels.settings"
import type { PositionRow } from "@/presentation/types/position-row.types"

/**
 * @summary
 * Binds the position bulk delete flow to the shared
 * entity bulk delete action.
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
function usePositionBulkDelete() {
  return useEntityBulkDeleteAction<PositionRow>({
    run: (ids) =>
      bulkDeletePositionsAction({ positionIds: ids }),
    labels: POSITION_DATATABLE,
  })
}

export { usePositionBulkDelete }
