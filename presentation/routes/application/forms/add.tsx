"use client"

import { EntityMoneyInput } from "@/presentation/parts/components/entity-money-input"
import { useEntityFormStatus } from "@/presentation/parts/hooks/use-entity-form-status.hook"
import { EntityQuotaDateInput } from "@/presentation/parts/components/entity-quota-date-input"
import { SharedFormField } from "@/presentation/parts/components/shared-form-field"
import { SharedFormWrapper } from "@/presentation/parts/components/shared-form-wrapper"
import { SharedSubmitButton } from "@/presentation/parts/components/shared-submit-button"
import type { EntityFormStatus } from "@/presentation/parts/hooks/use-entity-form.hook"
import { FieldGroup } from "@/presentation/ui/field"

import { useApplicationAddForm } from "../hooks/use-application-add-form.hook"
import { APPLICATION_FORM } from "../settings/labels.settings"
import type { ApplicationAddOptions } from "../types/application-add.types"

import { ApplicationFundCombobox } from "./fund-combobox"
import { ApplicationPortfolioCombobox } from "./portfolio-combobox"

/**
 * Props for the add application form.
 */
export interface AddApplicationFormProps {
  options: ApplicationAddOptions
  defaultPortfolioId?: string
  lockedPortfolioId?: string
  onStatusChange?: (
    status: EntityFormStatus,
    error: string | null
  ) => void
}

/**
 * @summary
 * Renders the add application form.
 *
 * @remarks
 * Validates fields with **Zod** and shows
 * human-readable error messages. Submits the portfolio, the
 * fund, the date and the amount to the add application
 * server action, which creates the position when the fund is
 * not held yet and derives the quotas from the quota price of
 * the chosen date. The form never sends a quota value.
 *
 * The portfolio is picked inside the dialog by default: the
 * application list screen passes nothing and the user chooses
 * the portfolio. The portfolio detail screen locks the flow
 * to the portfolio it is showing, so the field is hidden and
 * the id still travels with the payload.
 *
 * Shows loading state while submitting and reports the
 * submit status through `onStatusChange` so the parent
 * dialog can react to the outcome.
 *
 * @explanation
 * Use as the add component of the application dialog
 * flow. The parent renders the result toast and the
 * follow-up prompt based on the reported status.
 *
 * @param props - Props of the add application form.
 * @param props.options - The portfolio and fund options.
 * @param props.defaultPortfolioId - Portfolio preselected
 * in the form.
 * @param props.lockedPortfolioId - Portfolio the flow is
 * locked to. Hides the portfolio field and always submits
 * this id, and wins over `defaultPortfolioId`.
 * @param props.onStatusChange - Reports submit outcomes.
 *
 * @returns The add application form.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function AddApplicationForm({
  options,
  defaultPortfolioId,
  lockedPortfolioId,
  onStatusChange,
}: AddApplicationFormProps) {
  const {
    portfolioId,
    updatePortfolioId,
    fundId,
    updateFundId,
    date,
    updateDate,
    amount,
    updateAmount,
    error,
    pending,
    status,
    fieldErrors,
    handleSubmit,
  } = useApplicationAddForm(
    lockedPortfolioId ?? defaultPortfolioId
  )

  const IS_PORTFOLIO_LOCKED = Boolean(lockedPortfolioId)

  useEntityFormStatus({ status, error, onStatusChange })

  return (
    <SharedFormWrapper onSubmit={handleSubmit}>
      <FieldGroup>
        {!IS_PORTFOLIO_LOCKED && (
          <SharedFormField
            label={APPLICATION_FORM.FIELD_PORTFOLIO}
            description={APPLICATION_FORM.DESCRIPTION_PORTFOLIO}
            error={fieldErrors.portfolioId}
            htmlFor="portfolioId"
          >
            <ApplicationPortfolioCombobox
              id="portfolioId"
              name="portfolioId"
              required
              value={portfolioId}
              onValueChange={updatePortfolioId}
              placeholder={
                APPLICATION_FORM.PLACEHOLDER_PORTFOLIO
              }
              items={options.portfolios}
              disabled={pending}
              aria-invalid={
                fieldErrors.portfolioId ? "true" : undefined
              }
            />
          </SharedFormField>
        )}
        <SharedFormField
          label={APPLICATION_FORM.FIELD_FUND}
          description={APPLICATION_FORM.DESCRIPTION_FUND}
          error={fieldErrors.fundId}
          htmlFor="fundId"
        >
          <ApplicationFundCombobox
            id="fundId"
            name="fundId"
            required
            value={fundId}
            onValueChange={updateFundId}
            placeholder={APPLICATION_FORM.PLACEHOLDER_FUND}
            items={options.funds}
            disabled={pending}
            aria-invalid={
              fieldErrors.fundId ? "true" : undefined
            }
          />
        </SharedFormField>
        <SharedFormField
          label={APPLICATION_FORM.FIELD_DATE}
          description={APPLICATION_FORM.DESCRIPTION_DATE}
          error={fieldErrors.date}
          htmlFor="application-date"
        >
          <EntityQuotaDateInput
            id="application-date"
            name="date"
            required
            value={date}
            onValueChange={updateDate}
            placeholder={APPLICATION_FORM.PLACEHOLDER_DATE}
            disabled={pending}
            aria-invalid={fieldErrors.date ? "true" : undefined}
            fundId={fundId || undefined}
          />
        </SharedFormField>
        <SharedFormField
          label={APPLICATION_FORM.FIELD_AMOUNT}
          description={APPLICATION_FORM.DESCRIPTION_AMOUNT}
          error={fieldErrors.amount}
          htmlFor="application-amount"
        >
          <EntityMoneyInput
            id="application-amount"
            name="amount"
            required
            value={amount}
            onChange={updateAmount}
            disabled={pending}
            aria-invalid={
              fieldErrors.amount ? "true" : undefined
            }
          />
        </SharedFormField>
      </FieldGroup>

      <SharedSubmitButton
        pending={pending}
        label={APPLICATION_FORM.ADD_BUTTON}
        pendingLabel={APPLICATION_FORM.ADD_PENDING_BUTTON}
      />
    </SharedFormWrapper>
  )
}

export { AddApplicationForm }
