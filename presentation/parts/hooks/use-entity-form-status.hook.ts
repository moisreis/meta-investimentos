"use client"

import * as React from "react"

import type { EntityFormStatus } from "@/presentation/parts/hooks/use-entity-form.hook"

interface UseEntityFormStatusOptions {
  status: EntityFormStatus
  error: string | null
  onStatusChange?: (
    status: EntityFormStatus,
    error: string | null
  ) => void
}

/**
 * @summary
 * Reports a form's submit status to the parent that owns the
 * outcome.
 *
 * @remarks
 * A form is a child of a dialog, and the dialog is what shows
 * the result toast and the follow-up prompt. The status lives
 * in the form hook because that is where the submit happens,
 * so the two halves need one seam.
 *
 * The effect is deliberately the only place the status leaves
 * the form. Putting it here means every form reports the same
 * way, and a form component stays a render of parts instead of
 * carrying an effect of its own.
 *
 * @explanation
 * Use inside a form component that accepts an
 * `onStatusChange` prop. Call it once with the status and
 * error the form hook returned, and pass through the same
 * `onStatusChange` the parent supplied.
 *
 * @param options - The form status and error to report.
 * @param options.status - Status reported by the form hook.
 * @param options.error - Message reported by the form hook.
 * @param options.onStatusChange - The parent's callback.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
function useEntityFormStatus({
  status,
  error,
  onStatusChange,
}: UseEntityFormStatusOptions) {
  React.useEffect(() => {
    onStatusChange?.(status, error)
  }, [status, error, onStatusChange])

  return { status, error }
}

export { useEntityFormStatus }
