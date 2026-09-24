"use client"

import * as React from "react"
import { toast } from "@/presentation/ui/toast"

/**
 * @summary
 * Manages the sign-in toast messages.
 *
 * @remarks
 * Builds the success and error toasts with human-readable messages.
 * Uses the global toast manager from the toast UI module.
 *
 * @explanation
 * Use inside the sign-in toast component to keep messages centralized.
 * The returned callbacks are stable across renders.
 *
 * @returns The sign-in toast trigger callbacks.
 *
 * @example
 * const { showSuccess, showError } = useSignInToast()
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
function useSignInToast() {
  const showSuccess = React.useCallback(() => {
    toast.add({
      type: "success",
      title: "Login realizado!",
      description: "Bem-vindo de volta.",
    })
  }, [])

  const showError = React.useCallback((message: string) => {
    toast.add({
      type: "error",
      title: "Não foi possível entrar",
      description: message,
    })
  }, [])

  return { showSuccess, showError }
}

export { useSignInToast }