"use client"

import * as React from "react"

import { FieldGroup } from "@/presentation/ui/field"
import { Input } from "@/presentation/ui/input"

import { SharedFormField } from "@/presentation/parts/components/shared-form-field"
import { SharedFormWrapper } from "@/presentation/parts/components/shared-form-wrapper"
import { SharedSubmitButton } from "@/presentation/parts/components/shared-submit-button"
import type { PortfolioFormStatus } from "@/presentation/parts/hooks/use-portfolio-form.hook"
import { useAddCategoryForm } from "@/presentation/routes/category/hooks/use-add-category-form.hook"

import { CATEGORY_FORM } from "@/presentation/routes/category/settings/labels.settings"

/**
 * Props for the add category form.
 */
export interface AddCategoryFormProps {
  onStatusChange?: (
    status: PortfolioFormStatus,
    error: string | null
  ) => void
}

/**
 * @summary
 * Renders the add category form.
 *
 * @remarks
 * Validates fields with **Zod** and shows
 * human-readable error messages.
 * Submits the category to the create server action.
 * Shows loading state while submitting and reports the
 * submit status through `onStatusChange` so the parent
 * dialog can react to the outcome.
 *
 * @explanation
 * Use as the add component of the category dialog flow.
 * The parent renders the result toast and the follow-up
 * prompt based on the reported status.
 *
 * @param props - Props of the add category form.
 * @param props.onStatusChange - Reports submit outcomes.
 *
 * @returns The add category form.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function AddCategoryForm({
  onStatusChange,
}: AddCategoryFormProps) {
  const {
    name,
    updateName,
    error,
    pending,
    status,
    fieldErrors,
    handleSubmit,
  } = useAddCategoryForm()

  React.useEffect(() => {
    onStatusChange?.(status, error)
  }, [status, error, onStatusChange])

  return (
    <SharedFormWrapper onSubmit={handleSubmit}>
      <FieldGroup>
        <SharedFormField
          label={CATEGORY_FORM.FIELD_NAME}
          error={fieldErrors.name}
          htmlFor="name"
        >
          <Input
            id="name"
            type="text"
            name="name"
            autoComplete="off"
            placeholder={CATEGORY_FORM.PLACEHOLDER_NAME}
            required
            value={name}
            onChange={(e) => updateName(e.target.value)}
            disabled={pending}
            aria-invalid={fieldErrors.name ? "true" : undefined}
          />
        </SharedFormField>
      </FieldGroup>

      <SharedSubmitButton
        pending={pending}
        label={CATEGORY_FORM.ADD_BUTTON}
        pendingLabel={CATEGORY_FORM.ADD_PENDING_BUTTON}
      />
    </SharedFormWrapper>
  )
}

export { AddCategoryForm }
