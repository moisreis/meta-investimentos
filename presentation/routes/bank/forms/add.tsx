"use client"

import * as React from "react"

import { FieldGroup } from "@/presentation/ui/field"
import { Input } from "@/presentation/ui/input"

import { SharedFormField } from "@/presentation/parts/components/shared-form-field"
import { SharedFormWrapper } from "@/presentation/parts/components/shared-form-wrapper"
import { SharedSubmitButton } from "@/presentation/parts/components/shared-submit-button"
import type { EntityFormStatus } from "@/presentation/parts/hooks/use-entity-form.hook"
import { useAddBankForm } from "@/presentation/routes/bank/hooks/use-add-bank-form.hook"

import { BANK_FORM } from "@/presentation/routes/bank/settings/labels.settings"

/**
 * Props for the add bank form.
 */
export interface AddBankFormProps {
  onStatusChange?: (
    status: EntityFormStatus,
    error: string | null
  ) => void
}

/**
 * @summary
 * Renders the add bank form.
 *
 * @remarks
 * Validates fields with **Zod** and shows
 * human-readable error messages.
 * Submits the bank to the create server action.
 * Shows loading state while submitting and reports the
 * submit status through `onStatusChange` so the parent
 * dialog can react to the outcome.
 *
 * @explanation
 * Use as the add component of the bank dialog flow.
 * The parent renders the result toast and the follow-up
 * prompt based on the reported status.
 *
 * @param props - Props of the add bank form.
 * @param props.onStatusChange - Reports submit outcomes.
 *
 * @returns The add bank form.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function AddBankForm({ onStatusChange }: AddBankFormProps) {
  const {
    code,
    updateCode,
    name,
    updateName,
    error,
    pending,
    status,
    fieldErrors,
    handleSubmit,
  } = useAddBankForm()

  React.useEffect(() => {
    onStatusChange?.(status, error)
  }, [status, error, onStatusChange])

  return (
    <SharedFormWrapper onSubmit={handleSubmit}>
      <FieldGroup>
        <SharedFormField
          label="Código"
          error={fieldErrors.code}
          htmlFor="code"
        >
          <Input
            id="code"
            type="text"
            name="code"
            autoComplete="off"
            placeholder="Ex.: 237"
            required
            value={code}
            onChange={(e) => updateCode(e.target.value)}
            disabled={pending}
            aria-invalid={fieldErrors.code ? "true" : undefined}
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
            placeholder="Ex.: Banco Bradesco"
            required
            value={name}
            onChange={(e) => updateName(e.target.value)}
            disabled={pending}
            aria-invalid={fieldErrors.name ? "true" : undefined}
          />
        </SharedFormField>
      </FieldGroup>

      <SharedSubmitButton
        pending={pending}
        label={BANK_FORM.ADD_BUTTON}
        pendingLabel={BANK_FORM.ADD_PENDING_BUTTON}
      />
    </SharedFormWrapper>
  )
}

export { AddBankForm }
