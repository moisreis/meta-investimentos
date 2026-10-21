"use client"

import { useEntityRowActions } from "@/presentation/parts/hooks/use-entity-row-actions.hook"
import { deleteStatementAction } from "@/presentation/routes/statement/actions/delete-statement.action"
import type { StatementRow } from "@/presentation/types/statement-row.types"

import { useStatementOpenReport } from "./use-statement-open-report.hook"

/**
 * @summary
 * Binds the statement row actions to the shared
 * entity row actions hook.
 *
 * @remarks
 * Maps the row id to the route delete server action
 * and wires the open action of the row. Opening is
 * checked first so a report whose month holds no IPCA
 * reading states why in-app instead of opening a blank
 * tab, and the check also owns the notice dialog state
 * the list page renders.
 *
 * @returns The row actions, the delete dialog state
 *   and the open-report notice state.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function useStatementRowActions() {
  const openReport = useStatementOpenReport()

  const ROW_ACTIONS = useEntityRowActions<StatementRow>({
    runDelete: (id) =>
      deleteStatementAction({ statementId: id }),
    onView: (row) => void openReport.openReport(row.fileUrl),
  })

  return { ...ROW_ACTIONS, ...openReport }
}

export { useStatementRowActions }
