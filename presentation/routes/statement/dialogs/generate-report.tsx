"use client"

import { EntityAddDialog } from "@/presentation/parts/dialogs/entity-add"
import { EntityAlertDialog } from "@/presentation/parts/dialogs/entity-alert"
import { EntityAddToast } from "@/presentation/parts/toasts/entity-add-toast"
import { GenerateStatementForm } from "@/presentation/routes/statement/forms/generate-report"
import { useStatementGenerateDialog } from "@/presentation/routes/statement/hooks/use-statement-generate-dialog.hook"
import { useStatementOpenReport } from "@/presentation/routes/statement/hooks/use-statement-open-report.hook"
import {
  STATEMENT_DIALOG,
  STATEMENT_FORM,
} from "@/presentation/routes/statement/settings/labels.settings"
import type { PortfolioRow } from "@/presentation/types/portfolio-row.types"
import type { StatementResponseDTO } from "@/services/statement/dto/statement-response.dto"

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
 * The success toast carries a download action that opens the
 * generated PDF, built from the statement the form reported.
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
  const FILE_URL = (dialog.result as StatementResponseDTO | null)
    ?.fileUrl

  const openReport = useStatementOpenReport()

  const OPEN_REPORT = openReport.openReport

  const SUCCESS_ACTION = FILE_URL
    ? {
        label: STATEMENT_FORM.GENERATE_SUCCESS_ACTION,
        onClick: () => void OPEN_REPORT(FILE_URL),
      }
    : null

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
        successAction={SUCCESS_ACTION}
      />

      <EntityAlertDialog
        open={openReport.alertOpen}
        onOpenChange={openReport.setAlertOpen}
        title={STATEMENT_FORM.OPEN_ERROR_TITLE}
        description={openReport.alertDescription}
        closeLabel={STATEMENT_FORM.OPEN_ERROR_CLOSE}
      />
    </>
  )
}

export { StatementGenerateReportDialog }
