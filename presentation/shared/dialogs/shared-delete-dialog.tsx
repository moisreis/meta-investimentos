"use client"

import * as React from "react"
import { IconLoader } from "@tabler/icons-react"

import { SharedErrorItemRemovedToast } from "@/presentation/shared/toast/shared-error-item-removed-toast"
import { SharedSuccessfulItemRemovedToast } from "@/presentation/shared/toast/shared-successful-item-removed-toast"
import { Button } from "@/presentation/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/presentation/ui/dialog"

import { useSharedDeleteDialog } from "./hooks/use-shared-delete-dialog.hook"

export interface SharedDeleteDialogProps<TItem> {
  /** Whether the delete dialog is open. */
  open: boolean
  /** Called when the dialog open state changes. */
  onOpenChange?: (open: boolean) => void
  /** Item pending deletion, or null when the dialog is closed. */
  item: TItem | null
  /** Removes the entity when the user confirms. */
  onDelete: (item: TItem) => void | Promise<void>
  /** Resolves the item display name used in the confirmation header. */
  getItemName: (item: TItem) => string
}

/**
 * @summary
 * Domain agnostic delete-confirmation dialog flow.
 *
 * @remarks
 * Controlled dialog that asks for confirmation before removing an
 * item. The destructive confirm button awaits the `onDelete`
 * callback and fires either the success toast (closing the dialog)
 * or the error toast when the deletion fails. Confirmations are
 * gated while one is in flight.
 *
 * @explanation
 * Use in a table view to confirm an item deletion through its row
 * actions. Domain agnostic.
 *
 * @param props - Component configuration props.
 * @param props.open - Whether the delete dialog is open.
 * @param props.onOpenChange - Called when the open state changes.
 * @param props.item - Item pending deletion, or null when closed.
 * @param props.onDelete - Removal callback with the item.
 * @param props.getItemName - Resolves the item display name.
 *
 * @returns The delete dialog and the success/error toasts.
 *
 * @example
 * <SharedDeleteDialog
 *   open={Boolean(item)}
 *   onOpenChange={handleOpenChange}
 *   item={item}
 *   onDelete={removePortfolio}
 *   getItemName={(item) => item.name}
 * />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
function SharedDeleteDialog<TItem>({
  open,
  onOpenChange,
  item,
  onDelete,
  getItemName,
}: SharedDeleteDialogProps<TItem>) {
  const {
    isSubmitting,
    hasRemoved,
    hasError,
    handleOpenChange,
    handleConfirm,
  } = useSharedDeleteDialog({ onDelete, onOpenChange })

  React.useEffect(() => {
    // Closes the dialog after a successful deletion.
    if (hasRemoved) {
      handleOpenChange(false)
    }
  }, [hasRemoved, handleOpenChange])

  // Renders nothing until the parent supplies the item pending deletion.
  if (!item) {
    return null
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Excluir {getItemName(item)}?</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. O item será removido
              permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={isSubmitting}
              onClick={() => handleOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              disabled={isSubmitting}
              onClick={() => handleConfirm(item)}
            >
              {isSubmitting ? (
                <IconLoader className="animate-spin" aria-hidden="true" />
              ) : (
                "Excluir"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SharedSuccessfulItemRemovedToast show={hasRemoved} />
      <SharedErrorItemRemovedToast show={hasError} />
    </>
  )
}

export { SharedDeleteDialog }