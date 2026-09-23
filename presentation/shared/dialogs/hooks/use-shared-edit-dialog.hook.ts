"use client"

import * as React from "react"

interface UseSharedEditDialogParams<TItem, TValues> {
  /** Persists the edited entity with the validated form values. */
  onEdit: (item: TItem, values: TValues) => void | Promise<void>
  /** Called when the dialog open state changes. */
  onOpenChange?: (open: boolean) => void
}

/**
 * @summary
 * Orchestrates the shared edit-dialog flow.
 *
 * @remarks
 * Owns the submission flag and the success/error toast flags.
 * On a successful form submit, awaits the persistence callback,
 * marks the edit as successful so the dialog fires the success
 * toast and closes; on failure, marks the error so the error
 * toast fires while the dialog stays open for corrections.
 * While a submission is in flight, further submits are ignored.
 * Closing the dialog resets all flags for the next edit.
 *
 * @explanation
 * Use inside the shared edit dialog to keep the component
 * presentational and the flow domain agnostic.
 *
 * @param params - Hook arguments.
 * @param params.onEdit - Persistence callback with the item and values.
 * @param params.onOpenChange - Forwarded open-state change callback.
 *
 * @returns The submission flag, toast flags and flow handlers.
 *
 * @example
 * const { isSubmitting, hasEdited, handleFormSubmit } =
 *   useSharedEditDialog({ onEdit, onOpenChange })
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
function useSharedEditDialog<TItem, TValues>({
  onEdit,
  onOpenChange,
}: UseSharedEditDialogParams<TItem, TValues>) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [hasEdited, setHasEdited] = React.useState(false)
  const [hasError, setHasError] = React.useState(false)
  const isSubmittingRef = React.useRef(false)

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open) {
        // Resets flow flags when the dialog closes.
        isSubmittingRef.current = false
        setIsSubmitting(false)
        setHasEdited(false)
        setHasError(false)
      }

      onOpenChange?.(open)
    },
    [onOpenChange]
  )

  const handleFormSubmit = React.useCallback(
    async (item: TItem, values: TValues) => {
      // Ignores overlapping submissions.
      if (isSubmittingRef.current) {
        return
      }

      isSubmittingRef.current = true
      setIsSubmitting(true)

      try {
        await onEdit(item, values)
        setHasError(false)
        setHasEdited(true)
      } catch {
        // Persistence failed; show the error toast and keep editing.
        setHasError(true)
      } finally {
        isSubmittingRef.current = false
        setIsSubmitting(false)
      }
    },
    [onEdit]
  )

  return {
    isSubmitting,
    hasEdited,
    hasError,
    handleOpenChange,
    handleFormSubmit,
  }
}

export { useSharedEditDialog }