"use client"

import { useEntityRowActions } from "@/presentation/parts/hooks/use-entity-row-actions.hook"
import { deleteApplicationAction } from "@/presentation/routes/application/actions/delete-application.action"
import { reverseApplicationAction } from "@/presentation/routes/application/actions/reverse-application.action"
import type { ApplicationRow } from "@/presentation/types/application-row.types"

/**
 * @summary
 * Binds the application row actions to the shared
 * entity row actions hook.
 *
 * @remarks
 * Maps the row id to the route delete and reverse server
 * actions. The shared hook owns the confirm dialogs
 * state and the delete and reverse result toast status.
 *
 * @returns The row actions and delete/reverse dialog state.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
function useApplicationRowActions() {
  return useEntityRowActions<ApplicationRow>({
    runDelete: (id) => deleteApplicationAction({ applicationId: id }),
    runReverse: (id) =>
      reverseApplicationAction({ applicationId: id }),
  })
}

export { useApplicationRowActions }