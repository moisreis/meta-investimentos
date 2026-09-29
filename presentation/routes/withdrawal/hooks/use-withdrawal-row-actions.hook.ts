"use client"

import { useEntityRowActions } from "@/presentation/parts/hooks/use-entity-row-actions.hook"
import { deleteWithdrawalAction } from "@/presentation/routes/withdrawal/actions/delete-withdrawal.action"
import { reverseWithdrawalAction } from "@/presentation/routes/withdrawal/actions/reverse-withdrawal.action"
import type { WithdrawalRow } from "@/presentation/types/withdrawal-row.types"

/**
 * @summary
 * Binds the withdrawal row actions to the shared
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
function useWithdrawalRowActions() {
  return useEntityRowActions<WithdrawalRow>({
    runDelete: (id) => deleteWithdrawalAction({ withdrawalId: id }),
    runReverse: (id) =>
      reverseWithdrawalAction({ withdrawalId: id }),
  })
}

export { useWithdrawalRowActions }