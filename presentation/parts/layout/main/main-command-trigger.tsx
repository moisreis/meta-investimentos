"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/presentation/ui/button"
import { MainCommandDialog } from "./main-command-dialog"
import {
  MAIN_COMMANDS,
  MAIN_COMMAND_PARAM,
} from "./main-command.settings"
import type { MainCommandSetting } from "./main-command.settings"

import { IconSearch } from "@tabler/icons-react"

// Reports whether the keystroke landed on something the user
// types into. The letter shortcuts have native twins inside a
// field — Ctrl+A selects the text, the rest reach the browser —
// so they step aside there and only fire from the page itself.
function IsEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  if (target.isContentEditable) return true

  const TAG = target.tagName
  return (
    TAG === "INPUT" || TAG === "TEXTAREA" || TAG === "SELECT"
  )
}

function MainCommandTrigger() {
  const [open, setOpen] = React.useState(false)
  const ROUTER = useRouter()

  // Runs a command exactly as the palette row does: the route
  // is reached carrying the id, and the screen opens the
  // dialog itself. The palette closes first so it never
  // flashes over the dialog it just asked for.
  const RunCommand = React.useCallback(
    (command: MainCommandSetting) => {
      setOpen(false)
      ROUTER.push(
        `${command.path}?${MAIN_COMMAND_PARAM}=${command.id}`
      )
    },
    [ROUTER]
  )

  React.useEffect(() => {
    function HandleKeyDown(event: KeyboardEvent) {
      if (!(event.ctrlKey || event.metaKey)) return
      if (event.altKey || event.shiftKey) return

      const KEY = event.key.toLowerCase()

      // Ctrl+K opens the palette everywhere, field or not: it
      // is the one shortcut with no native twin to give up.
      if (KEY === "k") {
        event.preventDefault()
        setOpen(true)
        return
      }

      if (IsEditableTarget(event.target)) return

      const COMMAND = MAIN_COMMANDS.find(
        (candidate) => candidate.shortcutKey === KEY
      )
      if (!COMMAND) return

      event.preventDefault()
      RunCommand(COMMAND)
    }

    document.addEventListener("keydown", HandleKeyDown)
    return () =>
      document.removeEventListener("keydown", HandleKeyDown)
  }, [RunCommand])

  return (
    <>
      <Button
        variant="outline"
        className="rounded-full"
        size="xs"
        onClick={() => setOpen(true)}
      >
        <IconSearch />
        Buscar
      </Button>
      <MainCommandDialog
        open={open}
        onOpenChange={setOpen}
        onCommand={RunCommand}
      />
    </>
  )
}

export { MainCommandTrigger }
