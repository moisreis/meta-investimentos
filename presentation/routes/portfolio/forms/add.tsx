"use client"

import { FieldGroup } from "@/presentation/ui/field"
import { Input } from "@/presentation/ui/input"

import { PortfolioFormToast } from "@/presentation/parts/components/portfolio-form-toast"
import { PortfolioPercentageInput } from "@/presentation/parts/components/portfolio-percentage-input"
import { SharedFormField } from "@/presentation/parts/components/shared-form-field"
import { SharedFormWrapper } from "@/presentation/parts/components/shared-form-wrapper"
import { SharedSubmitButton } from "@/presentation/parts/components/shared-submit-button"

import { useAddPortfolioForm } from "@/presentation/routes/portfolio/hooks/use-add-portfolio-form.hook"

import { PORTFOLIO_FORM } from "@/presentation/routes/portfolio/settings/labels.settings"

/**
 * @summary
 * Renders the add portfolio form.
 *
 * @remarks
 * Validates fields with **Zod** and shows
 * human-readable error messages.
 * Submits the portfolio to the create server action.
 * Shows loading state while submitting.
 *
 * @explanation
 * Use as the add component of the portfolio screen.
 * On success, a success toast is shown.
 *
 * @returns The add portfolio form.
 *
 * @example
 * <AddPortfolioForm />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
function AddPortfolioForm() {
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
  } = useAddPortfolioForm()

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
        label={PORTFOLIO_FORM.ADD_BUTTON}
        pendingLabel={PORTFOLIO_FORM.ADD_PENDING_BUTTON}
      />
      <PortfolioFormToast
        status={status}
        errorMessage={error}
        successTitle={PORTFOLIO_FORM.CREATE_SUCCESS_TITLE}
        successDescription={
          PORTFOLIO_FORM.CREATE_SUCCESS_DESCRIPTION
        }
        errorTitle={PORTFOLIO_FORM.ERROR_TITLE}
      />
    </SharedFormWrapper>
  )
}

export { AddPortfolioForm }
