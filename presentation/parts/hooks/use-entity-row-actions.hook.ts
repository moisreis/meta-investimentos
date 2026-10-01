"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"

import type { EntityDeleteToastStatus } from "@/presentation/parts/toasts/entity-delete-toast"
import type { EntityReverseToastStatus } from "@/presentation/parts/toasts/entity-reverse-toast"
import type { ActionResult } from "@/presentation/presenters/action-result.presenter"

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
  /** Marks the row as reversed instead of deleting it. */
  runReverse?: (id: string) => Promise<ActionResult<undefined>>
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
  handleReverse: (row: TData) => void
  handleConfirmReverse: () => Promise<void>
  reverseTarget: TData | null
  reverseOpen: boolean
  reversePending: boolean
  reverseStatus: EntityReverseToastStatus
  reverseError: string | null
  setReverseOpen: (open: boolean) => void
}

/**
 * @summary
 * Manages the row actions of an entity datatable.
 *
 * @remarks
 * Exposes the optional view navigation callback, the
 * delete target selection with the confirmed delete flow
 * and the reverse target selection with the confirmed
 * reverse flow. Each confirm handler runs its server
 * action, reports the result status for the matching
 * toast and refreshes the server data after a success.
 *
 * @explanation
 * Use inside the route datatable to keep the row action
 * state out of the presentational layer. Routes without a
 * detail screen omit `onView` and leave `handleView` as a
 * no-op, so the column builders decide whether to render a
 * view action. Routes with a detail screen pass `onView`
 * to push a route or open an external file. Routes with a
 * reverse flow pass `runReverse` so the row menu can offer
 * a reversal next to the deletion.
 *
 * @typeParam TData - Row type of the datatable.
 *
 * @param config - Action runner and optional view
 *   navigation.
 * @param config.runDelete - Maps the row id to the route
 *   delete action.
 * @param config.runReverse - Maps the row id to the route
 *   reverse action, when the route supports reversals.
 * @param config.onView - Optional detail screen navigation.
 *
 * @returns The row actions and the single-delete and
 *   single-reverse dialog state.
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
  runReverse,
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
  const [REVERSE_TARGET, setReverseTarget] =
    useState<TData | null>(null)
  const [REVERSE_PENDING, setReversePending] = useState(false)
  const [REVERSE_STATUS, setReverseStatus] =
    useState<EntityReverseToastStatus>("idle")
  const [REVERSE_ERROR, setReverseError] = useState<
    string | null
  >(null)

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

  const HandleReverse = useCallback((row: TData) => {
    setReverseTarget(row)
    setReverseStatus("idle")
    setReverseError(null)
  }, [])

  const HandleConfirmReverse = useCallback(async () => {
    if (!REVERSE_TARGET || !runReverse) return

    setReversePending(true)
    const RESULT = await runReverse(REVERSE_TARGET.id)
    setReversePending(false)

    if (!RESULT.success) {
      setReverseError(RESULT.error)
      setReverseStatus("error")
      setReverseTarget(null)
      return
    }

    setReverseStatus("success")
    setReverseTarget(null)
    ROUTER.refresh()
  }, [REVERSE_TARGET, runReverse, ROUTER])

  const UpdateReverseOpen = useCallback((open: boolean) => {
    if (!open) {
      setReverseTarget(null)
      setReverseStatus("idle")
      setReverseError(null)
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
    handleReverse: HandleReverse,
    handleConfirmReverse: HandleConfirmReverse,
    reverseTarget: REVERSE_TARGET,
    reverseOpen: REVERSE_TARGET !== null,
    reversePending: REVERSE_PENDING,
    reverseStatus: REVERSE_STATUS,
    reverseError: REVERSE_ERROR,
    setReverseOpen: UpdateReverseOpen,
  }
}

export { useEntityRowActions }
