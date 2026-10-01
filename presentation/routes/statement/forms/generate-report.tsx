"use client"

import { useStatementPortfolioOptions } from "../hooks/use-statement-portfolio-options.hook"

import { FieldGroup } from "@/presentation/ui/field"

import { EntityMonthInput } from "@/presentation/parts/components/entity-month-input"
import { SharedFormField } from "@/presentation/parts/components/shared-form-field"
import { useEntityFormStatus } from "@/presentation/parts/hooks/use-entity-form-status.hook"
import { SharedFormWrapper } from "@/presentation/parts/components/shared-form-wrapper"
import { SharedSubmitButton } from "@/presentation/parts/components/shared-submit-button"
import type { EntityFormStatus } from "@/presentation/parts/hooks/use-entity-form.hook"
import { useStatementGenerateForm } from "@/presentation/routes/statement/hooks/use-statement-generate-form.hook"
import {
  STATEMENT_DIALOG,
  STATEMENT_FORM,
} from "@/presentation/routes/statement/settings/labels.settings"
import type { PortfolioRow } from "@/presentation/types/portfolio-row.types"

import { StatementPortfolioCombobox } from "./portfolio-combobox"

/**
 * Props for the generate statement form.
 */
export interface GenerateStatementFormProps {
  portfolios: PortfolioRow[]
  // Portfolio preselected on mount, so a screen that already
  // shows one portfolio generates its report without a
  // second selection. Omit to leave the field unset.
  defaultPortfolioId?: string
  onStatusChange?: (
    status: EntityFormStatus,
    error: string | null
  ) => void
}

/**
 * @summary
 * Renders the generate statement form.
 *
 * @remarks
 * Validates fields with **Zod** and shows human-readable
 * error messages. Submits the portfolio id and the month key
 * to the generate server action. Shows loading state while
 * submitting and reports the submit status through
 * `onStatusChange` so the parent dialog can react.
 *
 * @explanation
 * Use as the form of the statement generate dialog flow. The
 * parent renders the result toast based on the reported
 * status.
 *
 * @param props - Props of the generate statement form.
 * @param props.portfolios - Options of the portfolio field.
 * @param props.defaultPortfolioId - Portfolio preselected
 *   on mount.
 * @param props.onStatusChange - Reports submit outcomes.
 *
 * @returns The generate statement form.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
function GenerateStatementForm({
  portfolios,
  defaultPortfolioId,
  onStatusChange,
}: GenerateStatementFormProps) {
  const {
    portfolioId,
    updatePortfolioId,
    month,
    updateMonth,
    error,
    pending,
    status,
    fieldErrors,
    handleSubmit,
  } = useStatementGenerateForm(defaultPortfolioId)

  useEntityFormStatus({ status, error, onStatusChange })

  const { items, handlePortfolioIdChange } =
    useStatementPortfolioOptions({
      portfolios,
      portfolioId,
      updatePortfolioId,
    })

  return (
    <SharedFormWrapper onSubmit={handleSubmit}>
      <FieldGroup>
        <SharedFormField
          label={STATEMENT_DIALOG.FIELD_PORTFOLIO}
          error={fieldErrors.portfolioId}
          htmlFor="portfolioId"
        >
          <StatementPortfolioCombobox
            id="portfolioId"
            name="portfolioId"
            value={portfolioId}
            onValueChange={handlePortfolioIdChange}
            placeholder={
              STATEMENT_DIALOG.FIELD_PORTFOLIO_PLACEHOLDER
            }
            items={items}
            required
            disabled={pending}
            aria-invalid={
              fieldErrors.portfolioId ? "true" : undefined
            }
          />
        </SharedFormField>

        <SharedFormField
          label={STATEMENT_DIALOG.FIELD_MONTH}
          error={fieldErrors.month}
          htmlFor="month"
        >
          <EntityMonthInput
            id="month"
            name="month"
            value={month}
            onValueChange={updateMonth}
            placeholder={
              STATEMENT_DIALOG.FIELD_MONTH_PLACEHOLDER
            }
            gridLabel={STATEMENT_DIALOG.FIELD_MONTH_GRID_LABEL}
            required
            disabled={pending}
            aria-invalid={fieldErrors.month ? "true" : undefined}
          />
        </SharedFormField>
      </FieldGroup>

      <SharedSubmitButton
        pending={pending}
        label={STATEMENT_FORM.GENERATE_BUTTON}
        pendingLabel={STATEMENT_FORM.GENERATE_PENDING_BUTTON}
      />
    </SharedFormWrapper>
  )
}

export { GenerateStatementForm }
