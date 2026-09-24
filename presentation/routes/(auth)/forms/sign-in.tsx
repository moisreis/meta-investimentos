"use client"

import { FieldGroup } from "@/presentation/ui/field"
import { Input } from "@/presentation/ui/input"

import { SharedFormWrapper } from "@/presentation/parts/components/shared-form-wrapper"
import { SharedFormField } from "@/presentation/parts/components/shared-form-field"
import { SharedSubmitButton } from "@/presentation/parts/components/shared-submit-button"

import { AuthSignInToast } from "@/presentation/parts/components/auth-sign-in-toast"

import { useSignIn } from "@/presentation/routes/(auth)/hooks/use-sign-in.hook"

import { SIGN_IN } from "@/presentation/routes/(auth)/settings/labels.settings"

/**
 * @summary
 * Renders the sign-in form with **Better-Auth** integration.
 *
 * @remarks
 * Validates fields with **Zod** and shows
 * human-readable error messages.
 * Submits credentials to the **Better-Auth**
 * email/password endpoint.
 * Shows loading state while submitting.
 *
 * @explanation
 * Use as the sign-in component inside **AuthLayout**.
 * On success, honors the `redirect` query parameter or
 * falls back to the dashboard (/).
 *
 * @returns The sign-in form.
 *
 * @example
 * <SignInForm />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
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
    <SharedFormWrapper onSubmit={handleSubmit}>
      <FieldGroup>
        <SharedFormField
          label="E-mail"
          error={fieldErrors.email}
          htmlFor="email"
        >
          <Input
            id="email"
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
        </SharedFormField>
        <SharedFormField
          label="Senha"
          error={fieldErrors.password}
          htmlFor="password"
        >
          <Input
            id="password"
            type="password"
            name="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => updatePassword(e.target.value)}
            disabled={pending}
            aria-invalid={fieldErrors.password ? "true" : undefined}
          />
        </SharedFormField>
      </FieldGroup>
      <SharedSubmitButton
        pending={pending}
        label={SIGN_IN.SIGN_IN_BUTTON}
        pendingLabel="Entrando"
      />
      <AuthSignInToast status={status} errorMessage={error} />
    </SharedFormWrapper>
  )
}

export { SignInForm }
