"use client"

import * as React from "react"

import { maskPercentage } from "@/presentation/masks/percentage.mask"

import {
  portfolioFormDefaultValues,
  portfolioFormSchema,
  type PortfolioFormInputValues,
  type PortfolioFormValues,
} from "../validations/portfolio-form.validations"

type PortfolioFormFieldKey = keyof PortfolioFormInputValues

type PortfolioFormFieldErrors = Partial<Record<PortfolioFormFieldKey, string>>

// Fields that should be formatted with the percentage mask.
const PERCENTAGE_FIELDS: PortfolioFormFieldKey[] = [
  "annualInterestRate",
  "minAllocation",
  "targetAllocation",
  "maxAllocation",
]

interface UsePortfolioFormParams {
  initialValues?: Partial<PortfolioFormInputValues>
  onSubmit?: (values: PortfolioFormValues) => void
}

/**
 * @summary
 * Manages the portfolio form state, masking, validation and submission.
 *
 * @remarks
 * Holds all portfolio fields as raw input strings. Percentage fields
 * are formatted with the percentage mask on change. Validates with
 * Zod and re-validates a field as it changes after an invalid attempt.
 * Emits the validated payload through `onSubmit`.
 *
 * @explanation
 * Use inside the portfolio form to keep the component presentational.
 * Wire the returned `values` into controlled inputs, call `updateField`
 * on change and `handleSubmit` on submit. Render `fieldErrors` per field.
 *
 * @param params - Hook arguments.
 * @param params.initialValues - Initial raw field values (edit mode).
 * @param params.onSubmit - Called with the validated values on submit.
 *
 * @returns The field values, update handler, field errors and submit handler.
 *
 * @example
 * const { values, updateField, fieldErrors, handleSubmit } =
 *   usePortfolioForm({ initialValues, onSubmit })
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
function usePortfolioForm({ initialValues, onSubmit }: UsePortfolioFormParams) {
  const [values, setValues] = React.useState<PortfolioFormInputValues>(() => ({
    ...portfolioFormDefaultValues,
    ...initialValues,
  }))
  const [fieldErrors, setFieldErrors] =
    React.useState<PortfolioFormFieldErrors>({})

  function validateField(
    key: PortfolioFormFieldKey,
    nextValues: PortfolioFormInputValues
  ) {
    const result = portfolioFormSchema.safeParse(nextValues)

    const message = result.success
      ? undefined
      : result.error.flatten().fieldErrors[key]?.[0]

    setFieldErrors((previous) => ({ ...previous, [key]: message }))
  }

  function updateField(key: PortfolioFormFieldKey, rawValue: string) {
    const nextValue = PERCENTAGE_FIELDS.includes(key)
      ? maskPercentage(rawValue)
      : rawValue
    const nextValues = { ...values, [key]: nextValue }

    setValues(nextValues)
    validateField(key, nextValues)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = portfolioFormSchema.safeParse(values)

    if (!result.success) {
      const flattened = result.error.flatten().fieldErrors

      setFieldErrors({
        acronym: flattened.acronym?.[0],
        name: flattened.name?.[0],
        annualInterestRate: flattened.annualInterestRate?.[0],
        minAllocation: flattened.minAllocation?.[0],
        targetAllocation: flattened.targetAllocation?.[0],
        maxAllocation: flattened.maxAllocation?.[0],
      })

      return
    }

    setFieldErrors({})
    onSubmit?.(result.data)
  }

  return {
    values,
    updateField,
    fieldErrors,
    handleSubmit,
  }
}

export {
  usePortfolioForm,
  type PortfolioFormFieldKey,
  type PortfolioFormFieldErrors,
}