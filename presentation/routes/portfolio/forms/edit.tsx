"use client"

import * as React from "react"

import { FieldGroup } from "@/presentation/ui/field"
import { Input } from "@/presentation/ui/input"

import { PortfolioPercentageInput } from "@/presentation/parts/components/portfolio-percentage-input"
import { SharedFormField } from "@/presentation/parts/components/shared-form-field"
import { SharedFormWrapper } from "@/presentation/parts/components/shared-form-wrapper"
import { SharedSubmitButton } from "@/presentation/parts/components/shared-submit-button"
import type { EntityFormStatus } from "@/presentation/parts/hooks/use-entity-form.hook"
import { useEditPortfolioForm } from "@/presentation/routes/portfolio/hooks/use-edit-portfolio-form.hook"

import { PORTFOLIO_FORM } from "@/presentation/routes/portfolio/settings/labels.settings"

import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"

/**
 * Props for the edit portfolio form.
 */
export interface EditPortfolioFormProps {
  portfolio: PortfolioResponseDTO
  onStatusChange?: (
    status: EntityFormStatus,
    error: string | null
  ) => void
}

/**
 * @summary
 * Renders the edit portfolio form.
 *
 * @remarks
 * Seeds the fields from the provided portfolio.
 * Validates fields with **Zod** and shows
 * human-readable error messages.
 * Submits the portfolio to the update server action.
 * Shows loading state while submitting and reports the
 * submit status through `onStatusChange` so the parent
 * dialog can react to the outcome.
 *
 * @explanation
 * Use as the edit component of the portfolio dialog flow.
 * The parent renders the result toast and closes on
 * success based on the reported status.
 *
 * @param props - Props of the edit portfolio form.
 * @param props.portfolio - Portfolio being edited.
 * @param props.onStatusChange - Reports submit outcomes.
 *
 * @returns The edit portfolio form.
 *
 * @example
 * <EditPortfolioForm portfolio={portfolio}
 *   onStatusChange={(status, error) => handle(status, error)} />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function EditPortfolioForm({
  portfolio,
  onStatusChange,
}: EditPortfolioFormProps) {
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
    error,
    pending,
    status,
    fieldErrors,
    handleSubmit,
  } = useEditPortfolioForm(portfolio)

  React.useEffect(() => {
    onStatusChange?.(status, error)
  }, [status, error, onStatusChange])

  return (
    <SharedFormWrapper onSubmit={handleSubmit}>
      <FieldGroup>
        <SharedFormField
          label="Sigla"
          error={fieldErrors.acronym}
          htmlFor="acronym"
        >
          <Input
            id="acronym"
            type="text"
            name="acronym"
            autoComplete="off"
            placeholder="Ex.: RF"
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
          label="Nome"
          error={fieldErrors.name}
          htmlFor="name"
        >
          <Input
            id="name"
            type="text"
            name="name"
            autoComplete="off"
            placeholder="Ex.: Renda Fixa"
            required
            value={name}
            onChange={(e) => updateName(e.target.value)}
            disabled={pending}
            aria-invalid={fieldErrors.name ? "true" : undefined}
          />
        </SharedFormField>
        <SharedFormField
          label="Taxa de juros anual"
          description="Em percentual ao ano."
          error={fieldErrors.annualInterestRate}
          htmlFor="annualInterestRate"
        >
          <PortfolioPercentageInput
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
          label="Alocação mínima"
          error={fieldErrors.minAllocation}
          htmlFor="minAllocation"
        >
          <PortfolioPercentageInput
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
          label="Alocação alvo"
          error={fieldErrors.targetAllocation}
          htmlFor="targetAllocation"
        >
          <PortfolioPercentageInput
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
          label="Alocação máxima"
          error={fieldErrors.maxAllocation}
          htmlFor="maxAllocation"
        >
          <PortfolioPercentageInput
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
        label={PORTFOLIO_FORM.EDIT_BUTTON}
        pendingLabel={PORTFOLIO_FORM.EDIT_PENDING_BUTTON}
      />
    </SharedFormWrapper>
  )
}

export { EditPortfolioForm }
