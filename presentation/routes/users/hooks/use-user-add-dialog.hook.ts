"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import type { PortfolioFormStatus } from "@/presentation/parts/hooks/use-portfolio-form.hook"

/**
 * @summary
 * Coordinates the add dialog flow of an entity route.
 *
 * @remarks
 * Tracks the add dialog open state, the form submit
 * status and the add-another prompt. On a successful
 * submit it swaps the add dialog for the add-another
 * prompt. The form key bumps so each new session starts
 * with a fresh form. A ref guards against reopening the
 * prompt after the user closed the dialog mid-submit.
 *
 * @explanation
 * Use inside the route add dialog component to keep the
 * flow state out of the presentational layer. The toolbar
 * add-item button triggers `handleOpen`.
 *
 * @returns The add dialog flow state and handlers.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useUserAddDialog() {
  const ROUTER = useRouter()
  const [OPEN, setOpen] = React.useState(false)
  const [ANOTHER_OPEN, setAnotherOpen] = React.useState(false)
  const [STATUS, setStatus] =
    React.useState<PortfolioFormStatus>("idle")
  const [ERROR, setError] = React.useState<string | null>(null)
  const [FORM_KEY, setFormKey] = React.useState(0)
  const OPEN_REF = React.useRef(false)

  const HandleOpen = React.useCallback(() => {
    OPEN_REF.current = true
    setAnotherOpen(false)
    setStatus("idle")
    setError(null)
    setOpen(true)
  }, [])

  const UpdateOpen = React.useCallback((open: boolean) => {
    OPEN_REF.current = open
    setOpen(open)

    if (!open) {
      setAnotherOpen(false)
      setStatus("idle")
      setError(null)
    }
  }, [])

  const HandleStatusChange = React.useCallback(
    (status: PortfolioFormStatus, error: string | null) => {
      setStatus(status)
      setError(error)

      if (status === "success" && OPEN_REF.current) {
        setOpen(false)
        setAnotherOpen(true)
      }
    },
    []
  )

  const HandleAddAnother = React.useCallback(() => {
    setAnotherOpen(false)
    setStatus("idle")
    setError(null)
    setFormKey((key) => key + 1)
    setOpen(true)
  }, [])

  const HandleBackToTable = React.useCallback(() => {
    setOpen(false)
    setAnotherOpen(false)
    setStatus("idle")
    setError(null)
    ROUTER.refresh()
  }, [ROUTER])

  return {
    open: OPEN,
    setOpen: UpdateOpen,
    handleOpen: HandleOpen,
    anotherOpen: ANOTHER_OPEN,
    status: STATUS,
    errorMessage: ERROR,
    formKey: FORM_KEY,
    handleStatusChange: HandleStatusChange,
    handleAddAnother: HandleAddAnother,
    handleBackToTable: HandleBackToTable,
  }
}

export { useUserAddDialog }
