"use client"

import { EntityConfirmDeleteDialog } from "@/presentation/parts/dialogs/entity-confirm-delete"
import { EntityDeleteToast } from "@/presentation/parts/toasts/entity-delete-toast"
import { FormatPositionLookup } from "@/presentation/presenters/lookup.presenter"
import { usePositionPerformanceRowActions } from "@/presentation/routes/position-performance/hooks/use-position-performance-row-actions.hook"
import { POSITION_PERFORMANCE_DATATABLE } from "@/presentation/routes/position-performance/settings/labels.settings"
import type { PositionPerformanceRowLookup } from "@/presentation/routes/position-performance/types/position-performance-list.types"

/**
 * Props for the position performance confirm-delete dialog.
 */
export interface PositionPerformanceConfirmDeleteDialogProps {
  dialog: ReturnType<typeof usePositionPerformanceRowActions>
  lookups: { rows: Record<string, PositionPerformanceRowLookup> }
}

/**
 * @summary
 * Renders the position performance confirm-delete dialog flow.
 *
 * @remarks
 * Composes the shared confirm-delete dialog with the
 * position performance copy and the delete result toast.
 * The title and description come from the datatable settings;
 * the position name resolves per row through the lookup
 * presenter.
 *
 * @param props - Props of the confirm-delete dialog.
 * @param props.dialog - The row actions flow state.
 * @param props.lookups - The position performance row lookups.
 *
 * @returns The position performance confirm-delete dialog flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
function PositionPerformanceConfirmDeleteDialog({
  dialog,
  lookups,
}: PositionPerformanceConfirmDeleteDialogProps) {
  const TARGET = dialog.deleteTarget

  const LOOKUP = TARGET ? lookups.rows[TARGET.id] : null

  return (
    <>
      <EntityConfirmDeleteDialog
        open={dialog.deleteOpen}
        onOpenChange={dialog.setDeleteOpen}
        title={POSITION_PERFORMANCE_DATATABLE.DELETE_TITLE}
        description={LOOKUP ? FormatPositionLookup(LOOKUP) : ""}
        confirmLabel={
          POSITION_PERFORMANCE_DATATABLE.DELETE_CONFIRM_LABEL
        }
        cancelLabel={
          POSITION_PERFORMANCE_DATATABLE.DELETE_CANCEL_LABEL
        }
        pending={dialog.deletePending}
        onConfirm={dialog.handleConfirmDelete}
      />

      <EntityDeleteToast
        status={dialog.deleteStatus}
        errorMessage={dialog.deleteError}
        successTitle={
          POSITION_PERFORMANCE_DATATABLE.DELETE_SUCCESS_TITLE
        }
        successDescription={
          POSITION_PERFORMANCE_DATATABLE.DELETE_SUCCESS_DESCRIPTION
        }
        errorTitle={
          POSITION_PERFORMANCE_DATATABLE.DELETE_ERROR_TITLE
        }
      />
    </>
  )
}

export { PositionPerformanceConfirmDeleteDialog }
