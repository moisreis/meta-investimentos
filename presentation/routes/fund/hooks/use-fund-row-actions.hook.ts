"use client"

import { useEntityRowActions } from "@/presentation/parts/hooks/use-entity-row-actions.hook"
import type { EntityRowActionsModel } from "@/presentation/parts/hooks/use-entity-row-actions.hook"
import { deleteFundAction } from "@/presentation/routes/fund/actions/delete-fund.action"
import type { FundResponseDTO } from "@/services/fund/dto/fund-response.dto"

/**
 * @summary
 * Binds the fund row actions to the shared
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
function useFundRowActions(): EntityRowActionsModel<FundResponseDTO> {
  return useEntityRowActions<FundResponseDTO>({
    runDelete: (id) => deleteFundAction({ fundId: id }),
  })
}

export { useFundRowActions }
