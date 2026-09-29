"use client"

import { EntityAddDialog } from "@/presentation/parts/dialogs/entity-add"
import { EntityAddToast } from "@/presentation/parts/toasts/entity-add-toast"
import { GenerateStatementForm } from "@/presentation/routes/statement/forms/generate-report"
import { useStatementGenerateDialog } from "@/presentation/routes/statement/hooks/use-statement-generate-dialog.hook"
import {
  STATEMENT_DIALOG,
  STATEMENT_FORM,
} from "@/presentation/routes/statement/settings/labels.settings"
import type { PortfolioRow } from "@/presentation/types/portfolio-row.types"

/**
 * Props for the statement generate-report dialog.
 */
export interface StatementGenerateReportDialogProps {
  dialog: ReturnType<typeof useStatementGenerateDialog>
  portfolios: PortfolioRow[]
  // Portfolio preselected when the dialog opens, so a screen
  // that already shows one portfolio generates its report
  // without a second selection. Omit to leave the field
  // unset.
  defaultPortfolioId?: string
}

/**
 * @summary
 * Renders the statement generate-report dialog flow.
 *
 * @remarks
 * Composes the shared add dialog with the generate form and
 * the result toast. On success the dialog closes and the
 * page refreshes so the new statement appears in the table.
 *
 * @param props - Props of the generate-report dialog.
 * @param props.dialog - The generate dialog flow state.
 * @param props.portfolios - Options of the portfolio field.
 * @param props.defaultPortfolioId - Portfolio preselected
 *   when the dialog opens.
 *
 * @returns The statement generate-report dialog flow.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function StatementGenerateReportDialog({
  dialog,
  portfolios,
  defaultPortfolioId,
}: StatementGenerateReportDialogProps) {
  return (
    <>
      <EntityAddDialog
        open={dialog.open}
        onOpenChange={dialog.setOpen}
        title={STATEMENT_DIALOG.GENERATE_TITLE}
        description={STATEMENT_DIALOG.GENERATE_DESCRIPTION}
      >
        <GenerateStatementForm
          key={dialog.formKey}
          portfolios={portfolios}
          defaultPortfolioId={defaultPortfolioId}
          onStatusChange={dialog.handleStatusChange}
        />
      </EntityAddDialog>

      <EntityAddToast
        status={dialog.status}
        errorMessage={dialog.errorMessage}
        successTitle={STATEMENT_FORM.GENERATE_SUCCESS_TITLE}
        successDescription={
          STATEMENT_FORM.GENERATE_SUCCESS_DESCRIPTION
        }
        errorTitle={STATEMENT_FORM.ERROR_TITLE}
      />
    </>
  )
}

export { StatementGenerateReportDialog }
