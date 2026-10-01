"use client"

import { FieldGroup } from "@/presentation/ui/field"
import { Input } from "@/presentation/ui/input"

import { SharedFormField } from "@/presentation/parts/components/shared-form-field"
import { useEntityFormStatus } from "@/presentation/parts/hooks/use-entity-form-status.hook"
import { SharedFormWrapper } from "@/presentation/parts/components/shared-form-wrapper"
import { SharedSubmitButton } from "@/presentation/parts/components/shared-submit-button"
import type { EntityFormStatus } from "@/presentation/parts/hooks/use-entity-form.hook"
import { useUserAddForm } from "@/presentation/routes/user/hooks/use-user-add-form.hook"
import { USER_FORM } from "@/presentation/routes/user/settings/labels.settings"

import { UserRoleCombobox } from "./role-combobox"

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
  } = useUserAddForm()

  useEntityFormStatus({ status, error, onStatusChange })

  return (
    <SharedFormWrapper onSubmit={handleSubmit}>
      <FieldGroup>
        <SharedFormField
          label={USER_FORM.LABEL_NAME}
          error={fieldErrors.name}
          htmlFor="name"
        >
          <Input
            id="name"
            type="text"
            name="name"
            autoComplete="off"
            placeholder={USER_FORM.PLACEHOLDER_NAME}
            required
            value={name}
            onChange={(e) => updateName(e.target.value)}
            disabled={pending}
            aria-invalid={fieldErrors.name ? "true" : undefined}
          />
        </SharedFormField>

        <SharedFormField
          label={USER_FORM.LABEL_EMAIL}
          error={fieldErrors.email}
          htmlFor="email"
        >
          <Input
            id="email"
            type="email"
            name="email"
            autoComplete="off"
            placeholder={USER_FORM.PLACEHOLDER_EMAIL}
            required
            value={email}
            onChange={(e) => updateEmail(e.target.value)}
            disabled={pending}
            aria-invalid={fieldErrors.email ? "true" : undefined}
          />
        </SharedFormField>

        <SharedFormField
          label={USER_FORM.LABEL_FIRST_NAME}
          error={fieldErrors.firstName}
          htmlFor="firstName"
        >
          <Input
            id="firstName"
            type="text"
            name="firstName"
            autoComplete="off"
            placeholder={USER_FORM.PLACEHOLDER_FIRST_NAME}
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
          label={USER_FORM.LABEL_LAST_NAME}
          error={fieldErrors.lastName}
          htmlFor="lastName"
        >
          <Input
            id="lastName"
            type="text"
            name="lastName"
            autoComplete="off"
            placeholder={USER_FORM.PLACEHOLDER_LAST_NAME}
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
          label={USER_FORM.LABEL_CPF}
          error={fieldErrors.cpf}
          htmlFor="cpf"
        >
          <Input
            id="cpf"
            type="text"
            name="cpf"
            autoComplete="off"
            placeholder={USER_FORM.PLACEHOLDER_CPF}
            required
            value={cpf}
            onChange={(e) => updateCpf(e.target.value)}
            disabled={pending}
            aria-invalid={fieldErrors.cpf ? "true" : undefined}
          />
        </SharedFormField>

        <SharedFormField
          label={USER_FORM.LABEL_ROLE}
          error={fieldErrors.role}
          htmlFor="role"
        >
          <UserRoleCombobox
            id="role"
            name="role"
            value={role}
            onValueChange={updateRole}
            placeholder={USER_FORM.PLACEHOLDER_ROLE}
            required
            disabled={pending}
            aria-invalid={fieldErrors.role ? "true" : undefined}
          />
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
