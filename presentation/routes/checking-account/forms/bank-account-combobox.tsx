"use client"
import { EntityCombobox } from "@/presentation/parts/components/entity-combobox"

import { CHECKING_ACCOUNT_FORM } from "../settings/labels.settings"
import type { EntityComboboxItem } from "@/presentation/parts/components/entity-combobox"
interface BankAccountComboboxProps {
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
 * Renders the bank account picker of the checking
 * account forms.
 *
 * @remarks
 * A controlled searchable combobox backed by Base UI.
 * The selected option is synced to the form as a
 * string id. Options carry the bank name as the title
 * and the agency and account number as the description.
 *
 * @explanation
 * Use for the bank account field of the checking
 * account forms. Pass the display options through
 * `items` and read the selection through
 * `onValueChange`.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function BankAccountCombobox({
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
}: BankAccountComboboxProps) {
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
      emptyLabel={CHECKING_ACCOUNT_FORM.SEARCH_EMPTY}
      aria-invalid={ariaInvalid}
    />
  )
}

export { BankAccountCombobox }
