"use client"

import * as React from "react"

import { Button } from "@/presentation/ui/button"
import { MainCommandDialog } from "./main-command-dialog"

import { IconSearch } from "@tabler/icons-react"

function MainCommandTrigger() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
    <Button variant="outline" className="rounded-full" size="xs" onClick={() => setOpen(true)}>
      <IconSearch />
      Buscar
    </Button>
      <MainCommandDialog open={open} onOpenChange={setOpen} />
    </>
  )
}

export { MainCommandTrigger }
