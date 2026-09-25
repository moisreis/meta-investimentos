"use client"

import { useRouter } from "next/navigation"

import { useAuthFormToast } from "@/presentation/parts/hooks/use-auth-form-toast.hook"
import { bulkDeleteBanksAction } from "@/presentation/routes/bank/actions/bulk-delete-banks.action"
import { BANK_DATATABLE } from "@/presentation/routes/bank/settings/labels.settings"
import type { BankResponseDTO } from "@/services/bank/dto/bank-response.dto"

/**
 * @summary
 * Manages the bulk delete flow of the bank datatable.
 *
 * @remarks
 * Runs the bulk delete server action with the ids of the
 * selected rows, toasts the outcome and refreshes the
 * server data after a successful deletion.
 *
 * @returns The callback invoked with the selected items.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useBankBulkDelete() {
  const ROUTER = useRouter()
  const { showSuccess, showError } = useAuthFormToast({
    successTitle: BANK_DATATABLE.BULK_DELETE_SUCCESS_TITLE,
    successDescription:
      BANK_DATATABLE.BULK_DELETE_SUCCESS_DESCRIPTION,
    errorTitle: BANK_DATATABLE.BULK_DELETE_ERROR_TITLE,
  })

  async function HandleBulkDelete(items: BankResponseDTO[]) {
    const RESULT = await bulkDeleteBanksAction({
      bankIds: items.map((item) => item.id),
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

export { useBankBulkDelete }
