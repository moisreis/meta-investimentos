"use client"

import { FormatDate } from "@/presentation/presenters/date.presenter"
import { EntityConfirmDeleteDialog } from "@/presentation/parts/dialogs/entity-confirm-delete"
import { EntityDeleteToast } from "@/presentation/parts/toasts/entity-delete-toast"
import { ResolveBankAccountLabel } from "@/presentation/routes/checking-account/helpers/build-checking-account-name-lookups.helper"
import { useCheckingAccountRowActions } from "@/presentation/routes/checking-account/hooks/use-checking-account-row-actions.hook"
import {
  CHECKING_ACCOUNT_DATATABLE,
  FormatDeleteCheckingAccountDescription,
} from "@/presentation/routes/checking-account/settings/labels.settings"

import type { CheckingAccountNameLookups } from "../types/checking-account-list.types"

/**
 * Props for the checking account confirm-delete dialog.
 */
export interface CheckingAccountConfirmDeleteDialogProps {
  dialog: ReturnType<typeof useCheckingAccountRowActions>
  names: CheckingAccountNameLookups
}

/**
 * @summary
 * Renders the checking account confirm-delete dialog
 * flow.
 *
 * @remarks
 * Composes the shared confirm-delete dialog with the
 * checking account copy and the delete result toast.
 * The title and description come from the datatable
 * settings; the description resolves the target bank
 * account label and date through the name lookups.
 *
 * @param props - Props of the confirm-delete dialog.
 * @param props.dialog - The row actions flow state.
 * @param props.names - The bank account name lookups.
 *
 * @returns The checking account confirm-delete dialog
 *          flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function CheckingAccountConfirmDeleteDialog({
  dialog,
  names,
}: CheckingAccountConfirmDeleteDialogProps) {
  return (
    <>
      <EntityConfirmDeleteDialog
        open={dialog.deleteOpen}
        onOpenChange={dialog.setDeleteOpen}
        title={CHECKING_ACCOUNT_DATATABLE.DELETE_TITLE}
        description={
          dialog.deleteTarget
            ? FormatDeleteCheckingAccountDescription(
                ResolveBankAccountLabel(
                  names,
                  dialog.deleteTarget.bankAccountId
                ),
                FormatDate(dialog.deleteTarget.date)
              )
            : ""
        }
        confirmLabel={
          CHECKING_ACCOUNT_DATATABLE.DELETE_CONFIRM_LABEL
        }
        cancelLabel={
          CHECKING_ACCOUNT_DATATABLE.DELETE_CANCEL_LABEL
        }
        pending={dialog.deletePending}
        onConfirm={dialog.handleConfirmDelete}
      />

      <EntityDeleteToast
        status={dialog.deleteStatus}
        errorMessage={dialog.deleteError}
        successTitle={
          CHECKING_ACCOUNT_DATATABLE.DELETE_SUCCESS_TITLE
        }
        successDescription={
          CHECKING_ACCOUNT_DATATABLE.DELETE_SUCCESS_DESCRIPTION
        }
        errorTitle={
          CHECKING_ACCOUNT_DATATABLE.DELETE_ERROR_TITLE
        }
      />
    </>
  )
}

export { CheckingAccountConfirmDeleteDialog }
