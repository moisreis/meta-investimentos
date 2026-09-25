"use client"

import { EntityAddAnotherDialog } from "@/presentation/parts/dialogs/entity-add-another"
import { CHECKING_ACCOUNT_DIALOG } from "@/presentation/routes/checking-account/settings/labels.settings"

/**
 * Props for the checking account add-another dialog.
 */
export interface CheckingAccountAddAnotherDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBack: () => void
  onAddAnother: () => void
}

/**
 * @summary
 * Renders the checking account add-another prompt
 * dialog.
 *
 * @remarks
 * Wires the shared add-another dialog with the
 * checking account copy and the back/add-another
 * handlers.
 *
 * @param props - Props of the add-another dialog.
 * @param props.open - Controls the dialog visibility.
 * @param props.onOpenChange - Reports the open state.
 * @param props.onBack - Back-to-table handler.
 * @param props.onAddAnother - Add-another handler.
 *
 * @returns The checking account add-another prompt
 *          dialog.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function CheckingAccountAddAnotherDialog({
  open,
  onOpenChange,
  onBack,
  onAddAnother,
}: CheckingAccountAddAnotherDialogProps) {
  return (
    <EntityAddAnotherDialog
      open={open}
      onOpenChange={onOpenChange}
      title={CHECKING_ACCOUNT_DIALOG.ADD_ANOTHER_TITLE}
      description={
        CHECKING_ACCOUNT_DIALOG.ADD_ANOTHER_DESCRIPTION
      }
      backLabel={CHECKING_ACCOUNT_DIALOG.ADD_ANOTHER_BACK_LABEL}
      anotherLabel={
        CHECKING_ACCOUNT_DIALOG.ADD_ANOTHER_ANOTHER_LABEL
      }
      onBack={onBack}
      onAddAnother={onAddAnother}
    />
  )
}

export { CheckingAccountAddAnotherDialog }
