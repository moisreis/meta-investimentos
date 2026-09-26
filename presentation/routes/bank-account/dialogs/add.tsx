"use client"

import { EntityAddDialog } from "@/presentation/parts/dialogs/entity-add"
import { EntityAddToast } from "@/presentation/parts/toasts/entity-add-toast"
import { useEntityAddDialog } from "@/presentation/parts/hooks/use-entity-add-dialog.hook"
import type { EntityAddDialogModel } from "@/presentation/parts/hooks/use-entity-add-dialog.hook"
import { AddBankAccountForm } from "@/presentation/routes/bank-account/forms/add"
import {
  BANK_ACCOUNT_DIALOG,
  BANK_ACCOUNT_FORM,
} from "@/presentation/routes/bank-account/settings/labels.settings"

import type { BankAccountSelectOptions } from "../types/bank-account-list.types"
import { BankAccountAddAnotherDialog } from "./add-another"

/**
 * Props for the bank account add dialog.
 */
export interface BankAccountAddDialogProps {
  dialog: EntityAddDialogModel
  options: BankAccountSelectOptions
}

/**
 * @summary
 * Renders the bank account add dialog flow.
 *
 * @remarks
 * Composes the shared add dialog with the add form and
 * the add-another prompt. The result toast fires on
 * success or error; on success the add dialog swaps for
 * the add-another prompt.
 *
 * @param props - Props of the bank account add dialog.
 * @param props.dialog - The add dialog flow state.
 * @param props.options - The registry options.
 *
 * @returns The bank account add dialog flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function BankAccountAddDialog({
  dialog,
  options,
}: BankAccountAddDialogProps) {
  return (
    <>
      <EntityAddDialog
        open={dialog.open}
        onOpenChange={dialog.setOpen}
        title={BANK_ACCOUNT_DIALOG.ADD_TITLE}
        description={BANK_ACCOUNT_DIALOG.ADD_DESCRIPTION}
      >
        <AddBankAccountForm
          key={dialog.formKey}
          options={options}
          onStatusChange={dialog.handleStatusChange}
        />
      </EntityAddDialog>

      <BankAccountAddAnotherDialog
        open={dialog.anotherOpen}
        onOpenChange={dialog.handleBackToTable}
        onBack={dialog.handleBackToTable}
        onAddAnother={dialog.handleAddAnother}
      />

      <EntityAddToast
        status={dialog.status}
        errorMessage={dialog.errorMessage}
        successTitle={BANK_ACCOUNT_FORM.CREATE_SUCCESS_TITLE}
        successDescription={
          BANK_ACCOUNT_FORM.CREATE_SUCCESS_DESCRIPTION
        }
        errorTitle={BANK_ACCOUNT_FORM.ERROR_TITLE}
      />
    </>
  )
}

export { BankAccountAddDialog }
