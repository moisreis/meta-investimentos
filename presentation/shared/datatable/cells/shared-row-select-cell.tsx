"use client"

import { Checkbox } from "@/presentation/ui/checkbox"

export interface SharedRowSelectCellProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label: string
}

/**
 * Renders the row-selection checkbox for a single shared data-table row.
 */
export function SharedRowSelectCell({
  checked,
  onCheckedChange,
  label,
}: SharedRowSelectCellProps) {
  return (
    <Checkbox
      checked={checked}
      onCheckedChange={(value) => onCheckedChange(!!value)}
      aria-label={label}
    />
  )
}