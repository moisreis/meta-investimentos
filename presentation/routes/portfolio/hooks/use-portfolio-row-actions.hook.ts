"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"

import type { EntityDeleteToastStatus } from "@/presentation/parts/toasts/entity-delete-toast"
import { deletePortfolioAction } from "@/presentation/routes/portfolio/actions/delete-portfolio.action"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"

// Builds the view portfolio screen route.
const viewPortfolioRoute = (portfolioId: string): string =>
  `/portfolio/${portfolioId}`

/**
 * @summary
 * Manages the view and delete row actions of the
 * portfolio datatable.
 *
 * @remarks
 * Exposes the view navigation callback, the delete
 * target selection and the confirmed delete flow. The
 * confirm handler runs the server action, reports the
 * delete status for the result toast and refreshes the
 * server data after a successful deletion.
 *
 * @returns The row actions and single-delete dialog state.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function usePortfolioRowActions() {
  const ROUTER = useRouter()
  const [DELETE_TARGET, setDeleteTarget] =
    useState<PortfolioResponseDTO | null>(null)
  const [DELETE_PENDING, setDeletePending] = useState(false)
  const [DELETE_STATUS, setDeleteStatus] =
    useState<EntityDeleteToastStatus>("idle")
  const [DELETE_ERROR, setDeleteError] = useState<string | null>(
    null
  )

  const HandleView = useCallback(
    (portfolio: PortfolioResponseDTO) => {
      ROUTER.push(viewPortfolioRoute(portfolio.id))
    },
    [ROUTER]
  )

  const HandleDelete = useCallback(
    (portfolio: PortfolioResponseDTO) => {
      setDeleteTarget(portfolio)
      setDeleteStatus("idle")
      setDeleteError(null)
    },
    []
  )

  const HandleConfirmDelete = useCallback(async () => {
    if (!DELETE_TARGET) return

    setDeletePending(true)
    const RESULT = await deletePortfolioAction({
      portfolioId: DELETE_TARGET.id,
    })
    setDeletePending(false)

    if (RESULT.error) {
      setDeleteError(RESULT.error)
      setDeleteStatus("error")
      setDeleteTarget(null)
      return
    }

    setDeleteStatus("success")
    setDeleteTarget(null)
    ROUTER.refresh()
  }, [DELETE_TARGET, ROUTER])

  const UpdateDeleteOpen = useCallback((open: boolean) => {
    if (!open) {
      setDeleteTarget(null)
      setDeleteStatus("idle")
      setDeleteError(null)
    }
  }, [])

  return {
    handleView: HandleView,
    handleDelete: HandleDelete,
    handleConfirmDelete: HandleConfirmDelete,
    deleteTarget: DELETE_TARGET,
    deleteOpen: DELETE_TARGET !== null,
    deletePending: DELETE_PENDING,
    deleteStatus: DELETE_STATUS,
    deleteError: DELETE_ERROR,
    setDeleteOpen: UpdateDeleteOpen,
  }
}

export { usePortfolioRowActions }
