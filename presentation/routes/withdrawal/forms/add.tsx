"use client"

import * as React from "react"

import { PortfolioMoneyInput } from "@/presentation/parts/components/portfolio-money-input"
import { SharedFormField } from "@/presentation/parts/components/shared-form-field"
import { SharedFormWrapper } from "@/presentation/parts/components/shared-form-wrapper"
import { SharedSubmitButton } from "@/presentation/parts/components/shared-submit-button"
import type { EntityFormStatus } from "@/presentation/parts/hooks/use-entity-form.hook"
import { FieldGroup } from "@/presentation/ui/field"

import { useWithdrawalAddForm } from "../hooks/use-withdrawal-add-form.hook"
import { WITHDRAWAL_FORM } from "../settings/labels.settings"
import type { WithdrawalAddOptions } from "../types/withdrawal-add.types"

import { PositionCombobox } from "./position-combobox"
import { WithdrawalPortfolioCombobox } from "./portfolio-combobox"
import { QuotaDateInput } from "@/presentation/routes/quota/components/quota-date-input"

/**
 * Props for the add withdrawal form.
 */
export interface AddWithdrawalFormProps {
  options: WithdrawalAddOptions
  defaultPortfolioId?: string
  lockedPortfolioId?: string
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
 * The portfolio is picked in the form and only narrows the
 * position picker: a withdrawal always targets an
 * existing position, and that position already names its
 * own portfolio, so the portfolio never leaves the
 * browser. The server payload is therefore unchanged.
 *
 * The portfolio detail screen locks the flow to the
 * portfolio it is showing, so the field is hidden and the
 * picker opens already narrowed down to it.
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
 * @param props.options - The portfolio and position
 * options.
 * @param props.defaultPortfolioId - Portfolio preselected
 * in the form.
 * @param props.lockedPortfolioId - Portfolio the flow is
 * locked to. Hides the portfolio field and always narrows
 * the picker to it, and wins over `defaultPortfolioId`.
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
  defaultPortfolioId,
  lockedPortfolioId,
  onStatusChange,
}: AddWithdrawalFormProps) {
  const {
    portfolioId,
    updatePortfolioId,
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
  } = useWithdrawalAddForm(lockedPortfolioId ?? defaultPortfolioId)

  const IS_PORTFOLIO_LOCKED = Boolean(lockedPortfolioId)

  // A withdrawal can only target a position of the selected
  // portfolio, so the picker is narrowed down to it. With no
  // portfolio chosen the list stays empty, which the empty
  // copy explains instead of leaving the user guessing.
  const PORTFOLIO_POSITIONS = React.useMemo(
    () =>
      options.positions.filter(
        (position) => position.portfolioId === portfolioId
      ),
    [options.positions, portfolioId]
  )

  // Find the fundId for the selected position
  const SELECTED_POSITION = React.useMemo(
    () => PORTFOLIO_POSITIONS.find((p) => p.id === positionId),
    [PORTFOLIO_POSITIONS, positionId]
  )
  const FUND_ID = SELECTED_POSITION?.fundId

  React.useEffect(() => {
    onStatusChange?.(status, error)
  }, [status, error, onStatusChange])

  return (
    <SharedFormWrapper onSubmit={handleSubmit}>
      <FieldGroup>
        {!IS_PORTFOLIO_LOCKED && (
          <SharedFormField
            label={WITHDRAWAL_FORM.FIELD_PORTFOLIO}
            description={WITHDRAWAL_FORM.DESCRIPTION_PORTFOLIO}
            htmlFor="portfolioId"
          >
            <WithdrawalPortfolioCombobox
              id="portfolioId"
              name="portfolioId"
              required
              value={portfolioId}
              onValueChange={updatePortfolioId}
              placeholder={WITHDRAWAL_FORM.PLACEHOLDER_PORTFOLIO}
              items={options.portfolios}
              disabled={pending}
            />
          </SharedFormField>
        )}
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
            items={PORTFOLIO_POSITIONS}
            disabled={pending}
            aria-invalid={
              fieldErrors.positionId ? "true" : undefined
            }
            emptyLabel={
              portfolioId
                ? WITHDRAWAL_FORM.SEARCH_EMPTY
                : WITHDRAWAL_FORM.SEARCH_EMPTY_WITHOUT_PORTFOLIO
            }
          />
        </SharedFormField>
        <SharedFormField
          label={WITHDRAWAL_FORM.FIELD_DATE}
          description={WITHDRAWAL_FORM.DESCRIPTION_DATE}
          error={fieldErrors.date}
          htmlFor="withdrawal-date"
        >
          <QuotaDateInput
            id="withdrawal-date"
            name="date"
            required
            value={date}
            onValueChange={updateDate}
            placeholder={WITHDRAWAL_FORM.PLACEHOLDER_DATE}
            disabled={pending}
            aria-invalid={fieldErrors.date ? "true" : undefined}
            fundId={FUND_ID}
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
