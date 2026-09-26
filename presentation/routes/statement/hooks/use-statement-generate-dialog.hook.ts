"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"

import type { PortfolioFormStatus } from "@/presentation/parts/hooks/use-portfolio-form.hook"

/**
 * @summary
 * Coordinates the generate report dialog of the statement
 * route.
 *
 * @remarks
 * Tracks the dialog open state, the form submit status and
 * the form key. On a successful submit the dialog closes and
 * the server data refreshes so the new statement appears in
 * the table.
 *
 * @explanation
 * Use inside the route generate dialog component to keep the
 * flow state out of the presentational layer. The toolbar
 * generate button triggers `handleOpen`.
 *
 * @returns The generate dialog flow state and handlers.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useStatementGenerateDialog() {
  const ROUTER = useRouter()
  const [OPEN, setOpen] = useState(false)
  const [STATUS, setStatus] =
    useState<PortfolioFormStatus>("idle")
  const [ERROR, setError] = useState<string | null>(null)
  const [FORM_KEY, setFormKey] = useState(0)

  const HandleOpen = useCallback(() => {
    setStatus("idle")
    setError(null)
    setOpen(true)
  }, [])

  const UpdateOpen = useCallback((open: boolean) => {
    setOpen(open)

    if (!open) {
      setStatus("idle")
      setError(null)
    }
  }, [])

  const HandleStatusChange = useCallback(
    (status: PortfolioFormStatus, error: string | null) => {
      setStatus(status)
      setError(error)

      if (status === "success") {
        setOpen(false)
        setFormKey((key) => key + 1)
        ROUTER.refresh()
      }
    },
    [ROUTER]
  )

  return {
    open: OPEN,
    setOpen: UpdateOpen,
    handleOpen: HandleOpen,
    status: STATUS,
    errorMessage: ERROR,
    formKey: FORM_KEY,
    handleStatusChange: HandleStatusChange,
  }
}

export { useStatementGenerateDialog }
