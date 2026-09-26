"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"

import type { EntityDeleteToastStatus } from "@/presentation/parts/toasts/entity-delete-toast"
import { deleteUserAction } from "@/presentation/routes/users/actions/delete-user.action"
import type { UserResponseDTO } from "@/services/user/dto/user-response.dto"

/**
 * @summary
 * Manages the delete row action of the user datatable.
 *
 * @remarks
 * Exposes the delete target selection and the confirmed
 * delete flow. The confirm handler runs the server
 * action, reports the delete status for the result toast
 * and refreshes the server data after a successful
 * deletion.
 *
 * @returns The row action and single-delete dialog state.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useUserRowActions() {
  const ROUTER = useRouter()
  const [DELETE_TARGET, setDeleteTarget] =
    useState<UserResponseDTO | null>(null)
  const [DELETE_PENDING, setDeletePending] = useState(false)
  const [DELETE_STATUS, setDeleteStatus] =
    useState<EntityDeleteToastStatus>("idle")
  const [DELETE_ERROR, setDeleteError] = useState<string | null>(
    null
  )

  const HandleDelete = useCallback((user: UserResponseDTO) => {
    setDeleteTarget(user)
    setDeleteStatus("idle")
    setDeleteError(null)
  }, [])

  const HandleConfirmDelete = useCallback(async () => {
    if (!DELETE_TARGET) return

    setDeletePending(true)
    const RESULT = await deleteUserAction({
      userId: DELETE_TARGET.id,
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

export { useUserRowActions }
