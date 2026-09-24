"use client"

import { useRouter } from "next/navigation"

import { useAuthFormToast } from "@/presentation/parts/hooks/use-auth-form-toast.hook"
import { bulkDeletePortfoliosAction } from "@/presentation/routes/portfolio/actions/bulk-delete-portfolios.action"
import { PORTFOLIO_DATATABLE } from "@/presentation/routes/portfolio/settings/labels.settings"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"

/**
 * @summary
 * Manages the bulk delete flow of the portfolio datatable.
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
 * @date 2026-09-24
 */
function usePortfolioBulkDelete() {
  const ROUTER = useRouter()
  const { showSuccess, showError } = useAuthFormToast({
    successTitle: PORTFOLIO_DATATABLE.BULK_DELETE_SUCCESS_TITLE,
    successDescription:
      PORTFOLIO_DATATABLE.BULK_DELETE_SUCCESS_DESCRIPTION,
    errorTitle: PORTFOLIO_DATATABLE.BULK_DELETE_ERROR_TITLE,
  })

  async function HandleBulkDelete(
    items: PortfolioResponseDTO[]
  ) {
    const RESULT = await bulkDeletePortfoliosAction({
      portfolioIds: items.map((item) => item.id),
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

export { usePortfolioBulkDelete }
