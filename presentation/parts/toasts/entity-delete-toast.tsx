"use client"

import * as React from "react"

import { useAuthFormToast } from "@/presentation/parts/hooks/use-auth-form-toast.hook"

/**
 * Status of the entity delete flow.
 */
export type EntityDeleteToastStatus =
  "idle" | "pending" | "success" | "error"

/**
 * Props for the entity delete result toast.
 */
export interface EntityDeleteToastProps {
  status: EntityDeleteToastStatus
  errorMessage?: string | null
  successTitle: string
  successDescription: string
  errorTitle: string
}

// Human-readable fallback shown without a server message.
const DELETE_ERROR_FALLBACK =
  "Não foi possível concluir a operação."

/**
 * @summary
 * Shows an entity delete result toast for success or error.
 *
 * @remarks
 * Fires a toast when the status becomes `success` or
 * `error` after the delete runs. Uses the shared auth
 * form toast callbacks with the given copy.
 *
 * @explanation
 * Render next to the entity confirm-delete dialog wiring
 * the delete result status. The component renders no
 * visible output.
 *
 * @param props - Props of the entity delete toast.
 * @param props.status - Current delete flow status.
 * @param props.errorMessage - Action error message, if any.
 * @param props.successTitle - Success toast title.
 * @param props.successDescription - Success toast description.
 * @param props.errorTitle - Error toast title.
 *
 * @returns Toast trigger, no output.
 *
 * @example
 * <EntityDeleteToast status={status} errorMessage={error}
 *   successTitle="Carteira excluída!"
 *   successDescription="A carteira foi excluída."
 *   errorTitle="Não foi possível excluir" />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function EntityDeleteToast({
  status,
  errorMessage,
  successTitle,
  successDescription,
  errorTitle,
}: EntityDeleteToastProps) {
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
      showError(errorMessage ?? DELETE_ERROR_FALLBACK)
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

export { EntityDeleteToast }
