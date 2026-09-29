"use client"

import { useEntityBulkDeleteAction } from "@/presentation/parts/hooks/use-entity-bulk-delete-action.hook"
import { bulkDeleteBankAccountsAction } from "@/presentation/routes/bank-account/actions/bulk-delete-bank-accounts.action"
import { BANK_ACCOUNT_DATATABLE } from "@/presentation/routes/bank-account/settings/labels.settings"
import type { BankAccountRow } from "@/presentation/types/bank-account-row.types"

/**
 * @summary
 * Binds the bank account bulk delete flow to the shared
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
function useBankAccountBulkDelete() {
  return useEntityBulkDeleteAction<BankAccountRow>({
    run: (ids) =>
      bulkDeleteBankAccountsAction({ bankAccountIds: ids }),
    labels: BANK_ACCOUNT_DATATABLE,
  })
}

export { useBankAccountBulkDelete }
