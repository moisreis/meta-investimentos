"use client"

import { useRouter } from "next/navigation"

import { useAuthFormToast } from "@/presentation/parts/hooks/use-auth-form-toast.hook"
import { bulkDeleteStatementsAction } from "@/presentation/routes/statement/actions/bulk-delete-statements.action"
import { STATEMENT_DATATABLE } from "@/presentation/routes/statement/settings/labels.settings"
import type { StatementResponseDTO } from "@/services/statement/dto/statement-response.dto"

/**
 * @summary
 * Manages the bulk delete flow of the statement datatable.
 *
 * @remarks
 * Runs the bulk delete server action with the ids of the
 * selected rows, toasts the outcome and refreshes the
 * server data after a successful deletion.
 *
 * @returns The callback invoked with the selected items.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useStatementBulkDelete() {
  const ROUTER = useRouter()
  const { showSuccess, showError } = useAuthFormToast({
    successTitle: STATEMENT_DATATABLE.BULK_DELETE_SUCCESS_TITLE,
    successDescription:
      STATEMENT_DATATABLE.BULK_DELETE_SUCCESS_DESCRIPTION,
    errorTitle: STATEMENT_DATATABLE.BULK_DELETE_ERROR_TITLE,
  })

  async function HandleBulkDelete(
    items: StatementResponseDTO[]
  ) {
    const RESULT = await bulkDeleteStatementsAction({
      statementIds: items.map((item) => item.id),
    })

    if (RESULT.error) {
      showError(RESULT.error)
      return
    }

    showSuccess()
    ROUTER.refresh()
  }

  return { handleBulkDelete: HandleBulkDelete }
}

export { useStatementBulkDelete }
