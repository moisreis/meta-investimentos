"use client"

import { EntityAddDialog } from "@/presentation/parts/dialogs/entity-add"
import { EntityAddToast } from "@/presentation/parts/toasts/entity-add-toast"
import { AddPortfolioForm } from "@/presentation/routes/portfolio/forms/add"
import { usePortfolioAddDialog } from "@/presentation/routes/portfolio/hooks/use-portfolio-add-dialog.hook"
import {
  PORTFOLIO_DIALOG,
  PORTFOLIO_FORM,
} from "@/presentation/routes/portfolio/settings/labels.settings"

import { PortfolioAddAnotherDialog } from "./add-another"

/**
 * Props for the portfolio add dialog.
 */
export interface PortfolioAddDialogProps {
  dialog: ReturnType<typeof usePortfolioAddDialog>
}

/**
 * @summary
 * Renders the portfolio add dialog flow.
 *
 * @remarks
 * Composes the shared add dialog with the add form and
 * the add-another prompt. On success the add-another
 * prompt opens so the user can return to the table or
 * add another portfolio. The result toast fires on both
 * outcomes.
 *
 * @param props - Props of the portfolio add dialog.
 * @param props.dialog - The add dialog flow state.
 *
 * @returns The portfolio add dialog flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function PortfolioAddDialog({
  dialog,
}: PortfolioAddDialogProps) {
  return (
    <>
      <EntityAddDialog
        open={dialog.open}
        onOpenChange={dialog.setOpen}
        title={PORTFOLIO_DIALOG.ADD_TITLE}
        description={PORTFOLIO_DIALOG.ADD_DESCRIPTION}
      >
        <AddPortfolioForm
          key={dialog.formKey}
          onStatusChange={dialog.handleStatusChange}
        />
      </EntityAddDialog>

      <PortfolioAddAnotherDialog
        open={dialog.anotherOpen}
        onOpenChange={dialog.handleBackToTable}
        onBack={dialog.handleBackToTable}
        onAddAnother={dialog.handleAddAnother}
      />

      <EntityAddToast
        status={dialog.status}
        errorMessage={dialog.errorMessage}
        successTitle={PORTFOLIO_FORM.CREATE_SUCCESS_TITLE}
        successDescription={
          PORTFOLIO_FORM.CREATE_SUCCESS_DESCRIPTION
        }
        errorTitle={PORTFOLIO_FORM.ERROR_TITLE}
      />
    </>
  )
}

export { PortfolioAddDialog }
