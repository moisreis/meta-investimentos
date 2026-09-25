"use client"

import { EntityAddAnotherDialog } from "@/presentation/parts/dialogs/entity-add-another"
import { PORTFOLIO_DIALOG } from "@/presentation/routes/portfolio/settings/labels.settings"

/**
 * Props for the portfolio add-another dialog.
 */
export interface PortfolioAddAnotherDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBack: () => void
  onAddAnother: () => void
}

/**
 * @summary
 * Renders the portfolio add-another prompt dialog.
 *
 * @remarks
 * Wires the shared add-another dialog with the portfolio
 * copy and the back/add-another handlers.
 *
 * @param props - Props of the portfolio add-another dialog.
 * @param props.open - Controls the dialog visibility.
 * @param props.onOpenChange - Reports the open state.
 * @param props.onBack - Back-to-table handler.
 * @param props.onAddAnother - Add-another handler.
 *
 * @returns The portfolio add-another prompt dialog.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function PortfolioAddAnotherDialog({
  open,
  onOpenChange,
  onBack,
  onAddAnother,
}: PortfolioAddAnotherDialogProps) {
  return (
    <EntityAddAnotherDialog
      open={open}
      onOpenChange={onOpenChange}
      title={PORTFOLIO_DIALOG.ADD_ANOTHER_TITLE}
      description={PORTFOLIO_DIALOG.ADD_ANOTHER_DESCRIPTION}
      backLabel={PORTFOLIO_DIALOG.ADD_ANOTHER_BACK_LABEL}
      anotherLabel={PORTFOLIO_DIALOG.ADD_ANOTHER_ANOTHER_LABEL}
      onBack={onBack}
      onAddAnother={onAddAnother}
    />
  )
}

export { PortfolioAddAnotherDialog }
