"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import type { PortfolioFormStatus } from "@/presentation/parts/hooks/use-portfolio-form.hook"
import type { UserResponseDTO } from "@/services/user/dto/user-response.dto"

/**
 * @summary
 * Coordinates the edit dialog flow of an entity route.
 *
 * @remarks
 * Tracks the user being edited, the dialog open
 * state and the form submit status. The row-actions
 * menu triggers `handleOpen` with the target row. On a
 * successful submit it closes the dialog and refreshes
 * the server data. A ref guards against closing the
 * dialog after the user dismissed it mid-submit.
 *
 * @explanation
 * Use inside the route edit dialog component to keep the
 * flow state out of the presentational layer. The target
 * seeds the edit form with the current row values.
 *
 * @returns The edit dialog flow state and handlers.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useUserEditDialog() {
  const ROUTER = useRouter()
  const [TARGET, setTarget] =
    React.useState<UserResponseDTO | null>(null)
  const [STATUS, setStatus] =
    React.useState<PortfolioFormStatus>("idle")
  const [ERROR, setError] = React.useState<string | null>(null)
  const OPEN_REF = React.useRef(false)

  const HandleOpen = React.useCallback(
    (user: UserResponseDTO) => {
      OPEN_REF.current = true
      setTarget(user)
      setStatus("idle")
      setError(null)
    },
    []
  )

  const UpdateOpen = React.useCallback((open: boolean) => {
    OPEN_REF.current = open

    if (!open) {
      setTarget(null)
      setStatus("idle")
      setError(null)
    }
  }, [])

  const HandleStatusChange = React.useCallback(
    (status: PortfolioFormStatus, error: string | null) => {
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

export { useUserEditDialog }
