"use client"

import { useRouter } from "next/navigation"

import { useAuthFormToast } from "@/presentation/parts/hooks/use-auth-form-toast.hook"
import { bulkDeleteCheckingAccountsAction } from "@/presentation/routes/checking-account/actions/bulk-delete-checking-accounts.action"
import { CHECKING_ACCOUNT_DATATABLE } from "@/presentation/routes/checking-account/settings/labels.settings"
import type { CheckingAccountResponseDTO } from "@/services/checking-account/dto/checking-account-response.dto"

/**
 * @summary
 * Manages the bulk delete flow of the checking account
 * datatable.
 *
 * @remarks
 * Runs the bulk delete server action with the ids of
 * the selected rows, toasts the outcome and refreshes
 * the server data after a successful deletion.
 *
 * @returns The callback invoked with the selected
 *          items.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useCheckingAccountBulkDelete() {
  const ROUTER = useRouter()
  const { showSuccess, showError } = useAuthFormToast({
    successTitle:
      CHECKING_ACCOUNT_DATATABLE.BULK_DELETE_SUCCESS_TITLE,
    successDescription:
      CHECKING_ACCOUNT_DATATABLE.BULK_DELETE_SUCCESS_DESCRIPTION,
    errorTitle:
      CHECKING_ACCOUNT_DATATABLE.BULK_DELETE_ERROR_TITLE,
  })

  async function HandleBulkDelete(
    items: CheckingAccountResponseDTO[]
  ) {
    const RESULT = await bulkDeleteCheckingAccountsAction({
      checkingAccountIds: items.map((item) => item.id),
    })

    if (RESULT.error) {
      showError(RESULT.error)
      return
    }

    showSuccess()
    ROUTER.refresh()
  }

  return { handleBulkDelete: HandleBulkDelete }
}

export { useCheckingAccountBulkDelete }
