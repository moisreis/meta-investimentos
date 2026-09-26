"use client"

import { useEntityRowActions } from "@/presentation/parts/hooks/use-entity-row-actions.hook"
import type { EntityRowActionsModel } from "@/presentation/parts/hooks/use-entity-row-actions.hook"
import { deleteStatementAction } from "@/presentation/routes/statement/actions/delete-statement.action"
import type { StatementResponseDTO } from "@/services/statement/dto/statement-response.dto"

/**
 * @summary
 * Binds the statement row actions to the shared
 * entity row actions hook.
 *
 * @remarks
 * Maps the row id to the route delete server action
 * and wires the detail screen navigation of the
 * row. The shared hook owns the confirm dialog
 * state and the delete result toast status.
 *
 * @returns The row actions and delete dialog state.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function useStatementRowActions(): EntityRowActionsModel<StatementResponseDTO> {
  return useEntityRowActions<StatementResponseDTO>({
    runDelete: (id) =>
      deleteStatementAction({ statementId: id }),
    onView: (row) =>
      window.open(row.fileUrl, "_blank", "noopener"),
  })
}

export { useStatementRowActions }
