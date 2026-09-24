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
 * Props for the single-row delete confirm dialog.
 */
export interface EntityTableDeleteDialogProps {
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
 * route can supply its own copy through the settings. It
 * complements the bulk delete dialog with a single-item
 * flow for the per-row actions menu.
 *
 * @param props - The dialog state, copy and confirm handler.
 *
 * @returns The confirmation dialog.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
function EntityTableDeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  pending = false,
  onConfirm,
}: EntityTableDeleteDialogProps) {
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

export { EntityTableDeleteDialog }
