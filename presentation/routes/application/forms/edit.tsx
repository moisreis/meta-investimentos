"use client"

import * as React from "react"

import { FieldGroup } from "@/presentation/ui/field"
import { Input } from "@/presentation/ui/input"
import { FormatCnpjOptional } from "@/presentation/presenters/cnpj.presenter"

import { ApplicationFundCombobox } from "./fund-combobox"
import { SharedFormField } from "@/presentation/parts/components/shared-form-field"
import { SharedFormWrapper } from "@/presentation/parts/components/shared-form-wrapper"
import { SharedSubmitButton } from "@/presentation/parts/components/shared-submit-button"
import type { EntityFormStatus } from "@/presentation/parts/hooks/use-entity-form.hook"
import { useApplicationEditForm } from "@/presentation/routes/application/hooks/use-application-edit-form.hook"
import { APPLICATION_FORM } from "@/presentation/routes/application/settings/labels.settings"
import { QuotaDateInput } from "@/presentation/routes/quota/components/quota-date-input"
import type { ApplicationRowLookup } from "@/presentation/routes/application/types/application-list.types"
import type { FundSelectOptions } from "@/presentation/routes/application/types/application-list.types"

/**
 * Props for the edit application form.
 */
export interface EditApplicationFormProps {
  application: {
    id: string
    positionId: string
    date: string
    amount: string
    quotas: string
    reversedAt: string | null
  }
  options: FundSelectOptions
  names: { applications: Record<string, ApplicationRowLookup> }
  onStatusChange?: (
    status: EntityFormStatus,
    error: string | null
  ) => void
}

/**
 * @summary
 * Renders the edit application form.
 *
 * @remarks
 * Validates fields with **Zod** and shows
 * human-readable error messages. Submits the application
 * to the update server action. Shows loading state while
 * submitting and reports the submit status through
 * `onStatusChange` so the parent dialog can react.
 *
 * @explanation
 * Use as the edit component of the application dialog flow.
 * The parent renders the result toast based on the reported
 * status.
 *
 * @param props - Props of the edit application form.
 * @param props.application - The application to edit.
 * @param props.options - The registry options.
 * @param props.names - The application name lookups.
 * @param props.onStatusChange - Reports submit outcomes.
 *
 * @returns The edit application form.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
function EditApplicationForm({
  application,
  options,
  names,
  onStatusChange,
}: EditApplicationFormProps) {
  const {
    date,
    updateDate,
    amount,
    updateAmount,
    error,
    pending,
    status,
    fieldErrors,
    handleSubmit,
  } = useApplicationEditForm({ initialDate: application.date, initialAmount: application.amount })

  React.useEffect(() => {
    onStatusChange?.(status, error)
  }, [status, error, onStatusChange])

  const lookup = names.applications[application.id]

  return (
    <SharedFormWrapper onSubmit={handleSubmit}>
      <FieldGroup>
        <SharedFormField
          label={APPLICATION_FORM.FIELD_FUND}
          error={fieldErrors.fundId}
          htmlFor="fundId"
        >
          <ApplicationFundCombobox
            id="fundId"
            name="fundId"
            value={lookup?.fundId ?? ""}
            onValueChange={() => {}}
            placeholder={APPLICATION_FORM.PLACEHOLDER_FUND}
            items={options.funds.map((fund) => ({
              id: fund.id,
              name: fund.name,
              description: FormatCnpjOptional(fund.cnpj),
            }))}
            disabled
            aria-invalid={fieldErrors.fundId ? "true" : undefined}
          />
        </SharedFormField>

        <SharedFormField
          label={APPLICATION_FORM.FIELD_DATE}
          error={fieldErrors.date}
          htmlFor="date"
        >
          <QuotaDateInput
            id="date"
            name="date"
            required
            value={date}
            onValueChange={updateDate}
            placeholder={APPLICATION_FORM.PLACEHOLDER_DATE}
            disabled={pending}
            aria-invalid={fieldErrors.date ? "true" : undefined}
            fundId={lookup?.fundId}
          />
        </SharedFormField>

        <SharedFormField
          label={APPLICATION_FORM.FIELD_AMOUNT}
          error={fieldErrors.amount}
          htmlFor="amount"
        >
          <Input
            id="amount"
            name="amount"
            type="text"
            required
            value={amount}
            onChange={(e) => updateAmount(e.target.value)}
            disabled={pending}
            aria-invalid={fieldErrors.amount ? "true" : undefined}
            className="w-48"
            placeholder="0,00"
          />
        </SharedFormField>
      </FieldGroup>

      <SharedSubmitButton
        pending={pending}
        label={APPLICATION_FORM.EDIT_BUTTON}
        pendingLabel={APPLICATION_FORM.EDIT_PENDING_BUTTON}
      />
    </SharedFormWrapper>
  )
}

export { EditApplicationForm }