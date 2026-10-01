"use client"

import { EntityAddAnotherDialog } from "@/presentation/parts/dialogs/entity-add-another"
import { NORM_DIALOG } from "@/presentation/routes/norm/settings/labels.settings"

/**
 * Props for the norm add-another dialog.
 */
export interface NormAddAnotherDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBack: () => void
  onAddAnother: () => void
}

/**
 * @summary
 * Renders the norm add-another prompt dialog.
 *
 * @remarks
 * Wires the shared add-another dialog with the norm
 * copy and the back/add-another handlers.
 *
 * @param props - Props of the norm add-another dialog.
 * @param props.open - Controls the dialog visibility.
 * @param props.onOpenChange - Reports the open state.
 * @param props.onBack - Back-to-table handler.
 * @param props.onAddAnother - Add-another handler.
 *
 * @returns The norm add-another prompt dialog.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function NormAddAnotherDialog({
  open,
  onOpenChange,
  onBack,
  onAddAnother,
}: NormAddAnotherDialogProps) {
  return (
    <EntityAddAnotherDialog
      open={open}
      onOpenChange={onOpenChange}
      title={NORM_DIALOG.ADD_ANOTHER_TITLE}
      description={NORM_DIALOG.ADD_ANOTHER_DESCRIPTION}
      backLabel={NORM_DIALOG.ADD_ANOTHER_BACK_LABEL}
      anotherLabel={NORM_DIALOG.ADD_ANOTHER_ANOTHER_LABEL}
      onBack={onBack}
      onAddAnother={onAddAnother}
    />
  )
}

export { NormAddAnotherDialog }
