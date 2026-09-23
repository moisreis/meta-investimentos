"use client"

import * as React from "react"
import { IconLoader } from "@tabler/icons-react"

import { SharedErrorBulkDeleteToast } from "@/presentation/shared/toast/shared-error-bulk-delete-toast"
import { SharedSuccessfulBulkDeleteToast } from "@/presentation/shared/toast/shared-successful-bulk-delete-toast"
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

export interface SharedBulkDeleteDialogProps<TItem> {
  /** Whether the bulk delete dialog is open. */
  open: boolean
  /** Called when the dialog open state changes. */
  onOpenChange?: (open: boolean) => void
  /** Selected items pending deletion. */
  items: TItem[]
  /** Removes the selected entities when the user confirms. */
  onDelete: (items: TItem[]) => void | Promise<void>
  /** Called after the selected items are successfully removed. */
  onDeleted?: () => void
}

/**
 * @summary
 * Domain agnostic bulk delete-confirmation dialog flow.
 *
 * @remarks
 * Controlled dialog that asks for confirmation before removing the
 * selected items. The destructive confirm button awaits the
 * `onDelete` callback and fires either the success toast (closing
 * the dialog and calling `onDeleted`) or the error toast when the
 * removal fails. Confirmations are gated while one is in flight.
 *
 * @explanation
 * Use in a table view to confirm the removal of multiple selected
 * rows through the pagination bulk action. Domain agnostic.
 *
 * @param props - Component configuration props.
 * @param props.open - Whether the bulk delete dialog is open.
 * @param props.onOpenChange - Called when the open state changes.
 * @param props.items - Selected items pending deletion.
 * @param props.onDelete - Removal callback with the selected items.
 * @param props.onDeleted - Called after a successful removal.
 *
 * @returns The bulk delete dialog and the success/error toasts.
 *
 * @example
 * <SharedBulkDeleteDialog
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   items={items}
 *   onDelete={removePortfolios}
 *   onDeleted={() => table.resetRowSelection()}
 * />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
function SharedBulkDeleteDialog<TItem>({
  open,
  onOpenChange,
  items,
  onDelete,
  onDeleted,
}: SharedBulkDeleteDialogProps<TItem>) {
  const {
    isSubmitting,
    hasRemoved,
    hasError,
    handleOpenChange,
    handleConfirm,
  } = useSharedDeleteDialog<TItem[]>({ onDelete, onOpenChange })

  const itemCount = items.length

  React.useEffect(() => {
    // Closes the dialog after a successful deletion.
    if (hasRemoved) {
      onDeleted?.()
      handleOpenChange(false)
    }
  }, [hasRemoved, handleOpenChange, onDeleted])

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>
              Excluir {itemCount} {itemCount === 1 ? "item" : "itens"}?
            </DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita.{" "}
              {itemCount === 1
                ? "O item será removido permanentemente."
                : `Os ${itemCount} itens serão removidos permanentemente.`}
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
              onClick={() => handleConfirm(items)}
            >
              {isSubmitting ? (
                <IconLoader className="animate-spin" aria-hidden="true" />
              ) : itemCount === 1 ? (
                "Excluir"
              ) : (
                "Excluir todos"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SharedSuccessfulBulkDeleteToast show={hasRemoved} />
      <SharedErrorBulkDeleteToast show={hasError} />
    </>
  )
}

export { SharedBulkDeleteDialog }