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
 * Props for the entity single-action alert dialog.
 */
export interface EntityAlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  /** Label of the single acknowledge button. */
  closeLabel: string
}

/**
 * @summary
 * Renders a read-only alert dialog.
 *
 * @remarks
 * Props-driven dialog kept generic so any route can state an
 * expected failure through its own copy. Unlike the confirm
 * dialogs, it runs no action: a single acknowledge button
 * dismisses it, so it reads as a notice rather than a
 * decision.
 *
 * @explanation
 * Use as the shared notice dialog of the entity dialog kit,
 * such as when an open file would end in an error page.
 *
 * @param props - The dialog state, copy and dismiss label.
 * @param props.open - Controls the dialog visibility.
 * @param props.onOpenChange - Reports the open state.
 * @param props.title - Dialog header title.
 * @param props.description - Notice description.
 * @param props.closeLabel - Acknowledge button label.
 *
 * @returns The alert dialog.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-20
 */
function EntityAlertDialog({
  open,
  onOpenChange,
  title,
  description,
  closeLabel,
}: EntityAlertDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            {closeLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { EntityAlertDialog }
