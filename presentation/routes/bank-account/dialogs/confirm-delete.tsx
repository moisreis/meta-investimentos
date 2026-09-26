"use client"

import { EntityConfirmDeleteDialog } from "@/presentation/parts/dialogs/entity-confirm-delete"
import { EntityDeleteToast } from "@/presentation/parts/toasts/entity-delete-toast"
import { FormatBankAccountFullLabel } from "@/presentation/routes/bank-account/helpers/build-bank-account-name-lookups.helper"
import { useBankAccountRowActions } from "@/presentation/routes/bank-account/hooks/use-bank-account-row-actions.hook"
import {
  BANK_ACCOUNT_DATATABLE,
  FormatDeleteBankAccountDescription,
} from "@/presentation/routes/bank-account/settings/labels.settings"

import type { BankAccountNameLookups } from "../types/bank-account-list.types"

/**
 * Props for the bank account confirm-delete dialog.
 */
export interface BankAccountConfirmDeleteDialogProps {
  dialog: ReturnType<typeof useBankAccountRowActions>
  names: BankAccountNameLookups
}

/**
 * @summary
 * Renders the bank account confirm-delete dialog flow.
 *
 * @remarks
 * Composes the shared confirm-delete dialog with the
 * bank account copy and the delete result toast. The
 * title and description come from the datatable
 * settings; the description resolves the target bank
 * name and account numbers through the name lookups.
 *
 * @param props - Props of the confirm-delete dialog.
 * @param props.dialog - The row actions flow state.
 * @param props.names - The bank account name lookups.
 *
 * @returns The bank account confirm-delete dialog flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function BankAccountConfirmDeleteDialog({
  dialog,
  names,
}: BankAccountConfirmDeleteDialogProps) {
  return (
    <>
      <EntityConfirmDeleteDialog
        open={dialog.deleteOpen}
        onOpenChange={dialog.setDeleteOpen}
        title={BANK_ACCOUNT_DATATABLE.DELETE_TITLE}
        description={
          dialog.deleteTarget
            ? FormatDeleteBankAccountDescription(
                FormatBankAccountFullLabel(
                  names.bankAccounts[dialog.deleteTarget.id]
                    ?.bankName ?? "Banco",
                  dialog.deleteTarget.agency,
                  dialog.deleteTarget.accountNumber
                )
              )
            : ""
        }
        confirmLabel={
          BANK_ACCOUNT_DATATABLE.DELETE_CONFIRM_LABEL
        }
        cancelLabel={BANK_ACCOUNT_DATATABLE.DELETE_CANCEL_LABEL}
        pending={dialog.deletePending}
        onConfirm={dialog.handleConfirmDelete}
      />

      <EntityDeleteToast
        status={dialog.deleteStatus}
        errorMessage={dialog.deleteError}
        successTitle={
          BANK_ACCOUNT_DATATABLE.DELETE_SUCCESS_TITLE
        }
        successDescription={
          BANK_ACCOUNT_DATATABLE.DELETE_SUCCESS_DESCRIPTION
        }
        errorTitle={BANK_ACCOUNT_DATATABLE.DELETE_ERROR_TITLE}
      />
    </>
  )
}

export { BankAccountConfirmDeleteDialog }
