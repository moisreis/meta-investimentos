"use client"

import * as React from "react"

interface UseSharedConfirmDeleteDialogParams<TItem> {
  /** Removes the entity when the user confirms. */
  onDelete: (item: TItem) => void | Promise<void>
  /** Called when the dialog open state changes. */
  onOpenChange?: (open: boolean) => void
}

/**
 * @summary
 * Orchestrates the shared delete-confirmation dialog flow.
 *
 * @remarks
 * Owns the submission flag and the success/error toast flags.
 * On a confirmed deletion, awaits the persistence callback,
 * marks the removal as successful so the dialog fires the
 * success toast and closes; on failure, marks the error so the
 * error toast fires while the dialog stays open for retry.
 * Overlapping confirmations are ignored while one is in flight.
 * Closing the dialog resets all flags for the next deletion.
 *
 * @explanation
 * Use inside the shared delete dialog to keep the component
 * presentational and the flow domain agnostic.
 *
 * @param params - Hook arguments.
 * @param params.onDelete - Persistence callback with the item.
 * @param params.onOpenChange - Forwarded open-state change callback.
 *
 * @returns The submission flag, toast flags and flow handlers.
 *
 * @example
 * const { isSubmitting, hasRemoved, handleConfirm } =
 *   useSharedConfirmDeleteDialog({ onDelete, onOpenChange })
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
function useSharedConfirmDeleteDialog<TItem>({
  onDelete,
  onOpenChange,
}: UseSharedConfirmDeleteDialogParams<TItem>) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [hasRemoved, setHasRemoved] = React.useState(false)
  const [hasError, setHasError] = React.useState(false)
  const isSubmittingRef = React.useRef(false)

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open) {
        // Resets flow flags when the dialog closes.
        isSubmittingRef.current = false
        setIsSubmitting(false)
        setHasRemoved(false)
        setHasError(false)
      }

      onOpenChange?.(open)
    },
    [onOpenChange]
  )

  const handleConfirm = React.useCallback(
    async (item: TItem) => {
      // Ignores overlapping confirmations.
      if (isSubmittingRef.current) {
        return
      }

      isSubmittingRef.current = true
      setIsSubmitting(true)

      try {
        await onDelete(item)
        setHasError(false)
        setHasRemoved(true)
      } catch {
        // Deletion failed; show the error toast and keep the dialog open.
        setHasError(true)
      } finally {
        isSubmittingRef.current = false
        setIsSubmitting(false)
      }
    },
    [onDelete]
  )

  return {
    isSubmitting,
    hasRemoved,
    hasError,
    handleOpenChange,
    handleConfirm,
  }
}

export { useSharedConfirmDeleteDialog }