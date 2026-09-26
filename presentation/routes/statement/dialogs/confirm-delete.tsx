"use client"

import { EntityConfirmDeleteDialog } from "@/presentation/parts/dialogs/entity-confirm-delete"
import { EntityDeleteToast } from "@/presentation/parts/toasts/entity-delete-toast"
import { FormatStatementPeriod } from "@/presentation/routes/statement/helpers/format-statement-period.helper"
import { useStatementRowActions } from "@/presentation/routes/statement/hooks/use-statement-row-actions.hook"
import {
  FormatDeleteStatementDescription,
  STATEMENT_DATATABLE,
} from "@/presentation/routes/statement/settings/labels.settings"
import type { StatementRowSummary } from "@/presentation/routes/statement/types/statement-list.types"

/**
 * Props for the statement confirm-delete dialog.
 */
export interface StatementConfirmDeleteDialogProps {
  dialog: ReturnType<typeof useStatementRowActions>
  summaries: Record<string, StatementRowSummary> | null
}

/**
 * @summary
 * Renders the statement confirm-delete dialog flow.
 *
 * @remarks
 * Composes the shared confirm-delete dialog with the
 * statement copy and the delete result toast. The title and
 * description come from the datatable settings; the period
 * label and the portfolio name resolve per row.
 *
 * @param props - Props of the confirm-delete dialog.
 * @param props.dialog - The row actions flow state.
 * @param props.summaries - Per-row derived data keyed by id.
 *
 * @returns The statement confirm-delete dialog flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function StatementConfirmDeleteDialog({
  dialog,
  summaries,
}: StatementConfirmDeleteDialogProps) {
  const TARGET = dialog.deleteTarget

  return (
    <>
      <EntityConfirmDeleteDialog
        open={dialog.deleteOpen}
        onOpenChange={dialog.setDeleteOpen}
        title={STATEMENT_DATATABLE.DELETE_TITLE}
        description={
          TARGET
            ? FormatDeleteStatementDescription(
                FormatStatementPeriod(TARGET.periodStart),
                summaries?.[TARGET.id]?.portfolioName ?? ""
              )
            : ""
        }
        confirmLabel={STATEMENT_DATATABLE.DELETE_CONFIRM_LABEL}
        cancelLabel={STATEMENT_DATATABLE.DELETE_CANCEL_LABEL}
        pending={dialog.deletePending}
        onConfirm={dialog.handleConfirmDelete}
      />

      <EntityDeleteToast
        status={dialog.deleteStatus}
        errorMessage={dialog.deleteError}
        successTitle={STATEMENT_DATATABLE.DELETE_SUCCESS_TITLE}
        successDescription={
          STATEMENT_DATATABLE.DELETE_SUCCESS_DESCRIPTION
        }
        errorTitle={STATEMENT_DATATABLE.DELETE_ERROR_TITLE}
      />
    </>
  )
}

export { StatementConfirmDeleteDialog }
