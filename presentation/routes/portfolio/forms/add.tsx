"use client"

import { FieldGroup } from "@/presentation/ui/field"
import { Input } from "@/presentation/ui/input"

import { EntityPercentageInput } from "@/presentation/parts/components/entity-percentage-input"
import { EntityNormAllocations } from "@/presentation/parts/dialogs/entity-norm-allocations"
import { useEntityFormStatus } from "@/presentation/parts/hooks/use-entity-form-status.hook"
import { SharedFormField } from "@/presentation/parts/components/shared-form-field"
import { SharedFormWrapper } from "@/presentation/parts/components/shared-form-wrapper"
import { SharedSubmitButton } from "@/presentation/parts/components/shared-submit-button"
import type { EntityFormStatus } from "@/presentation/parts/hooks/use-entity-form.hook"
import { usePortfolioAddForm } from "@/presentation/routes/portfolio/hooks/use-portfolio-add-form.hook"

import {
  NORM_ALLOCATIONS,
  PORTFOLIO_FORM,
} from "@/presentation/routes/portfolio/settings/labels.settings"
import type { NormOption } from "@/presentation/types/norms-portfolio.types"

/**
 * Props for the add portfolio form.
 */
export interface AddPortfolioFormProps {
  onStatusChange?: (
    status: EntityFormStatus,
    error: string | null
  ) => void
  normOptions: NormOption[]
}

/**
 * @summary
 * Renders the add portfolio form.
 *
 * @remarks
 * Validates fields with **Zod** and shows
 * human-readable error messages.
 * Submits the portfolio to the create server action.
 * Shows loading state while submitting and reports the
 * submit status through `onStatusChange` so the parent
 * dialog can react to the outcome.
 *
 * The norms are not a field of the form but a collection of
 * bounded rows, so they live in their own dialog and are
 * reported back through `updateNorms`.
 *
 * @explanation
 * Use as the add component of the portfolio dialog flow.
 * The parent renders the result toast and the follow-up
 * prompt based on the reported status.
 *
 * @param props - Props of the add portfolio form.
 * @param props.onStatusChange - Reports submit outcomes.
 * @param props.normOptions - The norms to offer.
 *
 * @returns The add portfolio form.
 *
 * @example
 * <AddPortfolioForm
 *   onStatusChange={(status, error) => handle(status, error)}
 *   normOptions={options} />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function AddPortfolioForm({
  onStatusChange,
  normOptions,
}: AddPortfolioFormProps) {
  const {
    acronym,
    updateAcronym,
    name,
    updateName,
    annualInterestRate,
    updateAnnualInterestRate,
    minAllocation,
    updateMinAllocation,
    maxAllocation,
    updateMaxAllocation,
    targetAllocation,
    updateTargetAllocation,
    norms,
    updateNorms,
    error,
    pending,
    status,
    fieldErrors,
    handleSubmit,
  } = usePortfolioAddForm()

  useEntityFormStatus({ status, error, onStatusChange })

  return (
    <SharedFormWrapper onSubmit={handleSubmit}>
      <FieldGroup>
        <SharedFormField
          label={PORTFOLIO_FORM.LABEL_ACRONYM}
          error={fieldErrors.acronym}
          htmlFor="acronym"
        >
          <Input
            id="acronym"
            type="text"
            name="acronym"
            autoComplete="off"
            placeholder={PORTFOLIO_FORM.PLACEHOLDER_ACRONYM}
            required
            value={acronym}
            onChange={(e) => updateAcronym(e.target.value)}
            disabled={pending}
            aria-invalid={
              fieldErrors.acronym ? "true" : undefined
            }
          />
        </SharedFormField>
        <SharedFormField
          label={PORTFOLIO_FORM.LABEL_NAME}
          error={fieldErrors.name}
          htmlFor="name"
        >
          <Input
            id="name"
            type="text"
            name="name"
            autoComplete="off"
            placeholder={PORTFOLIO_FORM.PLACEHOLDER_NAME}
            required
            value={name}
            onChange={(e) => updateName(e.target.value)}
            disabled={pending}
            aria-invalid={fieldErrors.name ? "true" : undefined}
          />
        </SharedFormField>
        <SharedFormField
          label={PORTFOLIO_FORM.LABEL_ANNUAL_INTEREST_RATE}
          description={
            PORTFOLIO_FORM.DESCRIPTION_ANNUAL_INTEREST_RATE
          }
          error={fieldErrors.annualInterestRate}
          htmlFor="annualInterestRate"
        >
          <EntityPercentageInput
            id="annualInterestRate"
            value={annualInterestRate}
            onChange={(value: string) =>
              updateAnnualInterestRate(value)
            }
            disabled={pending}
            aria-invalid={
              fieldErrors.annualInterestRate ? "true" : undefined
            }
          />
        </SharedFormField>
        <SharedFormField
          label={PORTFOLIO_FORM.LABEL_MINIMUM_ALLOCATION}
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
          label={PORTFOLIO_FORM.LABEL_TARGET_ALLOCATION}
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
          label={PORTFOLIO_FORM.LABEL_MAXIMUM_ALLOCATION}
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
        <SharedFormField
          label={PORTFOLIO_FORM.LABEL_NORMS}
          description={PORTFOLIO_FORM.DESCRIPTION_NORMS}
        >
          <EntityNormAllocations
            allocations={norms}
            onAllocationsChange={updateNorms}
            options={normOptions}
            copy={NORM_ALLOCATIONS}
            error={fieldErrors.norms}
            disabled={pending}
          />
        </SharedFormField>
      </FieldGroup>

      <SharedSubmitButton
        pending={pending}
        label={PORTFOLIO_FORM.ADD_BUTTON}
        pendingLabel={PORTFOLIO_FORM.ADD_PENDING_BUTTON}
      />
    </SharedFormWrapper>
  )
}

export { AddPortfolioForm }
