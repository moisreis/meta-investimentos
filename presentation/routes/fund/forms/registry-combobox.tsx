"use client"
import { EntityCombobox } from "@/presentation/parts/components/entity-combobox"

import { FUND_FORM } from "../settings/labels.settings"
import type { EntityComboboxItem } from "@/presentation/parts/components/entity-combobox"
interface FundRegistryComboboxProps {
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
 * Renders the registry pickers of the fund forms.
 *
 * @remarks
 * A controlled searchable combobox backed by Base UI.
 * The selected option is synced to the form as a
 * string id. Options may carry an optional description
 * rendered under the name, such as the bank code.
 *
 * @explanation
 * Use for the bank, benchmark and category fields of
 * the fund forms. Pass the display options through
 * `items` and read the selection through `onValueChange`.
 * Set `clearable` on optional fields so the user can
 * remove the current choice back to an empty value.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function FundRegistryCombobox({
  id,
  name,
  value,
  onValueChange,
  placeholder,
  items,
  required,
  disabled,
  clearable,
  "aria-invalid": ariaInvalid,
}: FundRegistryComboboxProps) {
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
      emptyLabel={FUND_FORM.SEARCH_EMPTY}
      aria-invalid={ariaInvalid}
    />
  )
}

export { FundRegistryCombobox }
