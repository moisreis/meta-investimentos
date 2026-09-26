"use client"

import { EntityConfirmDeleteDialog } from "@/presentation/parts/dialogs/entity-confirm-delete"
import { EntityDeleteToast } from "@/presentation/parts/toasts/entity-delete-toast"
import { useUserRowActions } from "@/presentation/routes/users/hooks/use-user-row-actions.hook"
import {
  FormatDeleteUserDescription,
  USER_DATATABLE,
} from "@/presentation/routes/users/settings/labels.settings"

/**
 * Props for the user confirm-delete dialog.
 */
export interface UserConfirmDeleteDialogProps {
  dialog: ReturnType<typeof useUserRowActions>
}

/**
 * @summary
 * Renders the user confirm-delete dialog flow.
 *
 * @remarks
 * Composes the shared confirm-delete dialog with the
 * user copy and the delete result toast. The title
 * and description come from the datatable settings.
 *
 * @param props - Props of the confirm-delete dialog.
 * @param props.dialog - The row actions flow state.
 *
 * @returns The user confirm-delete dialog flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function UserConfirmDeleteDialog({
  dialog,
}: UserConfirmDeleteDialogProps) {
  return (
    <>
      <EntityConfirmDeleteDialog
        open={dialog.deleteOpen}
        onOpenChange={dialog.setDeleteOpen}
        title={USER_DATATABLE.DELETE_TITLE}
        description={
          dialog.deleteTarget
            ? FormatDeleteUserDescription(
                dialog.deleteTarget.name
              )
            : ""
        }
        confirmLabel={USER_DATATABLE.DELETE_CONFIRM_LABEL}
        cancelLabel={USER_DATATABLE.DELETE_CANCEL_LABEL}
        pending={dialog.deletePending}
        onConfirm={dialog.handleConfirmDelete}
      />

      <EntityDeleteToast
        status={dialog.deleteStatus}
        errorMessage={dialog.deleteError}
        successTitle={USER_DATATABLE.DELETE_SUCCESS_TITLE}
        successDescription={
          USER_DATATABLE.DELETE_SUCCESS_DESCRIPTION
        }
        errorTitle={USER_DATATABLE.DELETE_ERROR_TITLE}
      />
    </>
  )
}

export { UserConfirmDeleteDialog }
