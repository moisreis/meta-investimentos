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

export interface SharedAddAnotherProps {
  open: boolean
  onOpenChange?: (open: boolean) => void
  onAddAnother: () => void
  onBackToTable: () => void
  itemLabel?: string
}

/**
 * @summary
 * Prompts the user to add another item or go back to the table.
 *
 * @remarks
 * Rendered after a successful add. Offers two choices:
 * add another item, reopening the add flow, or go back to the
 * table. Domain agnostic.
 *
 * @param props - Component configuration props.
 * @param props.open - Whether the dialog is open.
 * @param props.onOpenChange - Called when the open state changes.
 * @param props.onAddAnother - Called when adding another item.
 * @param props.onBackToTable - Called when going back to the table.
 * @param props.itemLabel - Item label used in the description.
 *
 * @returns The add-another dialog.
 *
 * @example
 * <SharedAddAnother
 *   open={open}
 *   onAddAnother={handleAddAnother}
 *   onBackToTable={handleBackToTable}
 * />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
function SharedAddAnother({
  open,
  onOpenChange,
  onAddAnother,
  onBackToTable,
  itemLabel = "item",
}: SharedAddAnotherProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Item adicionado com sucesso</DialogTitle>
          <DialogDescription>
            Deseja adicionar outro {itemLabel} ou voltar para a tabela?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onBackToTable}>
            Voltar para a tabela
          </Button>
          <Button onClick={onAddAnother}>Adicionar outro</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { SharedAddAnother }