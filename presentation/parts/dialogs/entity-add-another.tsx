"use client"

import { IconArrowLeft, IconPlus } from "@tabler/icons-react"

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
 * Props for the add-another prompt dialog.
 */
export interface EntityAddAnotherDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  backLabel: string
  anotherLabel: string
  onBack: () => void
  onAddAnother: () => void
}

/**
 * @summary
 * Renders the prompt shown after an entity is added.
 *
 * @remarks
 * Asks the user whether to go back to the datatable or
 * add another instance. Routes supply the copy and the
 * handlers through props.
 *
 * @explanation
 * Use as the shared follow-up of the add dialog flow.
 * After a successful add, open this dialog so the user
 * can decide the next step without leaving the table.
 *
 * @param props - Props of the add-another prompt dialog.
 * @param props.open - Controls the dialog visibility.
 * @param props.onOpenChange - Reports the open state.
 * @param props.title - Dialog header title.
 * @param props.description - Prompt description.
 * @param props.backLabel - Back-to-table button label.
 * @param props.anotherLabel - Add-another button label.
 * @param props.onBack - Back-to-table handler.
 * @param props.onAddAnother - Add-another handler.
 *
 * @returns The add-another prompt dialog.
 *
 * @example
 * <EntityAddAnotherDialog open={open}
 *   onOpenChange={setOpen} title="Adicionar outra?"
 *   description="A carteira foi criada com sucesso."
 *   backLabel="Voltar para a tabela"
 *   anotherLabel="Adicionar outra"
 *   onBack={handleBack}
 *   onAddAnother={handleAddAnother} />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function EntityAddAnotherDialog({
  open,
  onOpenChange,
  title,
  description,
  backLabel,
  anotherLabel,
  onBack,
  onAddAnother,
}: EntityAddAnotherDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onBack}>
            <IconArrowLeft />
            {backLabel}
          </Button>
          <Button onClick={onAddAnother}>
            <IconPlus />
            {anotherLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { EntityAddAnotherDialog }
