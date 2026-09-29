"use client"

import { useEntityRowActions } from "@/presentation/parts/hooks/use-entity-row-actions.hook"
import { deleteUserAction } from "@/presentation/routes/users/actions/delete-user.action"
import type { UserRow } from "@/presentation/types/user-row.types"

/**
 * @summary
 * Binds the users row actions to the shared
 * entity row actions hook.
 *
 * @remarks
 * Maps the row id to the route delete server action
 * only. The shared hook owns the confirm dialog
 * state and the delete result toast status.
 *
 * @returns The row actions and delete dialog state.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function useUserRowActions() {
  return useEntityRowActions<UserRow>({
    runDelete: (id) => deleteUserAction({ userId: id }),
  })
}

export { useUserRowActions }
