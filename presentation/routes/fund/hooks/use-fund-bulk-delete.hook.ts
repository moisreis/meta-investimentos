"use client"

import { useRouter } from "next/navigation"

import { useAuthFormToast } from "@/presentation/parts/hooks/use-auth-form-toast.hook"
import { bulkDeleteFundsAction } from "@/presentation/routes/fund/actions/bulk-delete-funds.action"
import { FUND_DATATABLE } from "@/presentation/routes/fund/settings/labels.settings"
import type { FundResponseDTO } from "@/services/fund/dto/fund-response.dto"

/**
 * @summary
 * Manages the bulk delete flow of the fund datatable.
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
function useFundBulkDelete() {
  const ROUTER = useRouter()
  const { showSuccess, showError } = useAuthFormToast({
    successTitle: FUND_DATATABLE.BULK_DELETE_SUCCESS_TITLE,
    successDescription:
      FUND_DATATABLE.BULK_DELETE_SUCCESS_DESCRIPTION,
    errorTitle: FUND_DATATABLE.BULK_DELETE_ERROR_TITLE,
  })

  async function HandleBulkDelete(items: FundResponseDTO[]) {
    const RESULT = await bulkDeleteFundsAction({
      fundIds: items.map((item) => item.id),
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

export { useFundBulkDelete }
