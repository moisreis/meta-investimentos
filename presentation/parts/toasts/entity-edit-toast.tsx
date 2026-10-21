"use client"

import * as React from "react"

import { useEntityFormToast } from "@/presentation/parts/hooks/use-entity-form-toast.hook"
import type { EntityToastAction } from "@/presentation/parts/hooks/use-entity-form-toast.hook"
import type { EntityFormStatus } from "@/presentation/parts/hooks/use-entity-form.hook"

/**
 * Props for the entity edit result toast.
 */
export interface EntityEditToastProps {
  status: EntityFormStatus
  errorMessage?: string | null
  successTitle: string
  successDescription: string
  errorTitle: string
  /** Action button attached to the success toast, when the outcome offers a next step. */
  successAction?: EntityToastAction | null
}

// Human-readable fallback shown when the fields fail validation.
const VALIDATION_ERROR =
  "Revise os campos destacados no formulário."

/**
 * @summary
 * Shows an entity edit result toast for success or error.
 *
 * @remarks
 * Fires a toast when the status becomes `success` or
 * `error` after the edit form submits. Uses the shared
 * entity form toast callbacks with the given copy.
 *
 * @explanation
 * Render next to the entity edit dialog wiring the form
 * submit status. On error, the message falls back to a
 * validation hint. The component renders no visible
 * output. A `successAction` attaches an action button to
 * the success toast, such as opening the edited entity
 * page. Memoize it in the caller so the toast fires once
 * per submit.
 *
 * @param props - Props of the entity edit toast.
 * @param props.status - Current entity form status.
 * @param props.errorMessage - Action error message, if any.
 * @param props.successTitle - Success toast title.
 * @param props.successDescription - Success toast description.
 * @param props.errorTitle - Error toast title.
 * @param props.successAction - Success toast action button.
 *
 * @returns Toast trigger, no output.
 *
 * @example
 * <EntityEditToast status={status} errorMessage={error}
 *   successTitle="Carteira atualizada!"
 *   successDescription="As informações foram salvas."
 *   errorTitle="Não foi possível salvar" />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function EntityEditToast({
  status,
  errorMessage,
  successTitle,
  successDescription,
  errorTitle,
  successAction,
}: EntityEditToastProps) {
  const { showSuccess, showError } = useEntityFormToast({
    successTitle,
    successDescription,
    errorTitle,
    successAction,
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
    successAction,
    showSuccess,
    showError,
  ])

  return null
}

export { EntityEditToast }
