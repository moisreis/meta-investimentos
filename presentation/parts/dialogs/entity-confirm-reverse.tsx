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
 * Props for the entity single-row reverse dialog.
 */
export interface EntityConfirmReverseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel: string
  cancelLabel: string
  /** Disables the actions while the reversal runs. */
  pending?: boolean
  onConfirm: () => void
}

/**
 * @summary
 * Renders the confirmation dialog for a single-row reverse.
 *
 * @remarks
 * Props-driven confirmation dialog kept generic so every
 * route can supply its own copy through the settings. The
 * confirm action uses the primary button variant, since a
 * reversal is a booking correction and not an erasure, and
 * disables both actions while the reversal is pending.
 *
 * @explanation
 * Use as the shared reverse dialog of the entity dialog
 * kit. Open it from the row actions menu so the user can
 * confirm a reversal that marks the movement as reversed
 * before it runs.
 *
 * @param props - The dialog state, copy and confirm handler.
 * @param props.open - Controls the dialog visibility.
 * @param props.onOpenChange - Reports the open state.
 * @param props.title - Dialog header title.
 * @param props.description - Reversal description.
 * @param props.confirmLabel - Confirm button label.
 * @param props.cancelLabel - Cancel button label.
 * @param props.pending - True while the reversal runs.
 * @param props.onConfirm - Confirm reverse handler.
 *
 * @returns The confirmation dialog.
 *
 * @example
 * <EntityConfirmReverseDialog open={open}
 *   onOpenChange={setOpen} title="Reverter aplicação"
 *   description="Deseja reverter a aplicação na carteira RF?"
 *   confirmLabel="Reverter" cancelLabel="Cancelar"
 *   onConfirm={handleConfirm} />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
function EntityConfirmReverseDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  pending = false,
  onConfirm,
}: EntityConfirmReverseDialogProps) {
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
            variant="default"
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

export { EntityConfirmReverseDialog }
