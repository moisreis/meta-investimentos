"use client"

import { EntityConfirmDeleteDialog } from "@/presentation/parts/dialogs/entity-confirm-delete"
import { EntityDeleteToast } from "@/presentation/parts/toasts/entity-delete-toast"
import { useFundRowActions } from "@/presentation/routes/fund/hooks/use-fund-row-actions.hook"
import {
  FUND_DATATABLE,
  FormatDeleteFundDescription,
} from "@/presentation/routes/fund/settings/labels.settings"

/**
 * Props for the fund confirm-delete dialog.
 */
export interface FundConfirmDeleteDialogProps {
  dialog: ReturnType<typeof useFundRowActions>
}

/**
 * @summary
 * Renders the fund confirm-delete dialog flow.
 *
 * @remarks
 * Composes the shared confirm-delete dialog with the
 * fund copy and the delete result toast. The title
 * and description come from the datatable settings.
 *
 * @param props - Props of the confirm-delete dialog.
 * @param props.dialog - The row actions flow state.
 *
 * @returns The fund confirm-delete dialog flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function FundConfirmDeleteDialog({
  dialog,
}: FundConfirmDeleteDialogProps) {
  return (
    <>
      <EntityConfirmDeleteDialog
        open={dialog.deleteOpen}
        onOpenChange={dialog.setDeleteOpen}
        title={FUND_DATATABLE.DELETE_TITLE}
        description={
          dialog.deleteTarget
            ? FormatDeleteFundDescription(
                dialog.deleteTarget.name
              )
            : ""
        }
        confirmLabel={FUND_DATATABLE.DELETE_CONFIRM_LABEL}
        cancelLabel={FUND_DATATABLE.DELETE_CANCEL_LABEL}
        pending={dialog.deletePending}
        onConfirm={dialog.handleConfirmDelete}
      />

      <EntityDeleteToast
        status={dialog.deleteStatus}
        errorMessage={dialog.deleteError}
        successTitle={FUND_DATATABLE.DELETE_SUCCESS_TITLE}
        successDescription={
          FUND_DATATABLE.DELETE_SUCCESS_DESCRIPTION
        }
        errorTitle={FUND_DATATABLE.DELETE_ERROR_TITLE}
      />
    </>
  )
}

export { FundConfirmDeleteDialog }
