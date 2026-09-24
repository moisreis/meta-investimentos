"use client"

import * as React from "react"
import { useAuthFormToast } from "@/presentation/parts/hooks/use-auth-form-toast.hook"
import type { PortfolioFormStatus } from "@/presentation/parts/hooks/use-portfolio-form.hook"

interface PortfolioFormToastProps {
  status: PortfolioFormStatus
  errorMessage?: string | null
  successTitle: string
  successDescription: string
  errorTitle: string
}

// Human-readable fallback shown when the fields fail validation.
const VALIDATION_ERROR =
  "Revise os campos destacados no formulário."

/**
 * @summary
 * Shows a portfolio form result toast for success or
 * error outcomes.
 *
 * @remarks
 * Fires a toast once when the status becomes `success`
 * or `error` after the submit runs. Uses
 * `useAuthFormToast` callbacks with the given copy.
 *
 * @explanation
 * Render inside the portfolio add/edit forms wiring the
 * submit status. On error, the message falls back to a
 * validation hint. The component renders no visible output.
 *
 * @param props - Props of the portfolio form toast.
 * @param props.status - Current portfolio form status.
 * @param props.errorMessage - Action error message, if any.
 * @param props.successTitle - Success toast title.
 * @param props.successDescription - Success toast description.
 * @param props.errorTitle - Error toast title.
 *
 * @returns Toast trigger, no output.
 *
 * @example
 * <PortfolioFormToast status={status} errorMessage={error}
 *   successTitle="Carteira criada!" successDescription="..."
 *   errorTitle="Não foi possível salvar" />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
function PortfolioFormToast({
  status,
  errorMessage,
  successTitle,
  successDescription,
  errorTitle,
}: PortfolioFormToastProps) {
  const { showSuccess, showError } = useAuthFormToast({
    successTitle,
    successDescription,
    errorTitle,
  })

  React.useEffect(() => {
    if (status === "success") {
      showSuccess()
      return
    }

    if (status === "error") {
      showError(errorMessage ?? VALIDATION_ERROR)
    }
  }, [
    status,
    errorMessage,
    successTitle,
    successDescription,
    errorTitle,
    showSuccess,
    showError,
  ])

  return null
}

export { PortfolioFormToast }
