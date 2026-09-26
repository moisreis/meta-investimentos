"use client"

import * as React from "react"

import { FieldGroup } from "@/presentation/ui/field"
import { Input } from "@/presentation/ui/input"
import { NativeSelect } from "@/presentation/ui/native-select"

import { SharedFormField } from "@/presentation/parts/components/shared-form-field"
import { SharedFormWrapper } from "@/presentation/parts/components/shared-form-wrapper"
import { SharedSubmitButton } from "@/presentation/parts/components/shared-submit-button"
import type { EntityFormStatus } from "@/presentation/parts/hooks/use-entity-form.hook"
import { useGenerateStatementForm } from "@/presentation/routes/statement/hooks/use-statement-generate-form.hook"
import {
  STATEMENT_DIALOG,
  STATEMENT_FORM,
} from "@/presentation/routes/statement/settings/labels.settings"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"

/**
 * Props for the generate statement form.
 */
export interface GenerateStatementFormProps {
  portfolios: PortfolioResponseDTO[]
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
 * @param props.onStatusChange - Reports submit outcomes.
 *
 * @returns The generate statement form.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function GenerateStatementForm({
  portfolios,
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
  } = useGenerateStatementForm()

  React.useEffect(() => {
    onStatusChange?.(status, error)
  }, [status, error, onStatusChange])

  return (
    <SharedFormWrapper onSubmit={handleSubmit}>
      <FieldGroup>
        <SharedFormField
          label={STATEMENT_DIALOG.FIELD_PORTFOLIO}
          error={fieldErrors.portfolioId}
          htmlFor="portfolioId"
        >
          <NativeSelect
            id="portfolioId"
            name="portfolioId"
            required
            value={portfolioId}
            onChange={(event) =>
              updatePortfolioId(event.target.value)
            }
            disabled={pending}
            aria-invalid={
              fieldErrors.portfolioId ? "true" : undefined
            }
          >
            <option value="">
              {STATEMENT_DIALOG.FIELD_PORTFOLIO_PLACEHOLDER}
            </option>
            {portfolios.map((portfolio) => (
              <option key={portfolio.id} value={portfolio.id}>
                {portfolio.acronym} - {portfolio.name}
              </option>
            ))}
          </NativeSelect>
        </SharedFormField>

        <SharedFormField
          label={STATEMENT_DIALOG.FIELD_MONTH}
          error={fieldErrors.month}
          htmlFor="month"
        >
          <Input
            id="month"
            name="month"
            type="month"
            required
            value={month}
            onChange={(event) => updateMonth(event.target.value)}
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
