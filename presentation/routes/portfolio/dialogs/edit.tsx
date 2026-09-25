"use client"

import { EntityEditDialog } from "@/presentation/parts/dialogs/entity-edit"
import { EntityEditToast } from "@/presentation/parts/toasts/entity-edit-toast"
import { EditPortfolioForm } from "@/presentation/routes/portfolio/forms/edit"
import { usePortfolioEditDialog } from "@/presentation/routes/portfolio/hooks/use-portfolio-edit-dialog.hook"
import {
  PORTFOLIO_DIALOG,
  PORTFOLIO_FORM,
} from "@/presentation/routes/portfolio/settings/labels.settings"

/**
 * Props for the portfolio edit dialog.
 */
export interface PortfolioEditDialogProps {
  dialog: ReturnType<typeof usePortfolioEditDialog>
}

/**
 * @summary
 * Renders the portfolio edit dialog flow.
 *
 * @remarks
 * Composes the shared edit dialog with the edit form
 * seeded from the target row. The result toast fires on
 * success or error; on success the dialog closes and the
 * server data refreshes.
 *
 * @param props - Props of the portfolio edit dialog.
 * @param props.dialog - The edit dialog flow state.
 *
 * @returns The portfolio edit dialog flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function PortfolioEditDialog({
  dialog,
}: PortfolioEditDialogProps) {
  return (
    <>
      <EntityEditDialog
        open={dialog.open}
        onOpenChange={dialog.setOpen}
        title={PORTFOLIO_DIALOG.EDIT_TITLE}
        description={PORTFOLIO_DIALOG.EDIT_DESCRIPTION}
      >
        {dialog.target ? (
          <EditPortfolioForm
            portfolio={dialog.target}
            onStatusChange={dialog.handleStatusChange}
          />
        ) : null}
      </EntityEditDialog>

      <EntityEditToast
        status={dialog.status}
        errorMessage={dialog.errorMessage}
        successTitle={PORTFOLIO_FORM.UPDATE_SUCCESS_TITLE}
        successDescription={
          PORTFOLIO_FORM.UPDATE_SUCCESS_DESCRIPTION
        }
        errorTitle={PORTFOLIO_FORM.ERROR_TITLE}
      />
    </>
  )
}

export { PortfolioEditDialog }
