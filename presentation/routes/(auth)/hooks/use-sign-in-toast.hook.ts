"use client"

import { useAuthFormToast } from "@/presentation/parts/hooks/use-auth-form-toast.hook"

/**
 * @summary
 * Manages the sign-in toast messages.
 *
 * @remarks
 * Wraps `useAuthFormToast` with sign-in-specific copy.
 *
 * @explanation
 * Use in the sign-in toast component to keep
 * the messages centralized.
 * The returned callbacks are stable across renders.
 *
 * @returns Toast trigger callbacks.
 *
 * @example
 * const { showSuccess, showError } = useSignInToast()
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
function useSignInToast() {
  return useAuthFormToast({
    successTitle: "Login realizado!",
    successDescription: "Bem-vindo de volta.",
    errorTitle: "Não foi possível entrar",
  })
}

export { useSignInToast }
