"use client"

import { useEntityBulkDeleteAction } from "@/presentation/parts/hooks/use-entity-bulk-delete-action.hook"
import { bulkDeleteBanksAction } from "@/presentation/routes/bank/actions/bulk-delete-banks.action"
import { BANK_DATATABLE } from "@/presentation/routes/bank/settings/labels.settings"
import type { BankRow } from "@/presentation/types/bank-row.types"

/**
 * @summary
 * Binds the bank bulk delete flow to the shared
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
 * @date 2026-09-26
 */
function useBankBulkDelete() {
  return useEntityBulkDeleteAction<BankRow>({
    run: (ids) => bulkDeleteBanksAction({ bankIds: ids }),
    labels: BANK_DATATABLE,
  })
}

export { useBankBulkDelete }
