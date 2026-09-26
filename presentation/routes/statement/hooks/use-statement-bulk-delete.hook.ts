"use client"

import { useEntityBulkDeleteAction } from "@/presentation/parts/hooks/use-entity-bulk-delete-action.hook"
import type { EntityBulkDeleteModel } from "@/presentation/parts/hooks/use-entity-bulk-delete-action.hook"
import { bulkDeleteStatementsAction } from "@/presentation/routes/statement/actions/bulk-delete-statements.action"
import { STATEMENT_DATATABLE } from "@/presentation/routes/statement/settings/labels.settings"
import type { StatementResponseDTO } from "@/services/statement/dto/statement-response.dto"

/**
 * @summary
 * Binds the statement bulk delete flow to the shared
 * entity bulk delete action.
 *
 * @remarks
 * Maps the selected row ids to the route bulk delete
 * server action and reuses the route datatable copy for
 * the outcome toast.
 *
 * @returns The bulk delete callback for the datatable.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function useStatementBulkDelete(): EntityBulkDeleteModel<StatementResponseDTO> {
  return useEntityBulkDeleteAction<StatementResponseDTO>({
    run: (ids) =>
      bulkDeleteStatementsAction({ statementIds: ids }),
    labels: STATEMENT_DATATABLE,
  })
}

export { useStatementBulkDelete }
