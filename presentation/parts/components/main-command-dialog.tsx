"use client"

import * as React from "react"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/presentation/ui/command"

interface MainCommandDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MainCommandDialog({ open, onOpenChange }: MainCommandDialogProps) {
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command>
        <CommandInput placeholder="Use um comando ou procure por carteiras" />
        <CommandList>
          <CommandEmpty>Nenhum resultado foi encontrado.</CommandEmpty>
          <CommandGroup heading="Comandos principais">
            <CommandItem>
              <span>Registrar aplicação</span>
              <CommandShortcut>Ctrl + A</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <span>Registrar resgate</span>
              <CommandShortcut>Ctrl + R</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <span>Gerar relatório</span>
              <CommandShortcut>Ctrl + S</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <span>Recalcular performance</span>
              <CommandShortcut>Ctrl + P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <span>Importar cotas</span>
              <CommandShortcut>Ctrl + Q</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
