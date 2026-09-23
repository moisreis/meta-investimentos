"use client"

import * as React from "react"

interface UseSharedAddDialogParams<TValues> {
  /** Persists the entity with the validated form values. */
  onAdd: (values: TValues) => void | Promise<void>
}

/**
 * @summary
 * Orchestrates the shared add-dialog flow.
 *
 * @remarks
 * Owns the add dialog and the add-another dialog open states.
 * On a successful form submit, awaits the persistence callback,
 * closes the add dialog and opens the add-another prompt.
 * "Add another" closes the prompt and reopens the add dialog
 * with a fresh form; "back to table" closes the prompt.
 * While a submission is in flight, further submits are ignored
 * and `isSubmitting` stays true until the call settles.
 *
 * @explanation
 * Use inside the shared add dialog to keep the component
 * presentational and the flow domain agnostic.
 *
 * @param params - Hook arguments.
 * @param params.onAdd - Persistence callback with validated values.
 *
 * @returns The dialog states, flow handlers and submission flag.
 *
 * @example
 * const { isAddDialogOpen, isAddAnotherOpen, handleFormSubmit } =
 *   useSharedAddDialog({ onAdd })
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
function useSharedAddDialog<TValues>({
  onAdd,
}: UseSharedAddDialogParams<TValues>) {
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [isAddAnotherOpen, setIsAddAnotherOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const isSubmittingRef = React.useRef(false)

  const handleOpenDialog = React.useCallback(() => {
    setIsAddDialogOpen(true)
  }, [])

  const handleCloseDialog = React.useCallback((open: boolean) => {
    setIsAddDialogOpen(open)
  }, [])

  const handleCloseAddAnother = React.useCallback(() => {
    setIsAddAnotherOpen(false)
  }, [])

  const handleFormSubmit = React.useCallback(
    async (values: TValues) => {
      // Ignores overlapping submissions.
      if (isSubmittingRef.current) {
        return
      }

      isSubmittingRef.current = true
      setIsSubmitting(true)

      try {
        await onAdd(values)
      } catch {
        // Persistence failed; keep the add dialog open.
        return
      } finally {
        isSubmittingRef.current = false
        setIsSubmitting(false)
      }

      setIsAddDialogOpen(false)
      setIsAddAnotherOpen(true)
    },
    [onAdd]
  )

  const handleAddAnother = React.useCallback(() => {
    setIsAddAnotherOpen(false)
    setIsAddDialogOpen(true)
  }, [])

  const handleBackToTable = React.useCallback(() => {
    setIsAddAnotherOpen(false)
  }, [])

  return {
    isAddDialogOpen,
    isAddAnotherOpen,
    isSubmitting,
    handleOpenDialog,
    handleCloseDialog,
    handleCloseAddAnother,
    handleFormSubmit,
    handleAddAnother,
    handleBackToTable,
  }
}

export { useSharedAddDialog }