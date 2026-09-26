"use client"

import { EntityAddDialog } from "@/presentation/parts/dialogs/entity-add"
import { EntityAddToast } from "@/presentation/parts/toasts/entity-add-toast"
import { useEntityAddDialog } from "@/presentation/parts/hooks/use-entity-add-dialog.hook"
import type { EntityAddDialogModel } from "@/presentation/parts/hooks/use-entity-add-dialog.hook"
import { AddBankForm } from "@/presentation/routes/bank/forms/add"
import {
  BANK_DIALOG,
  BANK_FORM,
} from "@/presentation/routes/bank/settings/labels.settings"

import { BankAddAnotherDialog } from "./add-another"

/**
 * Props for the bank add dialog.
 */
export interface BankAddDialogProps {
  dialog: EntityAddDialogModel
}

/**
 * @summary
 * Renders the bank add dialog flow.
 *
 * @remarks
 * Composes the shared add dialog with the add form and
 * the add-another prompt. On success the add-another
 * prompt opens so the user can return to the table or
 * add another bank. The result toast fires on both
 * outcomes.
 *
 * @param props - Props of the bank add dialog.
 * @param props.dialog - The add dialog flow state.
 *
 * @returns The bank add dialog flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function BankAddDialog({ dialog }: BankAddDialogProps) {
  return (
    <>
      <EntityAddDialog
        open={dialog.open}
        onOpenChange={dialog.setOpen}
        title={BANK_DIALOG.ADD_TITLE}
        description={BANK_DIALOG.ADD_DESCRIPTION}
      >
        <AddBankForm
          key={dialog.formKey}
          onStatusChange={dialog.handleStatusChange}
        />
      </EntityAddDialog>

      <BankAddAnotherDialog
        open={dialog.anotherOpen}
        onOpenChange={dialog.handleBackToTable}
        onBack={dialog.handleBackToTable}
        onAddAnother={dialog.handleAddAnother}
      />

      <EntityAddToast
        status={dialog.status}
        errorMessage={dialog.errorMessage}
        successTitle={BANK_FORM.CREATE_SUCCESS_TITLE}
        successDescription={BANK_FORM.CREATE_SUCCESS_DESCRIPTION}
        errorTitle={BANK_FORM.ERROR_TITLE}
      />
    </>
  )
}

export { BankAddDialog }
