"use client"

import { EntityAddAnotherDialog } from "@/presentation/parts/dialogs/entity-add-another"
import { BANK_DIALOG } from "@/presentation/routes/bank/settings/labels.settings"

/**
 * Props for the bank add-another dialog.
 */
export interface BankAddAnotherDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBack: () => void
  onAddAnother: () => void
}

/**
 * @summary
 * Renders the bank add-another prompt dialog.
 *
 * @remarks
 * Wires the shared add-another dialog with the bank
 * copy and the back/add-another handlers.
 *
 * @param props - Props of the bank add-another dialog.
 * @param props.open - Controls the dialog visibility.
 * @param props.onOpenChange - Reports the open state.
 * @param props.onBack - Back-to-table handler.
 * @param props.onAddAnother - Add-another handler.
 *
 * @returns The bank add-another prompt dialog.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function BankAddAnotherDialog({
  open,
  onOpenChange,
  onBack,
  onAddAnother,
}: BankAddAnotherDialogProps) {
  return (
    <EntityAddAnotherDialog
      open={open}
      onOpenChange={onOpenChange}
      title={BANK_DIALOG.ADD_ANOTHER_TITLE}
      description={BANK_DIALOG.ADD_ANOTHER_DESCRIPTION}
      backLabel={BANK_DIALOG.ADD_ANOTHER_BACK_LABEL}
      anotherLabel={BANK_DIALOG.ADD_ANOTHER_ANOTHER_LABEL}
      onBack={onBack}
      onAddAnother={onAddAnother}
    />
  )
}

export { BankAddAnotherDialog }
