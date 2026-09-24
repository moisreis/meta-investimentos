"use client"

import * as React from "react"
import { useSignUpToast } from "../../routes/(auth)/hooks/use-sign-up-toast.hook"
import type { AuthFormStatus } from "@/presentation/parts/hooks/use-auth-form.hook"

interface SignUpToastProps {
  status: AuthFormStatus
  errorMessage?: string | null
}

// Human-readable fallback shown when the fields fail validation.
const VALIDATION_ERROR =
  "Revise os campos destacados no formulário."

/**
 * @summary
 * Shows a sign-up result toast for success or error outcomes.
 *
 * @remarks
 * Fires a toast once when the status becomes `success`
 * or `error` after the submit runs. Uses
 * **AuthSignUpToast** callbacks with human-readable messages.
 *
 * @explanation
 * Render inside the sign-up form wiring the submit status.
 * On error, the message falls back to a validation hint.
 * The component renders no visible output.
 *
 * @param props - Props of the sign-up toast.
 * @param props.status - Current sign-up form status.
 * @param props.errorMessage - Authentication error
 *                            message, if any.
 *
 * @returns Toast trigger, no output.
 *
 * @example
 * <AuthSignUpToast status={status} errorMessage={error} />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
function AuthSignUpToast({
  status,
  errorMessage,
}: SignUpToastProps) {
  const { showSuccess, showError } = useSignUpToast()

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

export { AuthSignUpToast }
