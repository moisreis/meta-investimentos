"use client"

import { EntityAddAnotherDialog } from "@/presentation/parts/dialogs/entity-add-another"
import { CATEGORY_DIALOG } from "@/presentation/routes/category/settings/labels.settings"

/**
 * Props for the category add-another dialog.
 */
export interface CategoryAddAnotherDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBack: () => void
  onAddAnother: () => void
}

/**
 * @summary
 * Renders the category add-another prompt dialog.
 *
 * @remarks
 * Wires the shared add-another dialog with the category
 * copy and the back/add-another handlers.
 *
 * @param props - Props of the category add-another dialog.
 * @param props.open - Controls the dialog visibility.
 * @param props.onOpenChange - Reports the open state.
 * @param props.onBack - Back-to-table handler.
 * @param props.onAddAnother - Add-another handler.
 *
 * @returns The category add-another prompt dialog.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function CategoryAddAnotherDialog({
  open,
  onOpenChange,
  onBack,
  onAddAnother,
}: CategoryAddAnotherDialogProps) {
  return (
    <EntityAddAnotherDialog
      open={open}
      onOpenChange={onOpenChange}
      title={CATEGORY_DIALOG.ADD_ANOTHER_TITLE}
      description={CATEGORY_DIALOG.ADD_ANOTHER_DESCRIPTION}
      backLabel={CATEGORY_DIALOG.ADD_ANOTHER_BACK_LABEL}
      anotherLabel={CATEGORY_DIALOG.ADD_ANOTHER_ANOTHER_LABEL}
      onBack={onBack}
      onAddAnother={onAddAnother}
    />
  )
}

export { CategoryAddAnotherDialog }
