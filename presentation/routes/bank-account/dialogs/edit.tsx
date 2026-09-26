"use client"

import { EntityEditDialog } from "@/presentation/parts/dialogs/entity-edit"
import { EntityEditToast } from "@/presentation/parts/toasts/entity-edit-toast"
import { useEntityEditDialog } from "@/presentation/parts/hooks/use-entity-edit-dialog.hook"
import type { EntityEditDialogModel } from "@/presentation/parts/hooks/use-entity-edit-dialog.hook"
import type { BankAccountResponseDTO } from "@/services/bank-account/dto/bank-account-response.dto"
import { EditBankAccountForm } from "@/presentation/routes/bank-account/forms/edit"
import {
  BANK_ACCOUNT_DIALOG,
  BANK_ACCOUNT_FORM,
} from "@/presentation/routes/bank-account/settings/labels.settings"

import type { BankAccountNameLookups } from "../types/bank-account-list.types"

/**
 * Props for the bank account edit dialog.
 */
export interface BankAccountEditDialogProps {
  dialog: EntityEditDialogModel<BankAccountResponseDTO>
  names: BankAccountNameLookups
}

/**
 * @summary
 * Renders the bank account edit dialog flow.
 *
 * @remarks
 * Composes the shared edit dialog with the edit form
 * seeded from the target row. The result toast fires on
 * success or error; on success the dialog closes and
 * the server data refreshes.
 *
 * @param props - Props of the bank account edit dialog.
 * @param props.dialog - The edit dialog flow state.
 * @param props.names - The bank account name lookups.
 *
 * @returns The bank account edit dialog flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function BankAccountEditDialog({
  dialog,
  names,
}: BankAccountEditDialogProps) {
  return (
    <>
      <EntityEditDialog
        open={dialog.open}
        onOpenChange={dialog.setOpen}
        title={BANK_ACCOUNT_DIALOG.EDIT_TITLE}
        description={BANK_ACCOUNT_DIALOG.EDIT_DESCRIPTION}
      >
        {dialog.target ? (
          <EditBankAccountForm
            bankAccount={dialog.target}
            names={names}
            onStatusChange={dialog.handleStatusChange}
          />
        ) : null}
      </EntityEditDialog>

      <EntityEditToast
        status={dialog.status}
        errorMessage={dialog.errorMessage}
        successTitle={BANK_ACCOUNT_FORM.UPDATE_SUCCESS_TITLE}
        successDescription={
          BANK_ACCOUNT_FORM.UPDATE_SUCCESS_DESCRIPTION
        }
        errorTitle={BANK_ACCOUNT_FORM.ERROR_TITLE}
      />
    </>
  )
}

export { BankAccountEditDialog }
