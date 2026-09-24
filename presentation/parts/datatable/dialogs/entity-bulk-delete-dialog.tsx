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

import {
  ENTITY_TABLE_BULK_DELETE_CANCEL_LABEL,
  ENTITY_TABLE_BULK_DELETE_CONFIRM_LABEL,
  ENTITY_TABLE_BULK_DELETE_TITLE,
  FormatBulkDeleteDescription,
} from "../settings/entity-table-labels.settings"

/**
 * Props for the bulk delete confirm dialog.
 */
export interface EntityBulkDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  count: number
  onConfirm: () => void
}

/**
 * @summary
 * Renders the confirmation dialog for the bulk delete flow.
 *
 * @remarks
 * Shows the number of selected items and asks for
 * confirmation before the deletion runs.
 *
 * @param props - The dialog state and confirm handler.
 *
 * @returns The confirmation dialog.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
function EntityBulkDeleteDialog({
  open,
  onOpenChange,
  count,
  onConfirm,
}: EntityBulkDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {ENTITY_TABLE_BULK_DELETE_TITLE}
          </DialogTitle>
          <DialogDescription>
            {FormatBulkDeleteDescription(count)}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {ENTITY_TABLE_BULK_DELETE_CANCEL_LABEL}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {ENTITY_TABLE_BULK_DELETE_CONFIRM_LABEL}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { EntityBulkDeleteDialog }
