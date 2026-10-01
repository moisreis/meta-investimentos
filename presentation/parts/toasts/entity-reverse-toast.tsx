"use client"

import * as React from "react"

import { useEntityFormToast } from "@/presentation/parts/hooks/use-entity-form-toast.hook"

/**
 * Status of the entity reverse flow.
 */
export type EntityReverseToastStatus =
  "idle" | "pending" | "success" | "error"

/**
 * Props for the entity reverse result toast.
 */
export interface EntityReverseToastProps {
  status: EntityReverseToastStatus
  errorMessage?: string | null
  successTitle: string
  successDescription: string
  errorTitle: string
}

// Human-readable fallback shown without a server message.
const REVERSE_ERROR_FALLBACK =
  "Não foi possível concluir a operação."

/**
 * @summary
 * Shows an entity reverse result toast for success or error.
 *
 * @remarks
 * Fires a toast when the status becomes `success` or
 * `error` after the reversal runs. Uses the shared auth
 * form toast callbacks with the given copy.
 *
 * @explanation
 * Render next to the entity confirm-reverse dialog wiring
 * the reverse result status. The component renders no
 * visible output.
 *
 * @param props - Props of the entity reverse toast.
 * @param props.status - Current reverse flow status.
 * @param props.errorMessage - Action error message, if any.
 * @param props.successTitle - Success toast title.
 * @param props.successDescription - Success toast description.
 * @param props.errorTitle - Error toast title.
 *
 * @returns Toast trigger, no output.
 *
 * @example
 * <EntityReverseToast status={status} errorMessage={error}
 *   successTitle="Aplicação revertida!"
 *   successDescription="A aplicação foi marcada como estornada."
 *   errorTitle="Não foi possível reverter" />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
function EntityReverseToast({
  status,
  errorMessage,
  successTitle,
  successDescription,
  errorTitle,
}: EntityReverseToastProps) {
  const { showSuccess, showError } = useEntityFormToast({
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
      showError(errorMessage ?? REVERSE_ERROR_FALLBACK)
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

export { EntityReverseToast }
