"use client"

import * as React from "react"
import { useSignInToast } from "@/presentation/routes/(auth)/hooks/use-sign-in-toast.hook"
import type { AuthFormStatus } from "@/presentation/parts/hooks/use-auth-form.hook"

interface SignInToastProps {
  status: AuthFormStatus
  errorMessage?: string | null
}

// Human-readable fallback shown when the fields fail validation.
const VALIDATION_ERROR =
  "Revise os campos destacados no formulário."

/**
 * @summary
 * Shows a sign-in result toast for success or error outcomes.
 *
 * @remarks
 * Fires a toast once when the status becomes `success`
 * or `error` after the submit runs. Uses
 * **AuthSignInToast** callbacks with human-readable messages.
 *
 * @explanation
 * Render inside the sign-in form wiring the submit status.
 * On error, the message falls back to a validation hint.
 * The component renders no visible output.
 *
 * @param props - Props of the sign-in toast.
 * @param props.status - Current sign-in form status.
 * @param props.errorMessage - Authentication error
 *                            message, if any.
 *
 * @returns Toast trigger, no output.
 *
 * @example
 * <AuthSignInToast status={status} errorMessage={error} />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
function AuthSignInToast({
  status,
  errorMessage,
}: SignInToastProps) {
  const { showSuccess, showError } = useSignInToast()

  React.useEffect(() => {
    if (status === "success") {
      showSuccess()
      return
    }

    if (status === "error") {
      showError(errorMessage ?? VALIDATION_ERROR)
    }
  }, [status, errorMessage, showSuccess, showError])

  return null
}

export { AuthSignInToast }
