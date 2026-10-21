"use client"

import { useEntityBulkDeleteAction } from "@/presentation/parts/hooks/use-entity-bulk-delete-action.hook"
import { bulkDeleteWithdrawalsAction } from "@/presentation/routes/withdrawal/actions/bulk-delete-withdrawals.action"
import { WITHDRAWAL_DATATABLE } from "@/presentation/routes/withdrawal/settings/labels.settings"
import type { WithdrawalRow } from "@/presentation/types/withdrawal-row.types"

/**
 * @summary
 * Binds the withdrawal bulk delete flow to the shared
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
 * @date 2026-10-20
 */
function useWithdrawalBulkDelete() {
  return useEntityBulkDeleteAction<WithdrawalRow>({
    run: (ids) =>
      bulkDeleteWithdrawalsAction({ withdrawalIds: ids }),
    labels: WITHDRAWAL_DATATABLE,
  })
}

export { useWithdrawalBulkDelete }
