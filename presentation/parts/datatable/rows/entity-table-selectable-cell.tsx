"use client"

import { Checkbox } from "@/presentation/ui/checkbox"

/**
 * Props for the row-selection checkbox cell.
 */
export interface EntityTableSelectableCellProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label: string
}

/**
 * @summary
 * Renders the selection checkbox for a single table row.
 *
 * @remarks
 * Presentational only: the checked state and the change
 * callback come from the selection column definition.
 *
 * @param props - The checked state, callback and label.
 *
 * @returns The row checkbox element.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
function EntityTableSelectableCell({
  checked,
  onCheckedChange,
  label,
}: EntityTableSelectableCellProps) {
  return (
    <Checkbox
      checked={checked}
      onCheckedChange={(value) => onCheckedChange(!!value)}
      aria-label={label}
      className="mx-auto"
    />
  )
}

export { EntityTableSelectableCell }
