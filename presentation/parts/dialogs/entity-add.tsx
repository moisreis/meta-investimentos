"use client"

import * as React from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/presentation/ui/dialog"

/**
 * Props for the entity add dialog.
 */
export interface EntityAddDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
}

/**
 * @summary
 * Renders the dialog that hosts an entity add form.
 *
 * @remarks
 * Props-driven wrapper around the dialog UI primitives.
 * Shows the given title, an optional description and the
 * form passed as children. Stays generic so every route
 * can compose its own add form inside it.
 *
 * @explanation
 * Use as the shared add dialog of the entity dialog kit.
 * It keeps the dialog shell reusable while the route
 * supplies the copy and the form instance.
 *
 * @param props - Props of the entity add dialog.
 * @param props.open - Controls the dialog visibility.
 * @param props.onOpenChange - Reports the open state.
 * @param props.title - Dialog header title.
 * @param props.description - Optional dialog description.
 * @param props.children - The entity add form.
 *
 * @returns The add dialog with the given form.
 *
 * @example
 * <EntityAddDialog open={open} onOpenChange={setOpen}
 *   title="Nova carteira">
 *   <AddPortfolioForm />
 * </EntityAddDialog>
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function EntityAddDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
}: EntityAddDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}

export { EntityAddDialog }
