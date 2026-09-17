"use client"

import * as React from "react"

import { Button } from "@/presentation/ui/button"
import { MainCommandDialog } from "./command-dialog"

import { IconSearch } from "@tabler/icons-react"

function CommandTrigger() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
    <Button variant="outline" onClick={() => setOpen(true)}>
      <IconSearch />
      Buscar
    </Button>
      <MainCommandDialog open={open} onOpenChange={setOpen} />
    </>
  )
}

export { CommandTrigger }
