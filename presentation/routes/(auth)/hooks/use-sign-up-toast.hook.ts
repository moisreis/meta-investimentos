"use client"

import * as React from "react"
import { toast } from "@/presentation/ui/toast"

/**
 * @summary
 * Manages the sign-up toast messages.
 *
 * @remarks
 * Builds the success and error toasts with human-readable messages.
 * Uses the global toast manager from the toast UI module.
 *
 * @explanation
 * Use inside the sign-up toast component to keep messages centralized.
 * The returned callbacks are stable across renders.
 *
 * @returns The sign-up toast trigger callbacks.
 *
 * @example
 * const { showSuccess, showError } = useSignUpToast()
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
function useSignUpToast() {
  const showSuccess = React.useCallback(() => {
    toast.add({
      type: "success",
      title: "Conta criada com sucesso!",
      description: "Bem-vindo à Meta Investimentos.",
    })
  }, [])

  const showError = React.useCallback((message: string) => {
    toast.add({
      type: "error",
      title: "Não foi possível criar sua conta",
      description: message,
    })
  }, [])

  return { showSuccess, showError }
}

export { useSignUpToast }