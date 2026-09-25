"use client"

import { EntityEditDialog } from "@/presentation/parts/dialogs/entity-edit"
import { EntityEditToast } from "@/presentation/parts/toasts/entity-edit-toast"
import { EditBankForm } from "@/presentation/routes/bank/forms/edit"
import { useBankEditDialog } from "@/presentation/routes/bank/hooks/use-bank-edit-dialog.hook"
import {
  BANK_DIALOG,
  BANK_FORM,
} from "@/presentation/routes/bank/settings/labels.settings"

/**
 * Props for the bank edit dialog.
 */
export interface BankEditDialogProps {
  dialog: ReturnType<typeof useBankEditDialog>
}

/**
 * @summary
 * Renders the bank edit dialog flow.
 *
 * @remarks
 * Composes the shared edit dialog with the edit form
 * seeded from the target row. The result toast fires on
 * success or error; on success the dialog closes and the
 * server data refreshes.
 *
 * @param props - Props of the bank edit dialog.
 * @param props.dialog - The edit dialog flow state.
 *
 * @returns The bank edit dialog flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function BankEditDialog({ dialog }: BankEditDialogProps) {
  return (
    <>
      <EntityEditDialog
        open={dialog.open}
        onOpenChange={dialog.setOpen}
        title={BANK_DIALOG.EDIT_TITLE}
        description={BANK_DIALOG.EDIT_DESCRIPTION}
      >
        {dialog.target ? (
          <EditBankForm
            bank={dialog.target}
            onStatusChange={dialog.handleStatusChange}
          />
        ) : null}
      </EntityEditDialog>

      <EntityEditToast
        status={dialog.status}
        errorMessage={dialog.errorMessage}
        successTitle={BANK_FORM.UPDATE_SUCCESS_TITLE}
        successDescription={BANK_FORM.UPDATE_SUCCESS_DESCRIPTION}
        errorTitle={BANK_FORM.ERROR_TITLE}
      />
    </>
  )
}

export { BankEditDialog }
