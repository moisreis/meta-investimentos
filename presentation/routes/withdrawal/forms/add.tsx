"use client"

import * as React from "react"

import { EntityDateInput } from "@/presentation/parts/components/entity-date-input"
import { PortfolioMoneyInput } from "@/presentation/parts/components/portfolio-money-input"
import { SharedFormField } from "@/presentation/parts/components/shared-form-field"
import { SharedFormWrapper } from "@/presentation/parts/components/shared-form-wrapper"
import { SharedSubmitButton } from "@/presentation/parts/components/shared-submit-button"
import type { EntityFormStatus } from "@/presentation/parts/hooks/use-entity-form.hook"
import { FieldGroup } from "@/presentation/ui/field"

import { useAddWithdrawalForm } from "../hooks/use-add-withdrawal-form.hook"
import { WITHDRAWAL_FORM } from "../settings/labels.settings"
import type { WithdrawalAddOptions } from "../types/withdrawal-add.types"

import { PositionCombobox } from "./position-combobox"

/**
 * Props for the add withdrawal form.
 */
export interface AddWithdrawalFormProps {
  options: WithdrawalAddOptions
  onStatusChange?: (
    status: EntityFormStatus,
    error: string | null
  ) => void
}

/**
 * @summary
 * Renders the add withdrawal form.
 *
 * @remarks
 * Validates fields with **Zod** and shows
 * human-readable error messages. Submits the position,
 * the date and the amount to the add withdrawal server
 * action, which derives the quotas from the quota price
 * of the chosen date. The form never sends a quota
 * value.
 *
 * Shows loading state while submitting and reports the
 * submit status through `onStatusChange` so the parent
 * dialog can react to the outcome.
 *
 * @explanation
 * Use as the add component of the withdrawal dialog
 * flow. The parent renders the result toast and the
 * follow-up prompt based on the reported status.
 *
 * @param props - Props of the add withdrawal form.
 * @param props.options - The position options.
 * @param props.onStatusChange - Reports submit outcomes.
 *
 * @returns The add withdrawal form.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function AddWithdrawalForm({
  options,
  onStatusChange,
}: AddWithdrawalFormProps) {
  const {
    positionId,
    updatePositionId,
    date,
    updateDate,
    amount,
    updateAmount,
    error,
    pending,
    status,
    fieldErrors,
    handleSubmit,
  } = useAddWithdrawalForm()

  React.useEffect(() => {
    onStatusChange?.(status, error)
  }, [status, error, onStatusChange])

  return (
    <SharedFormWrapper onSubmit={handleSubmit}>
      <FieldGroup>
        <SharedFormField
          label={WITHDRAWAL_FORM.FIELD_POSITION}
          description={WITHDRAWAL_FORM.DESCRIPTION_POSITION}
          error={fieldErrors.positionId}
          htmlFor="positionId"
        >
          <PositionCombobox
            id="positionId"
            name="positionId"
            required
            value={positionId}
            onValueChange={updatePositionId}
            placeholder={WITHDRAWAL_FORM.PLACEHOLDER_POSITION}
            items={options.positions}
            disabled={pending}
            aria-invalid={
              fieldErrors.positionId ? "true" : undefined
            }
          />
        </SharedFormField>
        <SharedFormField
          label={WITHDRAWAL_FORM.FIELD_DATE}
          description={WITHDRAWAL_FORM.DESCRIPTION_DATE}
          error={fieldErrors.date}
          htmlFor="withdrawal-date"
        >
          <EntityDateInput
            id="withdrawal-date"
            name="date"
            required
            value={date}
            onValueChange={updateDate}
            placeholder={WITHDRAWAL_FORM.PLACEHOLDER_DATE}
            disabled={pending}
            aria-invalid={fieldErrors.date ? "true" : undefined}
          />
        </SharedFormField>
        <SharedFormField
          label={WITHDRAWAL_FORM.FIELD_AMOUNT}
          description={WITHDRAWAL_FORM.DESCRIPTION_AMOUNT}
          error={fieldErrors.amount}
          htmlFor="withdrawal-amount"
        >
          <PortfolioMoneyInput
            id="withdrawal-amount"
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
        label={WITHDRAWAL_FORM.ADD_BUTTON}
        pendingLabel={WITHDRAWAL_FORM.ADD_PENDING_BUTTON}
      />
    </SharedFormWrapper>
  )
}

export { AddWithdrawalForm }
