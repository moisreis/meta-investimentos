"use client"

import * as React from "react"

import { FieldGroup } from "@/presentation/ui/field"
import { Input } from "@/presentation/ui/input"
import { NativeSelect } from "@/presentation/ui/native-select"

import { SharedFormField } from "@/presentation/parts/components/shared-form-field"
import { SharedFormWrapper } from "@/presentation/parts/components/shared-form-wrapper"
import { SharedSubmitButton } from "@/presentation/parts/components/shared-submit-button"
import type { EntityFormStatus } from "@/presentation/parts/hooks/use-entity-form.hook"
import { useAddUserForm } from "@/presentation/routes/users/hooks/use-add-user-form.hook"
import {
  USER_FORM,
  USER_ROLE_LABELS,
} from "@/presentation/routes/users/settings/labels.settings"

/**
 * Props for the add user form.
 */
export interface AddUserFormProps {
  onStatusChange?: (
    status: EntityFormStatus,
    error: string | null
  ) => void
}

/**
 * @summary
 * Renders the add user form.
 *
 * @remarks
 * Validates fields with **Zod** and shows
 * human-readable error messages.
 * Submits the user to the create server action.
 * Shows loading state while submitting and reports the
 * submit status through `onStatusChange` so the parent
 * dialog can react to the outcome.
 *
 * @explanation
 * Use as the add component of the user dialog flow.
 * The parent renders the result toast and the follow-up
 * prompt based on the reported status.
 *
 * @param props - Props of the add user form.
 * @param props.onStatusChange - Reports submit outcomes.
 *
 * @returns The add user form.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function AddUserForm({ onStatusChange }: AddUserFormProps) {
  const {
    name,
    updateName,
    email,
    updateEmail,
    firstName,
    updateFirstName,
    lastName,
    updateLastName,
    cpf,
    updateCpf,
    role,
    updateRole,
    error,
    pending,
    status,
    fieldErrors,
    handleSubmit,
  } = useAddUserForm()

  React.useEffect(() => {
    onStatusChange?.(status, error)
  }, [status, error, onStatusChange])

  return (
    <SharedFormWrapper onSubmit={handleSubmit}>
      <FieldGroup>
        <SharedFormField
          label="Nome"
          error={fieldErrors.name}
          htmlFor="name"
        >
          <Input
            id="name"
            type="text"
            name="name"
            autoComplete="off"
            placeholder="Ex.: Maria Silva"
            required
            value={name}
            onChange={(e) => updateName(e.target.value)}
            disabled={pending}
            aria-invalid={fieldErrors.name ? "true" : undefined}
          />
        </SharedFormField>

        <SharedFormField
          label="E-mail"
          error={fieldErrors.email}
          htmlFor="email"
        >
          <Input
            id="email"
            type="email"
            name="email"
            autoComplete="off"
            placeholder="maria@example.com"
            required
            value={email}
            onChange={(e) => updateEmail(e.target.value)}
            disabled={pending}
            aria-invalid={fieldErrors.email ? "true" : undefined}
          />
        </SharedFormField>

        <SharedFormField
          label="Primeiro nome"
          error={fieldErrors.firstName}
          htmlFor="firstName"
        >
          <Input
            id="firstName"
            type="text"
            name="firstName"
            autoComplete="off"
            placeholder="Ex.: Maria"
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
          label="Sobrenome"
          error={fieldErrors.lastName}
          htmlFor="lastName"
        >
          <Input
            id="lastName"
            type="text"
            name="lastName"
            autoComplete="off"
            placeholder="Ex.: Silva"
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
          label="CPF"
          error={fieldErrors.cpf}
          htmlFor="cpf"
        >
          <Input
            id="cpf"
            type="text"
            name="cpf"
            autoComplete="off"
            placeholder="Ex.: 123.456.789-09"
            required
            value={cpf}
            onChange={(e) => updateCpf(e.target.value)}
            disabled={pending}
            aria-invalid={fieldErrors.cpf ? "true" : undefined}
          />
        </SharedFormField>

        <SharedFormField
          label="Perfil"
          error={fieldErrors.role}
          htmlFor="role"
        >
          <NativeSelect
            id="role"
            name="role"
            value={role}
            disabled={pending}
            onChange={(e) => updateRole(e.target.value)}
            aria-invalid={fieldErrors.role ? "true" : undefined}
          >
            <option value="">Selecione o perfil</option>
            <option value="USER">{USER_ROLE_LABELS.USER}</option>
            <option value="MANAGER">
              {USER_ROLE_LABELS.MANAGER}
            </option>
          </NativeSelect>
        </SharedFormField>
      </FieldGroup>

      <SharedSubmitButton
        pending={pending}
        label={USER_FORM.ADD_BUTTON}
        pendingLabel={USER_FORM.ADD_PENDING_BUTTON}
      />
    </SharedFormWrapper>
  )
}

export { AddUserForm }
