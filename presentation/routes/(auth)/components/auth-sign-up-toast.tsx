import { useSignUpToast } from "../hooks/use-sign-up-toast.hook"
import type { AuthFormStatus } from "../hooks/use-auth-form.hook"

interface SignUpToastProps {
  // Current sign-up form status.
  status: AuthFormStatus

  // Authentication error message, if any.
  errorMessage?: string | null
}

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
  useSignUpToast({ status, errorMessage })

  return null
}

export { AuthSignUpToast }
