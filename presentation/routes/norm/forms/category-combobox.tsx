"use client"

import { EntityCombobox } from "@/presentation/parts/components/entity-combobox"
import type { EntityComboboxItem } from "@/presentation/parts/components/entity-combobox"

import { NORM_FORM } from "../settings/labels.settings"

interface NormCategoryComboboxProps {
  id: string
  name: string
  value: string
  onValueChange: (value: string) => void
  placeholder: string
  items: readonly EntityComboboxItem[]
  required?: boolean
  disabled?: boolean
  "aria-invalid"?: boolean | "true" | "false"
}

/**
 * @summary
 * Renders the category picker of the norm forms.
 *
 * @remarks
 * A controlled searchable combobox backed by Base UI.
 * The selected option is synced to the form as a
 * string id. The options are the registered categories
 * resolved by the route loader.
 *
 * @explanation
 * Use for the category field of the norm add and edit
 * forms. Pass the display options through `items` and
 * read the selection through `onValueChange`.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function NormCategoryCombobox({
  id,
  name,
  value,
  onValueChange,
  placeholder,
  items,
  required,
  disabled,
  "aria-invalid": ariaInvalid,
}: NormCategoryComboboxProps) {
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
      emptyLabel={NORM_FORM.SEARCH_EMPTY}
      aria-invalid={ariaInvalid}
    />
  )
}

export { NormCategoryCombobox }
