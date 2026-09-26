"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import type { EntityFormStatus } from "@/presentation/parts/hooks/use-entity-form.hook"

/**
 * View model of the edit dialog flow of an entity route.
 *
 * @typeParam TData - Row type the edit form is seeded
 *   with.
 */
export interface EntityEditDialogModel<TData> {
  target: TData | null
  open: boolean
  setOpen: (open: boolean) => void
  status: EntityFormStatus
  errorMessage: string | null
  handleOpen: (row: TData) => void
  handleStatusChange: (
    status: EntityFormStatus,
    error: string | null
  ) => void
}

/**
 * @summary
 * Coordinates the edit dialog flow of an entity route.
 *
 * @remarks
 * Tracks the row being edited, the dialog open state and
 * the form submit status. The row-actions menu triggers
 * `handleOpen` with the target row. On a successful
 * submit it closes the dialog and refreshes the server
 * data. A ref guards against closing the dialog after the
 * user dismissed it mid-submit.
 *
 * @explanation
 * Use inside the route edit dialog component to keep the
 * flow state out of the presentational layer. The target
 * seeds the edit form with the current row values. The
 * flow is entity agnostic: routes differ only in the row
 * type and the form they render inside the dialog.
 *
 * @typeParam TData - Row type the edit form is seeded
 *   with.
 *
 * @returns The edit dialog flow state and handlers.
 *
 * @example
 * const DIALOG = useEntityEditDialog<BankResponseDTO>()
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function useEntityEditDialog<
  TData,
>(): EntityEditDialogModel<TData> {
  const ROUTER = useRouter()
  const [TARGET, setTarget] = React.useState<TData | null>(null)
  const [STATUS, setStatus] =
    React.useState<EntityFormStatus>("idle")
  const [ERROR, setError] = React.useState<string | null>(null)
  const OPEN_REF = React.useRef(false)

  const HandleOpen = React.useCallback((row: TData) => {
    OPEN_REF.current = true
    setTarget(row)
    setStatus("idle")
    setError(null)
  }, [])

  const UpdateOpen = React.useCallback((open: boolean) => {
    OPEN_REF.current = open

    if (!open) {
      setTarget(null)
      setStatus("idle")
      setError(null)
    }
  }, [])

  const HandleStatusChange = React.useCallback(
    (status: EntityFormStatus, error: string | null) => {
      setStatus(status)
      setError(error)

      if (status === "success" && OPEN_REF.current) {
        OPEN_REF.current = false
        setTarget(null)
        ROUTER.refresh()
      }
    },
    [ROUTER]
  )

  return {
    target: TARGET,
    open: TARGET !== null,
    setOpen: UpdateOpen,
    handleOpen: HandleOpen,
    status: STATUS,
    errorMessage: ERROR,
    handleStatusChange: HandleStatusChange,
  }
}

export { useEntityEditDialog }
