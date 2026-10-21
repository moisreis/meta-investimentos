"use client"

import * as React from "react"
import { toast } from "@/presentation/ui/toast"

/**
 * Action button attached to a success toast.
 */
export interface EntityToastAction {
  label: string
  onClick: () => void
}

interface EntityFormToastMessages {
  successTitle: string
  successDescription: string
  errorTitle: string
  /** Action button rendered on the success toast, when the outcome offers a next step. */
  successAction?: EntityToastAction | null
}

/**
 * @summary
 * Manages success and error toast messages for an
 * entity form.
 *
 * @remarks
 * Builds the success and error toasts with
 * human-readable messages. Uses the global toast
 * manager from the toast UI module.
 *
 * @explanation
 * Use as the base for `useSignInToast`/`useSignUpToast`
 * (and any future auth toast hook) to avoid duplicating
 * the toast-building logic. Each caller supplies its own
 * success/error copy. The returned callbacks are stable
 * across renders. A `successAction` attaches an action
 * button to the success toast, such as downloading the
 * generated file or opening the created entity page.
 *
 * @param messages - Success/error titles, success
 *   description and the optional success action.
 *
 * @returns Toast trigger callbacks.
 *
 * @example
 * const { showSuccess, showError } = useEntityFormToast({
 *   successTitle: "Login realizado!",
 *   successDescription: "Bem-vindo de volta.",
 *   errorTitle: "Não foi possível entrar",
 * })
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
function useEntityFormToast({
  successTitle,
  successDescription,
  errorTitle,
  successAction,
}: EntityFormToastMessages) {
  const showSuccess = React.useCallback(() => {
    toast.add({
      type: "success",
      title: successTitle,
      description: successDescription,
      ...(successAction
        ? {
            actionProps: {
              children: successAction.label,
              onClick: successAction.onClick,
            },
          }
        : {}),
    })
  }, [successTitle, successDescription, successAction])

  const showError = React.useCallback(
    (message: string) => {
      toast.add({
        type: "error",
        title: errorTitle,
        description: message,
      })
    },
    [errorTitle]
  )

  return { showSuccess, showError }
}

export { useEntityFormToast }
