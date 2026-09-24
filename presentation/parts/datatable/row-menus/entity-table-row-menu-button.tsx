"use client"

import type { ButtonHTMLAttributes } from "react"
import { IconDotsVertical } from "@tabler/icons-react"
import { cn } from "cn"

import { Button } from "@/presentation/ui/button"

/**
 * Props for the entity table row menu button.
 */
export interface EntityTableRowMenuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
}

/**
 * @summary
 * Renders the trigger button of the per-row actions menu.
 *
 * @remarks
 * Advertises the accessible label and spreads the remaining
 * native button props, allowing the dropdown trigger to wire
 * the click and reference.
 *
 * @param props - Native button props plus the accessible label.
 *
 * @returns The compact icon button.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
function EntityTableRowMenuButton({
  label,
  className,
  ...props
}: EntityTableRowMenuButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      className={cn("size-7 p-0", className)}
      {...props}
    >
      <IconDotsVertical />
    </Button>
  )
}

export { EntityTableRowMenuButton }
