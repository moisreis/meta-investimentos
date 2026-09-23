"use client"

import { Fragment } from "react"
import { IconDotsVertical } from "@tabler/icons-react"

import { Button } from "@/presentation/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/presentation/ui/dropdown-menu"

export interface SharedRowActionsMenuAction {
  key: string
  label: string
  variant?: "default" | "destructive"
  separatorBefore?: boolean
  onSelect?: () => void
}

export interface SharedRowActionsMenuProps {
  label: string
  actions: SharedRowActionsMenuAction[]
}

/**
 * Renders the per-row actions dropdown menu for the shared data-table.
 */
export function SharedRowActionsMenu({
  label,
  actions,
}: SharedRowActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon-sm" className="size-7 p-0" />
        }
      >
        <span className="sr-only">{label}</span>
        <IconDotsVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{label}</DropdownMenuLabel>
        </DropdownMenuGroup>
        {actions.map((action) => (
          <Fragment key={action.key}>
            {action.separatorBefore ? <DropdownMenuSeparator /> : null}
            <DropdownMenuItem
              variant={action.variant}
              onClick={() => action.onSelect?.()}
            >
              {action.label}
            </DropdownMenuItem>
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}