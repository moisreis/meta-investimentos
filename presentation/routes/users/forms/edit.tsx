"use client"

import * as React from "react"

import { FieldGroup } from "@/presentation/ui/field"
import { Input } from "@/presentation/ui/input"

import { SharedFormField } from "@/presentation/parts/components/shared-form-field"
import { SharedFormWrapper } from "@/presentation/parts/components/shared-form-wrapper"
import { SharedSubmitButton } from "@/presentation/parts/components/shared-submit-button"
import type { PortfolioFormStatus } from "@/presentation/parts/hooks/use-portfolio-form.hook"
import { useEditUserForm } from "@/presentation/routes/users/hooks/use-edit-user-form.hook"
import { USER_FORM } from "@/presentation/routes/users/settings/labels.settings"

import type { UserResponseDTO } from "@/services/user/dto/user-response.dto"

/**
 * Props for the edit user form.
 */
export interface EditUserFormProps {
  user: UserResponseDTO
  onStatusChange?: (
    status: PortfolioFormStatus,
    error: string | null
  ) => void
}

/**
 * @summary
 * Renders the edit user form.
 *
 * @remarks
 * Seeds the fields from the provided user.
 * Validates fields with **Zod** and shows
 * human-readable error messages.
 * Submits the user to the update server action.
 * Shows loading state while submitting and reports the
 * submit status through `onStatusChange` so the parent
 * dialog can react to the outcome.
 *
 * @explanation
 * Use as the edit component of the user dialog flow.
 * The parent renders the result toast and closes on
 * success based on the reported status.
 *
 * @param props - Props of the edit user form.
 * @param props.user - User being edited.
 * @param props.onStatusChange - Reports submit outcomes.
 *
 * @returns The edit user form.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function EditUserForm({
  user,
  onStatusChange,
}: EditUserFormProps) {
  const {
    name,
    updateName,
    firstName,
    updateFirstName,
    lastName,
    updateLastName,
    error,
    pending,
    status,
    fieldErrors,
    handleSubmit,
  } = useEditUserForm(user)

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
      </FieldGroup>

      <SharedSubmitButton
        pending={pending}
        label={USER_FORM.EDIT_BUTTON}
        pendingLabel={USER_FORM.EDIT_PENDING_BUTTON}
      />
    </SharedFormWrapper>
  )
}

export { EditUserForm }
