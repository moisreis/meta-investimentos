"use client"

import { Checkbox } from "@/presentation/ui/checkbox"

export interface SharedRowSelectHeaderProps {
  checked: boolean
  indeterminate: boolean
  onCheckedChange: (checked: boolean) => void
  label: string
}

/**
 * Renders the select-all checkbox for the shared data-table header.
 */
export function SharedRowSelectHeader({
  checked,
  indeterminate,
  onCheckedChange,
  label,
}: SharedRowSelectHeaderProps) {
  return (
    <Checkbox
      checked={checked}
      indeterminate={indeterminate}
      onCheckedChange={(value) => onCheckedChange(!!value)}
      aria-label={label}
    />
  )
}