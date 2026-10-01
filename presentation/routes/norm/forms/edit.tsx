"use client"

import { FieldGroup } from "@/presentation/ui/field"
import { Input } from "@/presentation/ui/input"

import { EntityPercentageInput } from "@/presentation/parts/components/entity-percentage-input"
import { SharedFormField } from "@/presentation/parts/components/shared-form-field"
import { useEntityFormStatus } from "@/presentation/parts/hooks/use-entity-form-status.hook"
import { SharedFormWrapper } from "@/presentation/parts/components/shared-form-wrapper"
import { SharedSubmitButton } from "@/presentation/parts/components/shared-submit-button"
import type { EntityFormStatus } from "@/presentation/parts/hooks/use-entity-form.hook"
import { useNormEditForm } from "../hooks/use-norm-edit-form.hook"

import { NORM_FORM } from "@/presentation/routes/norm/settings/labels.settings"

import type { NormRow } from "@/presentation/types/norm-row.types"
import type { NormSelectOptions } from "../types/norm-list.types"
import { NormCategoryCombobox } from "./category-combobox"

/**
 * Props for the edit norm form.
 */
export interface EditNormFormProps {
  norm: NormRow
  options: NormSelectOptions
  onStatusChange?: (
    status: EntityFormStatus,
    error: string | null
  ) => void
}

/**
 * @summary
 * Renders the edit norm form.
 *
 * @remarks
 * Seeds the fields from the provided norm.
 * Validates fields with **Zod** and shows
 * human-readable error messages.
 * Submits the norm to the update server action.
 * Shows loading state while submitting and reports the
 * submit status through `onStatusChange` so the parent
 * dialog can react to the outcome.
 *
 * @explanation
 * Use as the edit component of the norm dialog flow.
 * The parent renders the result toast and closes on
 * success based on the reported status.
 *
 * @param props - Props of the edit norm form.
 * @param props.norm - Norm being edited.
 * @param props.options - The registry options.
 * @param props.onStatusChange - Reports submit outcomes.
 *
 * @returns The edit norm form.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function EditNormForm({
  norm,
  options,
  onStatusChange,
}: EditNormFormProps) {
  const {
    articleNumber,
    updateArticleNumber,
    name,
    updateName,
    categoryId,
    updateCategoryId,
    minAllocation,
    updateMinAllocation,
    targetAllocation,
    updateTargetAllocation,
    maxAllocation,
    updateMaxAllocation,
    error,
    pending,
    status,
    fieldErrors,
    handleSubmit,
  } = useNormEditForm(norm)

  useEntityFormStatus({ status, error, onStatusChange })

  return (
    <SharedFormWrapper onSubmit={handleSubmit}>
      <FieldGroup>
        <SharedFormField
          label={NORM_FORM.LABEL_ARTICLE}
          error={fieldErrors.articleNumber}
          htmlFor="articleNumber"
        >
          <Input
            id="articleNumber"
            type="text"
            name="articleNumber"
            autoComplete="off"
            placeholder={NORM_FORM.PLACEHOLDER_ARTICLE}
            required
            value={articleNumber}
            onChange={(e) => updateArticleNumber(e.target.value)}
            disabled={pending}
            aria-invalid={
              fieldErrors.articleNumber ? "true" : undefined
            }
          />
        </SharedFormField>
        <SharedFormField
          label={NORM_FORM.LABEL_NAME}
          error={fieldErrors.name}
          htmlFor="norm-name"
        >
          <Input
            id="norm-name"
            type="text"
            name="name"
            autoComplete="off"
            placeholder={NORM_FORM.PLACEHOLDER_NAME}
            required
            value={name}
            onChange={(e) => updateName(e.target.value)}
            disabled={pending}
            aria-invalid={fieldErrors.name ? "true" : undefined}
          />
        </SharedFormField>
        <SharedFormField
          label={NORM_FORM.LABEL_CATEGORY}
          error={fieldErrors.categoryId}
          htmlFor="categoryId"
        >
          <NormCategoryCombobox
            id="categoryId"
            name="categoryId"
            required
            value={categoryId}
            onValueChange={updateCategoryId}
            placeholder={NORM_FORM.PLACEHOLDER_CATEGORY}
            items={options.categories.map((category) => ({
              id: category.id,
              name: category.name,
            }))}
            disabled={pending}
            aria-invalid={
              fieldErrors.categoryId ? "true" : undefined
            }
          />
        </SharedFormField>
        <SharedFormField
          label={NORM_FORM.LABEL_MIN_ALLOCATION}
          error={fieldErrors.minAllocation}
          htmlFor="minAllocation"
        >
          <EntityPercentageInput
            id="minAllocation"
            value={minAllocation}
            onChange={(value: string) =>
              updateMinAllocation(value)
            }
            disabled={pending}
            aria-invalid={
              fieldErrors.minAllocation ? "true" : undefined
            }
          />
        </SharedFormField>
        <SharedFormField
          label={NORM_FORM.LABEL_TARGET_ALLOCATION}
          error={fieldErrors.targetAllocation}
          htmlFor="targetAllocation"
        >
          <EntityPercentageInput
            id="targetAllocation"
            value={targetAllocation}
            onChange={(value: string) =>
              updateTargetAllocation(value)
            }
            disabled={pending}
            aria-invalid={
              fieldErrors.targetAllocation ? "true" : undefined
            }
          />
        </SharedFormField>
        <SharedFormField
          label={NORM_FORM.LABEL_MAX_ALLOCATION}
          error={fieldErrors.maxAllocation}
          htmlFor="maxAllocation"
        >
          <EntityPercentageInput
            id="maxAllocation"
            value={maxAllocation}
            onChange={(value: string) =>
              updateMaxAllocation(value)
            }
            disabled={pending}
            aria-invalid={
              fieldErrors.maxAllocation ? "true" : undefined
            }
          />
        </SharedFormField>
      </FieldGroup>

      <SharedSubmitButton
        pending={pending}
        label={NORM_FORM.EDIT_BUTTON}
        pendingLabel={NORM_FORM.EDIT_PENDING_BUTTON}
      />
    </SharedFormWrapper>
  )
}

export { EditNormForm }
