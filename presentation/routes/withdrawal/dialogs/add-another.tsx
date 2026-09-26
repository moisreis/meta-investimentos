"use client"

import { EntityAddAnotherDialog } from "@/presentation/parts/dialogs/entity-add-another"
import { WITHDRAWAL_DIALOG } from "@/presentation/routes/withdrawal/settings/labels.settings"

/**
 * Props for the withdrawal add-another dialog.
 */
export interface WithdrawalAddAnotherDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBack: () => void
  onAddAnother: () => void
}

/**
 * @summary
 * Renders the withdrawal add-another prompt dialog.
 *
 * @remarks
 * Wires the shared add-another dialog with the withdrawal
 * copy and the back/add-another handlers.
 *
 * @param props - Props of the withdrawal add-another
 * dialog.
 * @param props.open - Controls the dialog visibility.
 * @param props.onOpenChange - Reports the open state.
 * @param props.onBack - Back-to-screen handler.
 * @param props.onAddAnother - Add-another handler.
 *
 * @returns The withdrawal add-another prompt dialog.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function WithdrawalAddAnotherDialog({
  open,
  onOpenChange,
  onBack,
  onAddAnother,
}: WithdrawalAddAnotherDialogProps) {
  return (
    <EntityAddAnotherDialog
      open={open}
      onOpenChange={onOpenChange}
      title={WITHDRAWAL_DIALOG.ADD_ANOTHER_TITLE}
      description={WITHDRAWAL_DIALOG.ADD_ANOTHER_DESCRIPTION}
      backLabel={WITHDRAWAL_DIALOG.ADD_ANOTHER_BACK_LABEL}
      anotherLabel={WITHDRAWAL_DIALOG.ADD_ANOTHER_ANOTHER_LABEL}
      onBack={onBack}
      onAddAnother={onAddAnother}
    />
  )
}

export { WithdrawalAddAnotherDialog }
