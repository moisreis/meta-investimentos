"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"

import type { EntityDeleteToastStatus } from "@/presentation/parts/toasts/entity-delete-toast"
import { deleteStatementAction } from "@/presentation/routes/statement/actions/delete-statement.action"
import type { StatementResponseDTO } from "@/services/statement/dto/statement-response.dto"

/**
 * @summary
 * Manages the open and delete row actions of the statement
 * datatable.
 *
 * @remarks
 * Opens the statement file in a new tab and coordinates the
 * delete confirmation flow. The confirm handler runs the
 * server action, reports the delete status for the result
 * toast and refreshes the server data after a success.
 *
 * @returns The row actions and single-delete dialog state.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useStatementRowActions() {
  const ROUTER = useRouter()
  const [DELETE_TARGET, setDeleteTarget] =
    useState<StatementResponseDTO | null>(null)
  const [DELETE_PENDING, setDeletePending] = useState(false)
  const [DELETE_STATUS, setDeleteStatus] =
    useState<EntityDeleteToastStatus>("idle")
  const [DELETE_ERROR, setDeleteError] = useState<string | null>(
    null
  )

  const HandleOpen = useCallback(
    (statement: StatementResponseDTO) => {
      window.open(statement.fileUrl, "_blank", "noopener")
    },
    []
  )

  const HandleDelete = useCallback(
    (statement: StatementResponseDTO) => {
      setDeleteTarget(statement)
      setDeleteStatus("idle")
      setDeleteError(null)
    },
    []
  )

  const HandleConfirmDelete = useCallback(async () => {
    if (!DELETE_TARGET) return

    setDeletePending(true)
    const RESULT = await deleteStatementAction({
      statementId: DELETE_TARGET.id,
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
    handleView: HandleOpen,
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

export { useStatementRowActions }
