"use client"

import * as React from "react"

import { EntityDateInput } from "@/presentation/parts/components/entity-date-input"
import { PortfolioMoneyInput } from "@/presentation/parts/components/portfolio-money-input"
import { SharedFormField } from "@/presentation/parts/components/shared-form-field"
import { SharedFormWrapper } from "@/presentation/parts/components/shared-form-wrapper"
import { SharedSubmitButton } from "@/presentation/parts/components/shared-submit-button"
import type { EntityFormStatus } from "@/presentation/parts/hooks/use-entity-form.hook"
import { FieldGroup } from "@/presentation/ui/field"

import { useAddApplicationForm } from "../hooks/use-add-application-form.hook"
import { APPLICATION_FORM } from "../settings/labels.settings"
import type { ApplicationAddOptions } from "../types/application-add.types"

import { ApplicationFundCombobox } from "./application-fund-combobox"

/**
 * Props for the add application form.
 */
export interface AddApplicationFormProps {
  portfolioId: string
  options: ApplicationAddOptions
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
 * human-readable error messages. Submits the fund, the
 * date and the amount to the add application server
 * action, which creates the position when the fund is not
 * held yet and derives the quotas from the quota price of
 * the chosen date. The form never sends a quota value.
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
 * @param props.portfolioId - Portfolio receiving the
 * application.
 * @param props.options - The fund options.
 * @param props.onStatusChange - Reports submit outcomes.
 *
 * @returns The add application form.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function AddApplicationForm({
  portfolioId,
  options,
  onStatusChange,
}: AddApplicationFormProps) {
  const {
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
  } = useAddApplicationForm(portfolioId)

  React.useEffect(() => {
    onStatusChange?.(status, error)
  }, [status, error, onStatusChange])

  return (
    <SharedFormWrapper onSubmit={handleSubmit}>
      <FieldGroup>
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
          <EntityDateInput
            id="application-date"
            name="date"
            required
            value={date}
            onValueChange={updateDate}
            placeholder={APPLICATION_FORM.PLACEHOLDER_DATE}
            disabled={pending}
            aria-invalid={fieldErrors.date ? "true" : undefined}
          />
        </SharedFormField>
        <SharedFormField
          label={APPLICATION_FORM.FIELD_AMOUNT}
          description={APPLICATION_FORM.DESCRIPTION_AMOUNT}
          error={fieldErrors.amount}
          htmlFor="application-amount"
        >
          <PortfolioMoneyInput
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
