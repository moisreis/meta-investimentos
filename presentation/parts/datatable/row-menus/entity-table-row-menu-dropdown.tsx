"use client"

import { Fragment } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/presentation/ui/dropdown-menu"

import { EntityTableRowMenuButton } from "./entity-table-row-menu-button"

/**
 * A single action of the entity table row menu.
 */
export interface EntityTableRowMenuAction {
  key: string
  label: string
  variant?: "default" | "destructive"
  separatorBefore?: boolean
  onSelect?: () => void
}

/**
 * Props for the entity table row actions menu.
 */
export interface EntityTableRowMenuDropdownProps {
  label: string
  actions: EntityTableRowMenuAction[]
}

/**
 * @summary
 * Renders the per-row actions dropdown menu.
 *
 * @remarks
 * Composes the trigger button with a labeled list of actions,
 * supporting destructive styling and separators.
 *
 * @param props - The menu label and the action list.
 *
 * @returns The row actions dropdown.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
function EntityTableRowMenuDropdown({
  label,
  actions,
}: EntityTableRowMenuDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<EntityTableRowMenuButton label={label} />}
      />
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{label}</DropdownMenuLabel>
        </DropdownMenuGroup>
        {actions.map((action) => (
          <Fragment key={action.key}>
            {action.separatorBefore ? (
              <DropdownMenuSeparator />
            ) : null}
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

export { EntityTableRowMenuDropdown }
