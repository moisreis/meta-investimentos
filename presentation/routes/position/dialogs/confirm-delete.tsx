"use client"

import { EntityConfirmDeleteDialog } from "@/presentation/parts/dialogs/entity-confirm-delete"
import { EntityDeleteToast } from "@/presentation/parts/toasts/entity-delete-toast"
import { FormatPositionLookup } from "@/presentation/presenters/lookup.presenter"
import { usePositionRowActions } from "@/presentation/routes/position/hooks/use-position-row-actions.hook"
import { POSITION_DATATABLE } from "@/presentation/routes/position/settings/labels.settings"
import type { PositionRowLookup } from "@/presentation/routes/position/types/position-list.types"

/**
 * Props for the position confirm-delete dialog.
 */
export interface PositionConfirmDeleteDialogProps {
  dialog: ReturnType<typeof usePositionRowActions>
  lookups: { rows: Record<string, PositionRowLookup> }
}

/**
 * @summary
 * Renders the position confirm-delete dialog flow.
 *
 * @remarks
 * Composes the shared confirm-delete dialog with the
 * position copy and the delete result toast. The title and
 * description come from the datatable settings; the fund
 * name resolves per row through the lookup presenter.
 *
 * @param props - Props of the confirm-delete dialog.
 * @param props.dialog - The row actions flow state.
 * @param props.lookups - The position row lookups.
 *
 * @returns The position confirm-delete dialog flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
function PositionConfirmDeleteDialog({
  dialog,
  lookups,
}: PositionConfirmDeleteDialogProps) {
  const TARGET = dialog.deleteTarget

  const LOOKUP = TARGET ? lookups.rows[TARGET.id] : null

  return (
    <>
      <EntityConfirmDeleteDialog
        open={dialog.deleteOpen}
        onOpenChange={dialog.setDeleteOpen}
        title={POSITION_DATATABLE.DELETE_TITLE}
        description={LOOKUP ? FormatPositionLookup(LOOKUP) : ""}
        confirmLabel={POSITION_DATATABLE.DELETE_CONFIRM_LABEL}
        cancelLabel={POSITION_DATATABLE.DELETE_CANCEL_LABEL}
        pending={dialog.deletePending}
        onConfirm={dialog.handleConfirmDelete}
      />

      <EntityDeleteToast
        status={dialog.deleteStatus}
        errorMessage={dialog.deleteError}
        successTitle={POSITION_DATATABLE.DELETE_SUCCESS_TITLE}
        successDescription={
          POSITION_DATATABLE.DELETE_SUCCESS_DESCRIPTION
        }
        errorTitle={POSITION_DATATABLE.DELETE_ERROR_TITLE}
      />
    </>
  )
}

export { PositionConfirmDeleteDialog }
