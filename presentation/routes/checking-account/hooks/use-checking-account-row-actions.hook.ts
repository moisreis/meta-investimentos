"use client"

import { useEntityRowActions } from "@/presentation/parts/hooks/use-entity-row-actions.hook"
import type { EntityRowActionsModel } from "@/presentation/parts/hooks/use-entity-row-actions.hook"
import { deleteCheckingAccountAction } from "@/presentation/routes/checking-account/actions/delete-checking-account.action"
import type { CheckingAccountResponseDTO } from "@/services/checking-account/dto/checking-account-response.dto"

/**
 * @summary
 * Binds the checking account row actions to the shared
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
function useCheckingAccountRowActions(): EntityRowActionsModel<CheckingAccountResponseDTO> {
  return useEntityRowActions<CheckingAccountResponseDTO>({
    runDelete: (id) =>
      deleteCheckingAccountAction({ checkingAccountId: id }),
  })
}

export { useCheckingAccountRowActions }
