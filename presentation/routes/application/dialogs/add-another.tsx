"use client"

import { EntityAddAnotherDialog } from "@/presentation/parts/dialogs/entity-add-another"
import { APPLICATION_DIALOG } from "@/presentation/routes/application/settings/labels.settings"

/**
 * Props for the application add-another dialog.
 */
export interface ApplicationAddAnotherDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBack: () => void
  onAddAnother: () => void
}

/**
 * @summary
 * Renders the application add-another prompt dialog.
 *
 * @remarks
 * Wires the shared add-another dialog with the
 * application copy and the back/add-another handlers.
 *
 * @param props - Props of the application add-another
 * dialog.
 * @param props.open - Controls the dialog visibility.
 * @param props.onOpenChange - Reports the open state.
 * @param props.onBack - Back-to-screen handler.
 * @param props.onAddAnother - Add-another handler.
 *
 * @returns The application add-another prompt dialog.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function ApplicationAddAnotherDialog({
  open,
  onOpenChange,
  onBack,
  onAddAnother,
}: ApplicationAddAnotherDialogProps) {
  return (
    <EntityAddAnotherDialog
      open={open}
      onOpenChange={onOpenChange}
      title={APPLICATION_DIALOG.ADD_ANOTHER_TITLE}
      description={APPLICATION_DIALOG.ADD_ANOTHER_DESCRIPTION}
      backLabel={APPLICATION_DIALOG.ADD_ANOTHER_BACK_LABEL}
      anotherLabel={APPLICATION_DIALOG.ADD_ANOTHER_ANOTHER_LABEL}
      onBack={onBack}
      onAddAnother={onAddAnother}
    />
  )
}

export { ApplicationAddAnotherDialog }
