"use client"

import { Button } from "@/presentation/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/presentation/ui/dialog"

/**
 * Props for the entity single-row delete dialog.
 */
export interface EntityConfirmDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel: string
  cancelLabel: string
  /** Disables the actions while the deletion runs. */
  pending?: boolean
  onConfirm: () => void
}

/**
 * @summary
 * Renders the confirmation dialog for a single-row delete.
 *
 * @remarks
 * Props-driven confirmation dialog kept generic so every
 * route can supply its own copy through the settings. The
 * confirm action uses the destructive button variant and
 * disables both actions while the deletion is pending.
 *
 * @explanation
 * Use as the shared delete dialog of the entity dialog
 * kit. Open it from the row actions menu so the user can
 * confirm an irreversible deletion before it runs.
 *
 * @param props - The dialog state, copy and confirm handler.
 * @param props.open - Controls the dialog visibility.
 * @param props.onOpenChange - Reports the open state.
 * @param props.title - Dialog header title.
 * @param props.description - Deletion description.
 * @param props.confirmLabel - Confirm button label.
 * @param props.cancelLabel - Cancel button label.
 * @param props.pending - True while the deletion runs.
 * @param props.onConfirm - Confirm delete handler.
 *
 * @returns The confirmation dialog.
 *
 * @example
 * <EntityConfirmDeleteDialog open={open}
 *   onOpenChange={setOpen} title="Excluir carteira"
 *   description="Deseja excluir a carteira RF?"
 *   confirmLabel="Excluir" cancelLabel="Cancelar"
 *   onConfirm={handleConfirm} />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function EntityConfirmDeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  pending = false,
  onConfirm,
}: EntityConfirmDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            disabled={pending}
            onClick={() => onOpenChange(false)}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="destructive"
            disabled={pending}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { EntityConfirmDeleteDialog }
