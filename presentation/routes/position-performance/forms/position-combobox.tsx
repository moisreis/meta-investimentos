"use client"
import { EntityCombobox } from "@/presentation/parts/components/entity-combobox"

import { POSITION_PERFORMANCE_CALCULATE } from "../settings/labels.settings"
import type { EntityComboboxItem } from "@/presentation/parts/components/entity-combobox"
interface PositionPerformancePositionComboboxProps {
  id: string
  name: string
  value: string
  onValueChange: (value: string) => void
  placeholder: string
  items: readonly EntityComboboxItem[]
  required?: boolean
  disabled?: boolean
  clearable?: boolean
  "aria-invalid"?: boolean | "true" | "false"
}
/**
 * @summary
 * Renders the position picker of the position performance
 * calculate confirm dialog.
 *
 * @remarks
 * A controlled searchable combobox backed by Base UI.
 * The selected position is synced to the form as a
 * string id. Each option leads with the portfolio acronym
 * and carries the fund name as the description, so the two
 * positions holding the same fund under different
 * portfolios read apart at a glance. The input keeps
 * showing the acronym only, so the selected value stays
 * compact.
 *
 * @explanation
 * Use for the position field of the position performance
 * calculate confirm dialog. Pass the display options through
 * `items` and read the selection through `onValueChange`.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
function PositionPerformancePositionCombobox({
  id,
  name,
  value,
  onValueChange,
  placeholder,
  items,
  required,
  disabled,
  "aria-invalid": ariaInvalid,
  clearable,
}: PositionPerformancePositionComboboxProps) {
  return (
    <EntityCombobox
      id={id}
      name={name}
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder}
      items={items}
      required={required}
      disabled={disabled}
      clearable={clearable}
      emptyLabel={
        POSITION_PERFORMANCE_CALCULATE.ALL_POSITIONS_LABEL
      }
      aria-invalid={ariaInvalid}
    />
  )
}

export { PositionPerformancePositionCombobox }
