"use client"

import { EntityConfirmDeleteDialog } from "@/presentation/parts/dialogs/entity-confirm-delete"
import { EntityDeleteToast } from "@/presentation/parts/toasts/entity-delete-toast"
import { usePortfolioRowActions } from "@/presentation/routes/portfolio/hooks/use-portfolio-row-actions.hook"
import {
  PORTFOLIO_DATATABLE,
  FormatDeletePortfolioDescription,
} from "@/presentation/routes/portfolio/settings/labels.settings"

/**
 * Props for the portfolio confirm-delete dialog.
 */
export interface PortfolioConfirmDeleteDialogProps {
  dialog: ReturnType<typeof usePortfolioRowActions>
}

/**
 * @summary
 * Renders the portfolio confirm-delete dialog flow.
 *
 * @remarks
 * Composes the shared confirm-delete dialog with the
 * portfolio copy and the delete result toast. The title
 * and description come from the datatable settings.
 *
 * @param props - Props of the confirm-delete dialog.
 * @param props.dialog - The row actions flow state.
 *
 * @returns The portfolio confirm-delete dialog flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function PortfolioConfirmDeleteDialog({
  dialog,
}: PortfolioConfirmDeleteDialogProps) {
  return (
    <>
      <EntityConfirmDeleteDialog
        open={dialog.deleteOpen}
        onOpenChange={dialog.setDeleteOpen}
        title={PORTFOLIO_DATATABLE.DELETE_TITLE}
        description={
          dialog.deleteTarget
            ? FormatDeletePortfolioDescription(
                dialog.deleteTarget.name
              )
            : ""
        }
        confirmLabel={PORTFOLIO_DATATABLE.DELETE_CONFIRM_LABEL}
        cancelLabel={PORTFOLIO_DATATABLE.DELETE_CANCEL_LABEL}
        pending={dialog.deletePending}
        onConfirm={dialog.handleConfirmDelete}
      />

      <EntityDeleteToast
        status={dialog.deleteStatus}
        errorMessage={dialog.deleteError}
        successTitle={PORTFOLIO_DATATABLE.DELETE_SUCCESS_TITLE}
        successDescription={
          PORTFOLIO_DATATABLE.DELETE_SUCCESS_DESCRIPTION
        }
        errorTitle={PORTFOLIO_DATATABLE.DELETE_ERROR_TITLE}
      />
    </>
  )
}

export { PortfolioConfirmDeleteDialog }
