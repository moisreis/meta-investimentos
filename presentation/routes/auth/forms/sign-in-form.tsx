"use client"

import { Button } from "@/presentation/ui/button"
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/presentation/ui/field"
import { Input } from "@/presentation/ui/input"
import { IconLoader } from "@tabler/icons-react"
import { useSignIn } from "@/presentation/routes/auth/hooks/use-sign-in.hook"
import { SignInToast } from "@/presentation/routes/auth/components/sign-in-toast"
import { SIGN_IN } from "@/presentation/routes/auth/settings/form-labels.settings"

/**
 * @summary
 * Renders the sign-in form with validation and better-auth integration.
 *
 * @remarks
 * Validates fields with Zod and shows human-readable error messages.
 * Submits credentials to better-auth email/password endpoint.
 * Shows loading state while submitting.
 *
 * @explanation
 * Use as the sign-in component inside AuthLayout.
 * On success, redirects to the dashboard (/).
 *
 * @returns The sign-in form.
 *
 * @example
 * <SignInForm />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-17
 */
function SignInForm() {
  const {
    email,
    updateEmail,
    password,
    updatePassword,
    error,
    pending,
    status,
    fieldErrors,
    handleSubmit,
  } = useSignIn()

  return (
    <form className="space-y-4" noValidate onSubmit={handleSubmit}>
      <FieldGroup>
        <Field data-invalid={fieldErrors.email ? "true" : undefined}>
          <FieldLabel>E-mail</FieldLabel>
          <FieldContent>
            <Input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="seu@email.com"
              required
              value={email}
              onChange={(e) => updateEmail(e.target.value)}
              disabled={pending}
              aria-invalid={fieldErrors.email ? "true" : undefined}
            />
            <FieldError>{fieldErrors.email}</FieldError>
          </FieldContent>
        </Field>
        <Field data-invalid={fieldErrors.password ? "true" : undefined}>
          <FieldLabel>Senha</FieldLabel>
          <FieldContent>
            <Input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => updatePassword(e.target.value)}
              disabled={pending}
              aria-invalid={fieldErrors.password ? "true" : undefined}
            />
            <FieldError>{fieldErrors.password}</FieldError>
          </FieldContent>
        </Field>
      </FieldGroup>

      <Button
        type="submit"
        className="w-full"
        disabled={pending}
        aria-label={pending ? "Entrando" : undefined}
      >
        {pending ? (
          <IconLoader className="animate-spin" aria-hidden="true" />
        ) : (
          SIGN_IN.SIGN_IN_BUTTON
        )}
      </Button>
      <SignInToast status={status} errorMessage={error} />
    </form>
  )
}

export { SignInForm }
