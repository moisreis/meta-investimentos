"use client"

import { EntityAddDialog } from "@/presentation/parts/dialogs/entity-add"
import { EntityAddToast } from "@/presentation/parts/toasts/entity-add-toast"
import { AddCheckingAccountForm } from "@/presentation/routes/checking-account/forms/add"
import { CheckingAccountAddAnotherDialog } from "@/presentation/routes/checking-account/dialogs/add-another"
import { useAddCheckingAccountDialog } from "@/presentation/routes/checking-account/hooks/use-add-checking-account-dialog.hook"
import {
  CHECKING_ACCOUNT_DIALOG,
  CHECKING_ACCOUNT_FORM,
} from "@/presentation/routes/checking-account/settings/labels.settings"

import type { CheckingAccountSelectOptions } from "../types/checking-account-list.types"

/**
 * Props for the checking account add dialog.
 */
export interface CheckingAccountAddDialogProps {
  dialog: ReturnType<typeof useAddCheckingAccountDialog>
  options: CheckingAccountSelectOptions
}

/**
 * @summary
 * Renders the checking account add dialog flow.
 *
 * @remarks
 * Composes the shared add dialog with the add form and
 * the add-another prompt. The result toast fires on
 * success or error; on success the add dialog swaps for
 * the add-another prompt.
 *
 * @param props - Props of the add dialog.
 * @param props.dialog - The add dialog flow state.
 * @param props.options - The registry options.
 *
 * @returns The checking account add dialog flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function CheckingAccountAddDialog({
  dialog,
  options,
}: CheckingAccountAddDialogProps) {
  return (
    <>
      <EntityAddDialog
        open={dialog.open}
        onOpenChange={dialog.setOpen}
        title={CHECKING_ACCOUNT_DIALOG.ADD_TITLE}
        description={CHECKING_ACCOUNT_DIALOG.ADD_DESCRIPTION}
      >
        <AddCheckingAccountForm
          key={dialog.formKey}
          options={options}
          onStatusChange={dialog.handleStatusChange}
        />
      </EntityAddDialog>

      <CheckingAccountAddAnotherDialog
        open={dialog.anotherOpen}
        onOpenChange={dialog.handleBackToTable}
        onBack={dialog.handleBackToTable}
        onAddAnother={dialog.handleAddAnother}
      />

      <EntityAddToast
        status={dialog.status}
        errorMessage={dialog.errorMessage}
        successTitle={CHECKING_ACCOUNT_FORM.CREATE_SUCCESS_TITLE}
        successDescription={
          CHECKING_ACCOUNT_FORM.CREATE_SUCCESS_DESCRIPTION
        }
        errorTitle={CHECKING_ACCOUNT_FORM.ERROR_TITLE}
      />
    </>
  )
}

export { CheckingAccountAddDialog }
