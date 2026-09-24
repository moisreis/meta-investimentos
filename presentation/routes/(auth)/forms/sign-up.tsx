"use client"

import { Button } from "@/presentation/ui/button"
import { CpfInput } from "@/presentation/routes/(auth)/components/cpf-input"
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/presentation/ui/field"
import { Input } from "@/presentation/ui/input"
import { useSignUp } from "@/presentation/routes/(auth)/hooks/use-sign-up.hook"
import { IconLoader } from "@tabler/icons-react"
import { SignUpToast } from "@/presentation/routes/(auth)/components/sign-up-toast"
import { SIGN_UP } from "@/presentation/routes/(auth)/settings/labels.settings"

/**
 * @summary
 * Renders the sign-up form with **Better-Auth** integration.
 *
 * @remarks
 * Collects all required fields including CPF and password.
 * Validates fields with Zod and shows human-readable error messages.
 * Submits to the **Better-Auth** email/password
 * endpoint with additionalFields.
 * Shows loading state while submitting.
 *
 * @explanation
 * Use as the sign-up component inside AuthLayout.
 * On success, redirects to the dashboard (/).
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
    <form className="space-y-4" noValidate onSubmit={handleSubmit}>
      <FieldGroup>
        <Field data-invalid={fieldErrors.name ? "true" : undefined}>
          <FieldLabel>Nome completo</FieldLabel>
          <FieldContent>
            <Input
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Maria Oliveira"
              required
              value={name}
              onChange={(e) => updateName(e.target.value)}
              disabled={pending}
              aria-invalid={fieldErrors.name ? "true" : undefined}
            />
            <FieldError>{fieldErrors.name}</FieldError>
          </FieldContent>
        </Field>

        <Field data-invalid={fieldErrors.firstName ? "true" : undefined}>
          <FieldLabel>Nome</FieldLabel>
          <FieldContent>
            <Input
              type="text"
              name="firstName"
              placeholder="Maria"
              required
              value={firstName}
              onChange={(e) => updateFirstName(e.target.value)}
              disabled={pending}
              aria-invalid={fieldErrors.firstName ? "true" : undefined}
            />
            <FieldError>{fieldErrors.firstName}</FieldError>
          </FieldContent>
        </Field>

        <Field data-invalid={fieldErrors.lastName ? "true" : undefined}>
          <FieldLabel>Sobrenome</FieldLabel>
          <FieldContent>
            <Input
              type="text"
              name="lastName"
              placeholder="Oliveira"
              required
              value={lastName}
              onChange={(e) => updateLastName(e.target.value)}
              disabled={pending}
              aria-invalid={fieldErrors.lastName ? "true" : undefined}
            />
            <FieldError>{fieldErrors.lastName}</FieldError>
          </FieldContent>
        </Field>

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

        <Field data-invalid={fieldErrors.cpf ? "true" : undefined}>
          <FieldLabel>CPF</FieldLabel>
          <FieldContent>
            <CpfInput
              value={cpf}
              onChange={(value: string) => updateCpf(value)}
              disabled={pending}
              aria-invalid={fieldErrors.cpf ? "true" : undefined}
            />
            <FieldError>{fieldErrors.cpf}</FieldError>
          </FieldContent>
        </Field>

        <Field data-invalid={fieldErrors.password ? "true" : undefined}>
          <FieldLabel>Senha</FieldLabel>
          <FieldContent>
            <Input
              type="password"
              name="password"
              autoComplete="new-password"
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
        aria-label={pending ? "Criando conta" : undefined}
      >
        {pending ? (
          <IconLoader className="animate-spin" aria-hidden="true" />
        ) : (
          SIGN_UP.SIGN_UP_BUTTON
        )}
      </Button>
      <SignUpToast status={status} errorMessage={error} />
    </form>
  )
}

export { SignUpForm }