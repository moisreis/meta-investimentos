"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"

import { useAuthFormToast } from "@/presentation/parts/hooks/use-auth-form-toast.hook"
import { deletePortfolioAction } from "@/presentation/routes/portfolio/actions/delete-portfolio.action"
import { PORTFOLIO_DATATABLE } from "@/presentation/routes/portfolio/settings/labels.settings"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"

// Builds the edit portfolio screen route.
const editPortfolioRoute = (portfolioId: string): string =>
  `/portfolio/${portfolioId}/edit`

// Builds the view portfolio screen route.
const viewPortfolioRoute = (portfolioId: string): string =>
  `/portfolio/${portfolioId}`

/**
 * @summary
 * Manages the row actions of the portfolio datatable.
 *
 * @remarks
 * Exposes the view and edit navigation callbacks, the delete
 * target selection and the confirmed delete flow. The confirm
 * handler runs the server action, toasts the outcome and
 * refreshes the server data after a successful deletion.
 *
 * @returns The row actions, single-delete dialog state and
 * confirm handler.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
function usePortfolioRowActions() {
  const ROUTER = useRouter()
  const { showSuccess, showError } = useAuthFormToast({
    successTitle: PORTFOLIO_DATATABLE.DELETE_SUCCESS_TITLE,
    successDescription:
      PORTFOLIO_DATATABLE.DELETE_SUCCESS_DESCRIPTION,
    errorTitle: PORTFOLIO_DATATABLE.DELETE_ERROR_TITLE,
  })

  const [deleteTarget, setDeleteTarget] =
    useState<PortfolioResponseDTO | null>(null)
  const [deletePending, setDeletePending] = useState(false)

  const HandleView = useCallback(
    (portfolio: PortfolioResponseDTO) => {
      ROUTER.push(viewPortfolioRoute(portfolio.id))
    },
    [ROUTER]
  )

  const HandleEdit = useCallback(
    (portfolio: PortfolioResponseDTO) => {
      ROUTER.push(editPortfolioRoute(portfolio.id))
    },
    [ROUTER]
  )

  const HandleDelete = useCallback(
    (portfolio: PortfolioResponseDTO) => {
      setDeleteTarget(portfolio)
    },
    []
  )

  const HandleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return

    setDeletePending(true)
    const RESULT = await deletePortfolioAction({
      portfolioId: deleteTarget.id,
    })
    setDeletePending(false)

    if (RESULT.error) {
      showError(RESULT.error)
      setDeleteTarget(null)
      return
    }

    showSuccess()
    setDeleteTarget(null)
    ROUTER.refresh()
  }, [deleteTarget, ROUTER, showError, showSuccess])

  function UpdateDeleteOpen(open: boolean) {
    if (!open) setDeleteTarget(null)
  }

  return {
    handleView: HandleView,
    handleEdit: HandleEdit,
    handleDelete: HandleDelete,
    deleteTarget,
    deleteOpen: deleteTarget !== null,
    deletePending,
    setDeleteOpen: UpdateDeleteOpen,
    handleConfirmDelete: HandleConfirmDelete,
  }
}

export { usePortfolioRowActions }
