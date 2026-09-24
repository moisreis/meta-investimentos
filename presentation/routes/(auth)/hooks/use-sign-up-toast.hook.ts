"use client"

import { useAuthFormToast } from "@/presentation/parts/hooks/use-auth-form-toast.hook"

/**
 * @summary
 * Manages the sign-up toast messages.
 *
 * @remarks
 * Wraps `useAuthFormToast` with sign-up-specific copy.
 *
 * @explanation
 * Use in the sign-up toast component to keep
 * the messages centralized.
 * The returned callbacks are stable across renders.
 *
 * @returns Toast trigger callbacks.
 *
 * @example
 * const { showSuccess, showError } = useSignUpToast()
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
function useSignUpToast() {
  return useAuthFormToast({
    successTitle: "Conta criada com sucesso!",
    successDescription: "Bem-vindo à Meta Investimentos.",
    errorTitle: "Não foi possível criar sua conta",
  })
}

export { useSignUpToast }