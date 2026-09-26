"use client"

import { useEntityRowActions } from "@/presentation/parts/hooks/use-entity-row-actions.hook"
import type { EntityRowActionsModel } from "@/presentation/parts/hooks/use-entity-row-actions.hook"
import { deleteBankAction } from "@/presentation/routes/bank/actions/delete-bank.action"
import type { BankResponseDTO } from "@/services/bank/dto/bank-response.dto"

/**
 * @summary
 * Binds the bank row actions to the shared
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
function useBankRowActions(): EntityRowActionsModel<BankResponseDTO> {
  return useEntityRowActions<BankResponseDTO>({
    runDelete: (id) => deleteBankAction({ bankId: id }),
  })
}

export { useBankRowActions }
