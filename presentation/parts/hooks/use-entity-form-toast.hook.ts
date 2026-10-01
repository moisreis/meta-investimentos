"use client"

import * as React from "react"
import { toast } from "@/presentation/ui/toast"

interface EntityFormToastMessages {
  successTitle: string
  successDescription: string
  errorTitle: string
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
 * across renders.
 *
 * @param messages - Success/error titles and success
 *   description.
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
}: EntityFormToastMessages) {
  const showSuccess = React.useCallback(() => {
    toast.add({
      type: "success",
      title: successTitle,
      description: successDescription,
    })
  }, [successTitle, successDescription])

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
