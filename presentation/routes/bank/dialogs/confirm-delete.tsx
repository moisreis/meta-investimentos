"use client"

import { EntityConfirmDeleteDialog } from "@/presentation/parts/dialogs/entity-confirm-delete"
import { EntityDeleteToast } from "@/presentation/parts/toasts/entity-delete-toast"
import { useBankRowActions } from "@/presentation/routes/bank/hooks/use-bank-row-actions.hook"
import {
  BANK_DATATABLE,
  FormatDeleteBankDescription,
} from "@/presentation/routes/bank/settings/labels.settings"

/**
 * Props for the bank confirm-delete dialog.
 */
export interface BankConfirmDeleteDialogProps {
  dialog: ReturnType<typeof useBankRowActions>
}

/**
 * @summary
 * Renders the bank confirm-delete dialog flow.
 *
 * @remarks
 * Composes the shared confirm-delete dialog with the
 * bank copy and the delete result toast. The title
 * and description come from the datatable settings.
 *
 * @param props - Props of the confirm-delete dialog.
 * @param props.dialog - The row actions flow state.
 *
 * @returns The bank confirm-delete dialog flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function BankConfirmDeleteDialog({
  dialog,
}: BankConfirmDeleteDialogProps) {
  return (
    <>
      <EntityConfirmDeleteDialog
        open={dialog.deleteOpen}
        onOpenChange={dialog.setDeleteOpen}
        title={BANK_DATATABLE.DELETE_TITLE}
        description={
          dialog.deleteTarget
            ? FormatDeleteBankDescription(
                dialog.deleteTarget.name
              )
            : ""
        }
        confirmLabel={BANK_DATATABLE.DELETE_CONFIRM_LABEL}
        cancelLabel={BANK_DATATABLE.DELETE_CANCEL_LABEL}
        pending={dialog.deletePending}
        onConfirm={dialog.handleConfirmDelete}
      />

      <EntityDeleteToast
        status={dialog.deleteStatus}
        errorMessage={dialog.deleteError}
        successTitle={BANK_DATATABLE.DELETE_SUCCESS_TITLE}
        successDescription={
          BANK_DATATABLE.DELETE_SUCCESS_DESCRIPTION
        }
        errorTitle={BANK_DATATABLE.DELETE_ERROR_TITLE}
      />
    </>
  )
}

export { BankConfirmDeleteDialog }
