"use client"

import { EntityAddAnotherDialog } from "@/presentation/parts/dialogs/entity-add-another"
import { FUND_DIALOG } from "@/presentation/routes/fund/settings/labels.settings"

/**
 * Props for the fund add-another dialog.
 */
export interface FundAddAnotherDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBack: () => void
  onAddAnother: () => void
}

/**
 * @summary
 * Renders the fund add-another prompt dialog.
 *
 * @remarks
 * Wires the shared add-another dialog with the fund
 * copy and the back/add-another handlers.
 *
 * @param props - Props of the fund add-another dialog.
 * @param props.open - Controls the dialog visibility.
 * @param props.onOpenChange - Reports the open state.
 * @param props.onBack - Back-to-table handler.
 * @param props.onAddAnother - Add-another handler.
 *
 * @returns The fund add-another prompt dialog.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function FundAddAnotherDialog({
  open,
  onOpenChange,
  onBack,
  onAddAnother,
}: FundAddAnotherDialogProps) {
  return (
    <EntityAddAnotherDialog
      open={open}
      onOpenChange={onOpenChange}
      title={FUND_DIALOG.ADD_ANOTHER_TITLE}
      description={FUND_DIALOG.ADD_ANOTHER_DESCRIPTION}
      backLabel={FUND_DIALOG.ADD_ANOTHER_BACK_LABEL}
      anotherLabel={FUND_DIALOG.ADD_ANOTHER_ANOTHER_LABEL}
      onBack={onBack}
      onAddAnother={onAddAnother}
    />
  )
}

export { FundAddAnotherDialog }
