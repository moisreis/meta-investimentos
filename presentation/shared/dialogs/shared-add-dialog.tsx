"use client"

import * as React from "react"

import { SharedAddItemButton } from "@/presentation/shared/components/shared-add-item-button"
import { SharedSuccessfulItemAddedToast } from "@/presentation/shared/toast/shared-succesful-item-added-toast"
import { Dialog, DialogContent } from "@/presentation/ui/dialog"

import { useSharedAddDialog } from "./hooks/use-shared-add-dialog.hook"
import { SharedAddAnother } from "./shared-add-another"

export interface SharedAddDialogProps<TValues> {
  /** Entity form element rendered inside the add dialog. */
  form: React.ReactElement
  /** Persists the entity with the validated form values. */
  onAdd: (values: TValues) => void | Promise<void>
  /** Item label used in the add-another prompt. */
  itemLabel?: string
}

/**
 * @summary
 * Domain agnostic add-item dialog flow.
 *
 * @remarks
 * Renders the shared add button as trigger. Opens a dialog with
 * the given entity form and supplies the form's `onSubmit` and
 * `isSubmitting` props, so a successful submit awaits the `onAdd`
 * callback, fires the success toast and prompts the user to add
 * another item or go back to the table. The form remounts fresh
 * each time the dialog opens and submissions are gated while one
 * is in flight.
 *
 * @explanation
 * Use in any view that adds a single entity through a form. The
 * form element must accept an `onSubmit` prop that the dialog
 * manages. Domain agnostic.
 *
 * @param props - Component configuration props.
 * @param props.form - Entity form rendered inside the add dialog.
 * @param props.onAdd - Persistence callback with validated values.
 * @param props.itemLabel - Item label used in the add-another prompt.
 *
 * @returns The add button, add dialog, toast and add-another dialog.
 *
 * @example
 * <SharedAddDialog
 *   form={<PortfolioForm />}
 *   onAdd={createPortfolio}
 *   itemLabel="portfólio"
 * />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
function SharedAddDialog<TValues>({
  form,
  onAdd,
  itemLabel = "item",
}: SharedAddDialogProps<TValues>) {
  const {
    isAddDialogOpen,
    isAddAnotherOpen,
    isSubmitting,
    handleOpenDialog,
    handleCloseDialog,
    handleCloseAddAnother,
    handleFormSubmit,
    handleAddAnother,
    handleBackToTable,
  } = useSharedAddDialog({ onAdd })

  const formWithSubmit = React.cloneElement(
    form as React.ReactElement<{
      onSubmit: (values: TValues) => void
      isSubmitting?: boolean
    }>,
    { onSubmit: handleFormSubmit, isSubmitting }
  )

  return (
    <>
      <SharedAddItemButton onClick={handleOpenDialog} />

      <Dialog open={isAddDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>{formWithSubmit}</DialogContent>
      </Dialog>

      <SharedAddAnother
        open={isAddAnotherOpen}
        onOpenChange={handleCloseAddAnother}
        onAddAnother={handleAddAnother}
        onBackToTable={handleBackToTable}
        itemLabel={itemLabel}
      />

      <SharedSuccessfulItemAddedToast show={isAddAnotherOpen} />
    </>
  )
}

export { SharedAddDialog }