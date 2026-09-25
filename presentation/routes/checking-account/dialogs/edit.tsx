"use client"

import { EntityEditDialog } from "@/presentation/parts/dialogs/entity-edit"
import { EntityEditToast } from "@/presentation/parts/toasts/entity-edit-toast"
import { EditCheckingAccountForm } from "@/presentation/routes/checking-account/forms/edit"
import { useEditCheckingAccountDialog } from "@/presentation/routes/checking-account/hooks/use-edit-checking-account-dialog.hook"
import {
  CHECKING_ACCOUNT_DIALOG,
  CHECKING_ACCOUNT_FORM,
} from "@/presentation/routes/checking-account/settings/labels.settings"

import type { CheckingAccountNameLookups } from "../types/checking-account-list.types"

/**
 * Props for the checking account edit dialog.
 */
export interface CheckingAccountEditDialogProps {
  dialog: ReturnType<typeof useEditCheckingAccountDialog>
  names: CheckingAccountNameLookups
}

/**
 * @summary
 * Renders the checking account edit dialog flow.
 *
 * @remarks
 * Composes the shared edit dialog with the edit form
 * seeded from the target row. The result toast fires
 * on success or error; on success the dialog closes
 * and the server data refreshes.
 *
 * @param props - Props of the edit dialog.
 * @param props.dialog - The edit dialog flow state.
 * @param props.names - The bank account name lookups.
 *
 * @returns The checking account edit dialog flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function CheckingAccountEditDialog({
  dialog,
  names,
}: CheckingAccountEditDialogProps) {
  return (
    <>
      <EntityEditDialog
        open={dialog.open}
        onOpenChange={dialog.setOpen}
        title={CHECKING_ACCOUNT_DIALOG.EDIT_TITLE}
        description={CHECKING_ACCOUNT_DIALOG.EDIT_DESCRIPTION}
      >
        {dialog.target ? (
          <EditCheckingAccountForm
            entry={dialog.target}
            names={names}
            onStatusChange={dialog.handleStatusChange}
          />
        ) : null}
      </EntityEditDialog>

      <EntityEditToast
        status={dialog.status}
        errorMessage={dialog.errorMessage}
        successTitle={CHECKING_ACCOUNT_FORM.UPDATE_SUCCESS_TITLE}
        successDescription={
          CHECKING_ACCOUNT_FORM.UPDATE_SUCCESS_DESCRIPTION
        }
        errorTitle={CHECKING_ACCOUNT_FORM.ERROR_TITLE}
      />
    </>
  )
}

export { CheckingAccountEditDialog }
