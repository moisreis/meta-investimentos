"use client"

import { useEntityRowActions } from "@/presentation/parts/hooks/use-entity-row-actions.hook"
import { deleteBankAccountAction } from "@/presentation/routes/bank-account/actions/delete-bank-account.action"
import type { BankAccountRow } from "@/presentation/types/bank-account-row.types"

/**
 * @summary
 * Binds the bank account row actions to the shared
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
function useBankAccountRowActions() {
  return useEntityRowActions<BankAccountRow>({
    runDelete: (id) =>
      deleteBankAccountAction({ bankAccountId: id }),
  })
}

export { useBankAccountRowActions }
