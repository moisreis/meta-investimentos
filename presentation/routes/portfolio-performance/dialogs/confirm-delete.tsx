"use client"

import { EntityConfirmDeleteDialog } from "@/presentation/parts/dialogs/entity-confirm-delete"
import { EntityDeleteToast } from "@/presentation/parts/toasts/entity-delete-toast"
import { FormatPortfolioLookup } from "@/presentation/presenters/lookup.presenter"
import { usePortfolioPerformanceRowActions } from "@/presentation/routes/portfolio-performance/hooks/use-portfolio-performance-row-actions.hook"
import { PORTFOLIO_PERFORMANCE_DATATABLE } from "@/presentation/routes/portfolio-performance/settings/labels.settings"
import type { PortfolioPerformanceRowLookup } from "@/presentation/routes/portfolio-performance/types/portfolio-performance-list.types"

/**
 * Props for the portfolio performance confirm-delete dialog.
 */
export interface PortfolioPerformanceConfirmDeleteDialogProps {
  dialog: ReturnType<typeof usePortfolioPerformanceRowActions>
  lookups: {
    rows: Record<string, PortfolioPerformanceRowLookup>
  }
}

/**
 * @summary
 * Renders the portfolio performance confirm-delete dialog flow.
 *
 * @remarks
 * Composes the shared confirm-delete dialog with the
 * portfolio performance copy and the delete result toast.
 * The title and description come from the datatable settings;
 * the portfolio name resolves per row through the lookup
 * presenter.
 *
 * @param props - Props of the confirm-delete dialog.
 * @param props.dialog - The row actions flow state.
 * @param props.lookups - The portfolio performance row lookups.
 *
 * @returns The portfolio performance confirm-delete dialog flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
function PortfolioPerformanceConfirmDeleteDialog({
  dialog,
  lookups,
}: PortfolioPerformanceConfirmDeleteDialogProps) {
  const TARGET = dialog.deleteTarget

  const LOOKUP = TARGET ? lookups.rows[TARGET.id] : null

  return (
    <>
      <EntityConfirmDeleteDialog
        open={dialog.deleteOpen}
        onOpenChange={dialog.setDeleteOpen}
        title={PORTFOLIO_PERFORMANCE_DATATABLE.DELETE_TITLE}
        description={LOOKUP ? FormatPortfolioLookup(LOOKUP) : ""}
        confirmLabel={
          PORTFOLIO_PERFORMANCE_DATATABLE.DELETE_CONFIRM_LABEL
        }
        cancelLabel={
          PORTFOLIO_PERFORMANCE_DATATABLE.DELETE_CANCEL_LABEL
        }
        pending={dialog.deletePending}
        onConfirm={dialog.handleConfirmDelete}
      />

      <EntityDeleteToast
        status={dialog.deleteStatus}
        errorMessage={dialog.deleteError}
        successTitle={
          PORTFOLIO_PERFORMANCE_DATATABLE.DELETE_SUCCESS_TITLE
        }
        successDescription={
          PORTFOLIO_PERFORMANCE_DATATABLE.DELETE_SUCCESS_DESCRIPTION
        }
        errorTitle={
          PORTFOLIO_PERFORMANCE_DATATABLE.DELETE_ERROR_TITLE
        }
      />
    </>
  )
}

export { PortfolioPerformanceConfirmDeleteDialog }
