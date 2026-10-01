"use client"

import { FieldGroup } from "@/presentation/ui/field"
import { Input } from "@/presentation/ui/input"

import { SharedFormField } from "@/presentation/parts/components/shared-form-field"
import { useEntityFormStatus } from "@/presentation/parts/hooks/use-entity-form-status.hook"
import { SharedFormWrapper } from "@/presentation/parts/components/shared-form-wrapper"
import { SharedSubmitButton } from "@/presentation/parts/components/shared-submit-button"
import type { EntityFormStatus } from "@/presentation/parts/hooks/use-entity-form.hook"
import { useUserEditForm } from "../hooks/use-user-edit-form.hook"
import { USER_FORM } from "@/presentation/routes/user/settings/labels.settings"

import type { UserRow } from "@/presentation/types/user-row.types"

/**
 * Props for the edit user form.
 */
export interface EditUserFormProps {
  user: UserRow
  onStatusChange?: (
    status: EntityFormStatus,
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
  } = useUserEditForm(user)

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
