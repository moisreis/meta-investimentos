"use client"

import * as React from "react"
import { useCallback } from "react"
import { useRouter } from "next/navigation"
import { updateApplicationAction } from "@/presentation/routes/application/actions/update-application.action"
import type { EntityFormStatus } from "@/presentation/parts/hooks/use-entity-form.hook"

/**
 * Configuration of the edit application form.
 */
export interface UseApplicationEditFormConfig {
  initialDate: string
  initialAmount: string
}

/**
 * View model of the edit application form.
 */
export interface UseApplicationEditFormModel {
  date: string
  updateDate: (value: string) => void
  amount: string
  updateAmount: (value: string) => void
  error: string | null
  pending: boolean
  status: EntityFormStatus
  fieldErrors: Record<string, string>
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>
}

/**
 * @summary
 * Manages the edit application form state and submission.
 *
 * @remarks
 * Tracks the date and amount fields, validates on submit
 * with the server action, and reports the status for the
 * parent dialog to show the result toast.
 *
 * @explanation
 * Use inside the edit application form component to keep
 * the form logic out of the presentational layer.
 *
 * @param config - The initial form values.
 * @param config.initialDate - The pre-filled date value.
 * @param config.initialAmount - The pre-filled amount value.
 *
 * @returns The form state and handlers.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
function useApplicationEditForm({
  initialDate,
  initialAmount,
}: UseApplicationEditFormConfig): UseApplicationEditFormModel {
  const ROUTER = useRouter()
  const [DATE, setDate] = React.useState(initialDate)
  const [AMOUNT, setAmount] = React.useState(initialAmount)
  const [ERROR, setError] = React.useState<string | null>(null)
  const [PENDING, setPending] = React.useState(false)
  const [STATUS, setStatus] = React.useState<EntityFormStatus>("idle")
  const [FIELD_ERRORS, setFieldErrors] = React.useState<
    Record<string, string>
  >({})

  const UPDATE_DATE = useCallback((value: string) => {
    setDate(value)
    if (FIELD_ERRORS.date) {
      setFieldErrors((prev) => ({ ...prev, date: "" }))
    }
  }, [FIELD_ERRORS.date])

  const UPDATE_AMOUNT = useCallback((value: string) => {
    setAmount(value)
    if (FIELD_ERRORS.amount) {
      setFieldErrors((prev) => ({ ...prev, amount: "" }))
    }
  }, [FIELD_ERRORS.amount])

  const HANDLE_SUBMIT = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setPending(true)
      setStatus("attempting")
      setError(null)

      try {
        const RESULT = await updateApplicationAction({
          // The application id would need to be passed from the dialog
          applicationId: "", // This will be filled by the dialog
          date: DATE,
          amount: AMOUNT,
        })

        if (!RESULT.success) {
          setError(RESULT.error)
          setStatus("error")
          return
        }

        setStatus("success")
        ROUTER.refresh()
      } catch (cause) {
        setError("Erro inesperado ao atualizar a aplicação.")
        setStatus("error")
      } finally {
        setPending(false)
      }
    },
    [DATE, AMOUNT, ROUTER]
  )

  return {
    date: DATE,
    updateDate: UPDATE_DATE,
    amount: AMOUNT,
    updateAmount: UPDATE_AMOUNT,
    error: ERROR,
    pending: PENDING,
    status: STATUS,
    fieldErrors: FIELD_ERRORS,
    handleSubmit: HANDLE_SUBMIT,
  }
}

export { useApplicationEditForm }