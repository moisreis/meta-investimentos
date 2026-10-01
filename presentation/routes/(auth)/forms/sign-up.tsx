"use client"

import { FieldGroup } from "@/presentation/ui/field"
import { Input } from "@/presentation/ui/input"

import { AuthCpfInput } from "../components/auth-cpf-input"
import { AuthSignUpToast } from "../components/auth-sign-up-toast"

import { SharedFormWrapper } from "@/presentation/parts/components/shared-form-wrapper"
import { SharedFormField } from "@/presentation/parts/components/shared-form-field"
import { SharedSubmitButton } from "@/presentation/parts/components/shared-submit-button"

import { useSignUp } from "@/presentation/routes/(auth)/hooks/use-sign-up.hook"

import { SIGN_UP } from "@/presentation/routes/(auth)/settings/labels.settings"

/**
 * @summary
 * Renders the sign-up form with **Better-Auth** integration.
 *
 * @remarks
 * Collects all required fields including CPF and password.
 * Validates fields with **Zod** and shows
 * human-readable error messages.
 * Submits to the **Better-Auth** email/password
 * endpoint with additionalFields.
 * Shows loading state while submitting.
 *
 * @explanation
 * Use as the sign-up component inside **AuthLayout**.
 * On success, honors the `redirect` query parameter or
 * falls back to the dashboard (/).
 *
 * @returns The sign-up form.
 *
 * @example
 * <SignUpForm />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
function SignUpForm() {
  const {
    name,
    updateName,
    firstName,
    updateFirstName,
    lastName,
    updateLastName,
    email,
    updateEmail,
    cpf,
    updateCpf,
    password,
    updatePassword,
    error,
    pending,
    status,
    fieldErrors,
    handleSubmit,
  } = useSignUp()

  return (
    <SharedFormWrapper onSubmit={handleSubmit}>
      <FieldGroup>
        <SharedFormField
          label={SIGN_UP.LABEL_FULL_NAME}
          error={fieldErrors.name}
          htmlFor="name"
        >
          <Input
            id="name"
            type="text"
            name="name"
            autoComplete="name"
            placeholder={SIGN_UP.PLACEHOLDER_FULL_NAME}
            required
            value={name}
            onChange={(e) => updateName(e.target.value)}
            disabled={pending}
            aria-invalid={fieldErrors.name ? "true" : undefined}
          />
        </SharedFormField>

        <SharedFormField
          label={SIGN_UP.LABEL_FIRST_NAME}
          error={fieldErrors.firstName}
          htmlFor="firstName"
        >
          <Input
            id="firstName"
            type="text"
            name="firstName"
            placeholder={SIGN_UP.PLACEHOLDER_FIRST_NAME}
            required
            value={firstName}
            onChange={(e) => updateFirstName(e.target.value)}
            disabled={pending}
            aria-invalid={
              fieldErrors.firstName ? "true" : undefined
            }
          />
        </SharedFormField>

        <SharedFormField
          label={SIGN_UP.LABEL_LAST_NAME}
          error={fieldErrors.lastName}
          htmlFor="lastName"
        >
          <Input
            id="lastName"
            type="text"
            name="lastName"
            placeholder={SIGN_UP.PLACEHOLDER_LAST_NAME}
            required
            value={lastName}
            onChange={(e) => updateLastName(e.target.value)}
            disabled={pending}
            aria-invalid={
              fieldErrors.lastName ? "true" : undefined
            }
          />
        </SharedFormField>

        <SharedFormField
          label={SIGN_UP.LABEL_EMAIL}
          error={fieldErrors.email}
          htmlFor="email"
        >
          <Input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder={SIGN_UP.PLACEHOLDER_EMAIL}
            required
            value={email}
            onChange={(e) => updateEmail(e.target.value)}
            disabled={pending}
            aria-invalid={fieldErrors.email ? "true" : undefined}
          />
        </SharedFormField>

        <SharedFormField
          label={SIGN_UP.LABEL_CPF}
          error={fieldErrors.cpf}
          htmlFor="cpf"
        >
          <AuthCpfInput
            id="cpf"
            value={cpf}
            onChange={(value: string) => updateCpf(value)}
            disabled={pending}
            aria-invalid={fieldErrors.cpf ? "true" : undefined}
          />
        </SharedFormField>

        <SharedFormField
          label={SIGN_UP.LABEL_PASSWORD}
          error={fieldErrors.password}
          htmlFor="password"
        >
          <Input
            id="password"
            type="password"
            name="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => updatePassword(e.target.value)}
            disabled={pending}
            aria-invalid={
              fieldErrors.password ? "true" : undefined
            }
          />
        </SharedFormField>
      </FieldGroup>

      <SharedSubmitButton
        pending={pending}
        label={SIGN_UP.SIGN_UP_BUTTON}
        pendingLabel={SIGN_UP.PENDING_BUTTON}
      />
      <AuthSignUpToast status={status} errorMessage={error} />
    </SharedFormWrapper>
  )
}

export { SignUpForm }
