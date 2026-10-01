"use client"
import { EntityCombobox } from "@/presentation/parts/components/entity-combobox"

import { APPLICATION_FORM } from "../settings/labels.settings"
import type { EntityComboboxItem } from "@/presentation/parts/components/entity-combobox"
interface ApplicationFundComboboxProps {
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
 * Renders the fund picker of the add application form.
 *
 * @remarks
 * A controlled searchable combobox backed by Base UI.
 * The selected fund is synced to the form as a string
 * id. Each option carries the fund CNPJ under its name.
 *
 * @explanation
 * Use for the fund field of the add application form.
 * Pass the display options through `items` and read the
 * selection through `onValueChange`.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function ApplicationFundCombobox({
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
}: ApplicationFundComboboxProps) {
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
      emptyLabel={APPLICATION_FORM.SEARCH_EMPTY}
      aria-invalid={ariaInvalid}
    />
  )
}

export { ApplicationFundCombobox }
