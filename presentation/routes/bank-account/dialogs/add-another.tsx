"use client"

import { EntityAddAnotherDialog } from "@/presentation/parts/dialogs/entity-add-another"
import { BANK_ACCOUNT_DIALOG } from "@/presentation/routes/bank-account/settings/labels.settings"

/**
 * Props for the bank account add-another dialog.
 */
export interface BankAccountAddAnotherDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBack: () => void
  onAddAnother: () => void
}

/**
 * @summary
 * Renders the bank account add-another prompt dialog.
 *
 * @remarks
 * Wires the shared add-another dialog with the bank
 * account copy and the back/add-another handlers.
 *
 * @param props - Props of the add-another dialog.
 * @param props.open - Controls the dialog visibility.
 * @param props.onOpenChange - Reports the open state.
 * @param props.onBack - Back-to-table handler.
 * @param props.onAddAnother - Add-another handler.
 *
 * @returns The bank account add-another prompt dialog.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function BankAccountAddAnotherDialog({
  open,
  onOpenChange,
  onBack,
  onAddAnother,
}: BankAccountAddAnotherDialogProps) {
  return (
    <EntityAddAnotherDialog
      open={open}
      onOpenChange={onOpenChange}
      title={BANK_ACCOUNT_DIALOG.ADD_ANOTHER_TITLE}
      description={BANK_ACCOUNT_DIALOG.ADD_ANOTHER_DESCRIPTION}
      backLabel={BANK_ACCOUNT_DIALOG.ADD_ANOTHER_BACK_LABEL}
      anotherLabel={
        BANK_ACCOUNT_DIALOG.ADD_ANOTHER_ANOTHER_LABEL
      }
      onBack={onBack}
      onAddAnother={onAddAnother}
    />
  )
}

export { BankAccountAddAnotherDialog }
