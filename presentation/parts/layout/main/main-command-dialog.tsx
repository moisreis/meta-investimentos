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
import { MAIN_COMMANDS } from "./main-command.settings"
import type { MainCommandSetting } from "./main-command.settings"

interface MainCommandDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  // Runs a row's command. The dialog only names it: reaching
  // the route and closing the palette belong to the trigger,
  // so a row and its keyboard shortcut cannot drift apart.
  onCommand: (command: MainCommandSetting) => void
}

// The palette itself. The rows come from the command registry
// rather than from markup here, which is what keeps the
// shortcut a row advertises the shortcut the trigger binds.
function MainCommandDialog({
  open,
  onOpenChange,
  onCommand,
}: MainCommandDialogProps) {
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command>
        <CommandInput placeholder="Use um comando ou procure por carteiras" />
        <CommandList>
          <CommandEmpty>
            Nenhum resultado foi encontrado.
          </CommandEmpty>
          <CommandGroup heading="Comandos principais">
            {MAIN_COMMANDS.map((command) => (
              <CommandItem
                key={command.id}
                onSelect={() => onCommand(command)}
              >
                <span>{command.label}</span>
                <CommandShortcut>
                  {command.shortcutLabel}
                </CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}

export { MainCommandDialog }
