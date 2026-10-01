"use client"
import { EntityCombobox } from "@/presentation/parts/components/entity-combobox"

import { BANK_ACCOUNT_FORM } from "../settings/labels.settings"
import type { EntityComboboxItem } from "@/presentation/parts/components/entity-combobox"
interface BankAccountRegistryComboboxProps {
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
 * Renders the portfolio and bank pickers of the bank
 * account forms.
 *
 * @remarks
 * A controlled searchable combobox backed by Base UI.
 * The selected option is synced to the form as a
 * string id. Options carry the primary name as the
 * title and an optional secondary text as the
 * description.
 *
 * @explanation
 * Use for the portfolio and bank fields of the bank
 * account forms. Pass the display options through
 * `items` and read the selection through
 * `onValueChange`.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function BankAccountRegistryCombobox({
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
}: BankAccountRegistryComboboxProps) {
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
      emptyLabel={BANK_ACCOUNT_FORM.SEARCH_EMPTY}
      aria-invalid={ariaInvalid}
    />
  )
}

export { BankAccountRegistryCombobox }
