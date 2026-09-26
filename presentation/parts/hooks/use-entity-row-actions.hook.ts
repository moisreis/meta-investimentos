"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"

import type { EntityDeleteToastStatus } from "@/presentation/parts/toasts/entity-delete-toast"
import type { ActionResult } from "@/presentation/types/action-result"

// Router instance returned by the navigation use router hook.
type EntityRouter = ReturnType<typeof useRouter>

/**
 * Configuration of the row actions of an entity route.
 *
 * @typeParam TData - Row type of the datatable.
 */
export interface EntityRowActionsConfig<
  TData extends { id: string },
> {
  runDelete: (id: string) => Promise<ActionResult<undefined>>
  onView?: (row: TData, router: EntityRouter) => void
}

/**
 * View model of the row actions of an entity route.
 *
 * @typeParam TData - Row type of the datatable.
 */
export interface EntityRowActionsModel<TData> {
  handleView: (row: TData) => void
  handleDelete: (row: TData) => void
  handleConfirmDelete: () => Promise<void>
  deleteTarget: TData | null
  deleteOpen: boolean
  deletePending: boolean
  deleteStatus: EntityDeleteToastStatus
  deleteError: string | null
  setDeleteOpen: (open: boolean) => void
}

/**
 * @summary
 * Manages the row actions of an entity datatable.
 *
 * @remarks
 * Exposes the optional view navigation callback, the
 * delete target selection and the confirmed delete flow.
 * The confirm handler runs the server action, reports the
 * delete status for the result toast and refreshes the
 * server data after a successful deletion.
 *
 * @explanation
 * Use inside the route datatable to keep the row action
 * state out of the presentational layer. Routes without a
 * detail screen omit `onView` and leave `handleView` as a
 * no-op, so the column builders decide whether to render a
 * view action. Routes with a detail screen pass `onView`
 * to push a route or open an external file.
 *
 * @typeParam TData - Row type of the datatable.
 *
 * @param config - Action runner and optional view
 *   navigation.
 * @param config.runDelete - Maps the row id to the route
 *   delete action.
 * @param config.onView - Optional detail screen navigation.
 *
 * @returns The row actions and single-delete dialog state.
 *
 * @example
 * const ROW_ACTIONS = useEntityRowActions<BankResponseDTO>({
 *   runDelete: (id) => deleteBankAction({ bankId: id }),
 * })
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function useEntityRowActions<TData extends { id: string }>({
  runDelete,
  onView,
}: EntityRowActionsConfig<TData>): EntityRowActionsModel<TData> {
  const ROUTER = useRouter()
  const [DELETE_TARGET, setDeleteTarget] =
    useState<TData | null>(null)
  const [DELETE_PENDING, setDeletePending] = useState(false)
  const [DELETE_STATUS, setDeleteStatus] =
    useState<EntityDeleteToastStatus>("idle")
  const [DELETE_ERROR, setDeleteError] = useState<string | null>(
    null
  )

  const HandleView = useCallback(
    (row: TData) => {
      onView?.(row, ROUTER)
    },
    [onView, ROUTER]
  )

  const HandleDelete = useCallback((row: TData) => {
    setDeleteTarget(row)
    setDeleteStatus("idle")
    setDeleteError(null)
  }, [])

  const HandleConfirmDelete = useCallback(async () => {
    if (!DELETE_TARGET) return

    setDeletePending(true)
    const RESULT = await runDelete(DELETE_TARGET.id)
    setDeletePending(false)

    if (!RESULT.success) {
      setDeleteError(RESULT.error)
      setDeleteStatus("error")
      setDeleteTarget(null)
      return
    }

    setDeleteStatus("success")
    setDeleteTarget(null)
    ROUTER.refresh()
  }, [DELETE_TARGET, runDelete, ROUTER])

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

export { useEntityRowActions }
