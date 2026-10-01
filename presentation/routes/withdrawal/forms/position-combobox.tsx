"use client"

import { EntityCombobox } from "@/presentation/parts/components/entity-combobox"
import type { EntityComboboxItem } from "@/presentation/parts/components/entity-combobox"

interface PositionComboboxProps {
  id: string
  name: string
  value: string
  onValueChange: (value: string) => void
  placeholder: string
  items: readonly EntityComboboxItem[]
  emptyLabel: string
  required?: boolean
  disabled?: boolean
  clearable?: boolean
  "aria-invalid"?: boolean | "true" | "false"
}
/**
 * @summary
 * Renders the position picker of the add withdrawal form.
 *
 * @remarks
 * A controlled searchable combobox backed by Base UI.
 * The selected position is synced to the form as a
 * string id. Each option carries the share held by the
 * position under the fund name.
 *
 * @explanation
 * Use for the position field of the add withdrawal form.
 * Pass the display options through `items` and read the
 * selection through `onValueChange`.
 *
 * @param props - Props of the position combobox.
 * @param props.items - The position options to offer.
 * @param props.emptyLabel - Copy shown when no option
 * matches, defaulting to the generic position copy.
 *
 * @returns The position combobox.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function PositionCombobox({
  id,
  name,
  value,
  onValueChange,
  placeholder,
  items,
  emptyLabel,
  required,
  disabled,
  "aria-invalid": ariaInvalid,
  clearable,
}: PositionComboboxProps) {
  return (
    <EntityCombobox
      id={id}
      name={name}
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder}
      items={items}
      emptyLabel={emptyLabel}
      required={required}
      disabled={disabled}
      clearable={clearable}
      aria-invalid={ariaInvalid}
    />
  )
}

export { PositionCombobox }
