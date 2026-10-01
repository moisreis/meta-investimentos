"use client"

import * as React from "react"

import { useEntityFormToast } from "@/presentation/parts/hooks/use-entity-form-toast.hook"

import type { AuthFormStatus } from "./use-auth-form.hook"
import { AUTH_VALIDATION_ERROR } from "../settings/labels.settings"

interface UseSignInToastOptions {
  // The sign-in status the form hook reports.
  status: AuthFormStatus

  // Message the server returned, when it sent one.
  errorMessage?: string | null
}

/**
 * @summary
 * Reports a sign-in outcome as a toast.
 *
 * @remarks
 * Wraps `useEntityFormToast` with sign-in copy, and fires it
 * once when the status settles on success or error. Keeping the
 * effect here is what lets the toast component render nothing
 * and stay a composition: a component that watches its own
 * status carries the effect with it, and every caller that
 * reports an outcome would write that effect again.
 *
 * A failure without a server message falls back to the
 * validation hint, because the common cause of a rejected
 * sign-in is a field the schema rejected, not a server fault.
 *
 * @explanation
 * Use in the sign-in toast component. Call it once with the
 * status and the error the form hook returned.
 *
 * @param options - The sign-in status and error message.
 * @param options.status - Status reported by the form hook.
 * @param options.errorMessage - Message reported by the form.
 *
 * @returns The toast callbacks, for a caller that wants them.
 *
 * @example
 * useSignInToast({ status, errorMessage })
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function useSignInToast({
  status,
  errorMessage,
}: UseSignInToastOptions) {
  const toast = useEntityFormToast({
    successTitle: "Login realizado!",
    successDescription: "Bem-vindo de volta.",
    errorTitle: "Não foi possível entrar",
  })

  React.useEffect(() => {
    if (status === "success") {
      toast.showSuccess()
      return
    }

    if (status === "error") {
      toast.showError(errorMessage ?? AUTH_VALIDATION_ERROR)
    }
  }, [status, errorMessage, toast])

  return toast
}

export { useSignInToast }
