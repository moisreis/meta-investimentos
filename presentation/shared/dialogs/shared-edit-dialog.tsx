"use client"

import * as React from "react"

import { SharedErrorItemEditedToast } from "@/presentation/shared/toast/shared-error-item-edited-toast"
import { SharedSuccessfulItemEditedToast } from "@/presentation/shared/toast/shared-successful-item-edited-toast"
import { Dialog, DialogContent } from "@/presentation/ui/dialog"

import { useSharedEditDialog } from "./hooks/use-shared-edit-dialog.hook"

export interface SharedEditDialogProps<TItem, TValues> {
  /** Whether the edit dialog is open. */
  open: boolean
  /** Called when the dialog open state changes. */
  onOpenChange?: (open: boolean) => void
  /** Item being edited, or null when the dialog is closed. */
  item: TItem | null
  /** Builds the entity form prefilled with the item data. */
  renderForm: (item: TItem) => React.ReactElement
  /** Persists the edited entity with the validated values. */
  onEdit: (item: TItem, values: TValues) => void | Promise<void>
}

/**
 * @summary
 * Domain agnostic edit-item dialog flow.
 *
 * @remarks
 * Controlled dialog that opens prefilled with the item data. The
 * provided form builder receives the item and must render the
 * entity form with its `initialValues` derived from the item. The
 * dialog injects `onSubmit` and `isSubmitting` into the form, so a
 * valid submit awaits the `onEdit` callback and fires either the
 * success toast (closing the dialog) or the error toast. Form
 * submissions are gated while one is in flight.
 *
 * @explanation
 * Use in a table view to edit a single entity through its form.
 * The form element must accept an `onSubmit` prop that the dialog
 * manages and an `isSubmitting` prop to disable actions while the
 * edit is pending. Domain agnostic.
 *
 * @param props - Component configuration props.
 * @param props.open - Whether the edit dialog is open.
 * @param props.onOpenChange - Called when the open state changes.
 * @param props.item - Item being edited, or null when closed.
 * @param props.renderForm - Form builder prefilled from the item.
 * @param props.onEdit - Persistence callback with the item and values.
 *
 * @returns The edit dialog and the success/error toasts.
 *
 * @example
 * <SharedEditDialog
 *   open={Boolean(item)}
 *   onOpenChange={handleOpenChange}
 *   item={item}
 *   renderForm={(item) => (
 *     <PortfolioForm initialValues={toFormInitialValues(item)} />
 *   )}
 *   onEdit={updatePortfolio}
 * />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
function SharedEditDialog<TItem, TValues>({
  open,
  onOpenChange,
  item,
  renderForm,
  onEdit,
}: SharedEditDialogProps<TItem, TValues>) {
  const {
    isSubmitting,
    hasEdited,
    hasError,
    handleOpenChange,
    handleFormSubmit,
  } = useSharedEditDialog({ onEdit, onOpenChange })

  React.useEffect(() => {
    // Closes the dialog after a successful edit.
    if (hasEdited) {
      handleOpenChange(false)
    }
  }, [hasEdited, handleOpenChange])

  // Renders nothing until the parent supplies the item being edited.
  if (!item) {
    return null
  }

  const formWithSubmit = React.cloneElement(
    renderForm(item) as React.ReactElement<{
      onSubmit: (values: TValues) => void
      isSubmitting?: boolean
    }>,
    {
      onSubmit: (values: TValues) => handleFormSubmit(item, values),
      isSubmitting,
    }
  )

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>{formWithSubmit}</DialogContent>
      </Dialog>

      <SharedSuccessfulItemEditedToast show={hasEdited} />
      <SharedErrorItemEditedToast show={hasError} />
    </>
  )
}

export { SharedEditDialog }