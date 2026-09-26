"use client"

import { EntityAddAnotherDialog } from "@/presentation/parts/dialogs/entity-add-another"
import { USER_DIALOG } from "@/presentation/routes/users/settings/labels.settings"

/**
 * Props for the user add-another dialog.
 */
export interface UserAddAnotherDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBack: () => void
  onAddAnother: () => void
}

/**
 * @summary
 * Renders the user add-another prompt dialog.
 *
 * @remarks
 * Wires the shared add-another dialog with the user
 * copy and the back/add-another handlers.
 *
 * @param props - Props of the user add-another dialog.
 * @param props.open - Controls the dialog visibility.
 * @param props.onOpenChange - Reports the open state.
 * @param props.onBack - Back-to-table handler.
 * @param props.onAddAnother - Add-another handler.
 *
 * @returns The user add-another prompt dialog.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function UserAddAnotherDialog({
  open,
  onOpenChange,
  onBack,
  onAddAnother,
}: UserAddAnotherDialogProps) {
  return (
    <EntityAddAnotherDialog
      open={open}
      onOpenChange={onOpenChange}
      title={USER_DIALOG.ADD_ANOTHER_TITLE}
      description={USER_DIALOG.ADD_ANOTHER_DESCRIPTION}
      backLabel={USER_DIALOG.ADD_ANOTHER_BACK_LABEL}
      anotherLabel={USER_DIALOG.ADD_ANOTHER_ANOTHER_LABEL}
      onBack={onBack}
      onAddAnother={onAddAnother}
    />
  )
}

export { UserAddAnotherDialog }
