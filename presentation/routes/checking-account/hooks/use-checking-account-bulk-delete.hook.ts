"use client"

import { useEntityBulkDeleteAction } from "@/presentation/parts/hooks/use-entity-bulk-delete-action.hook"
import type { EntityBulkDeleteModel } from "@/presentation/parts/hooks/use-entity-bulk-delete-action.hook"
import { bulkDeleteCheckingAccountsAction } from "@/presentation/routes/checking-account/actions/bulk-delete-checking-accounts.action"
import { CHECKING_ACCOUNT_DATATABLE } from "@/presentation/routes/checking-account/settings/labels.settings"
import type { CheckingAccountResponseDTO } from "@/services/checking-account/dto/checking-account-response.dto"

/**
 * @summary
 * Binds the checking account bulk delete flow to the shared
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
function useCheckingAccountBulkDelete(): EntityBulkDeleteModel<CheckingAccountResponseDTO> {
  return useEntityBulkDeleteAction<CheckingAccountResponseDTO>({
    run: (ids) =>
      bulkDeleteCheckingAccountsAction({
        checkingAccountIds: ids,
      }),
    labels: CHECKING_ACCOUNT_DATATABLE,
  })
}

export { useCheckingAccountBulkDelete }
