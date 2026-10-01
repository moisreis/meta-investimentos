"use client"
import { EntityCombobox } from "@/presentation/parts/components/entity-combobox"

import { QUOTA_IMPORT } from "../settings/labels.settings"
import type { EntityComboboxItem } from "@/presentation/parts/components/entity-combobox"
interface QuotaImportWindowComboboxProps {
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
 * Renders the import window picker of the quota confirm
 * import dialog.
 *
 * @remarks
 * A controlled searchable combobox backed by Base UI.
 * The selected window is synced to the form as a
 * string id.
 *
 * @explanation
 * Use for the window field of the quota confirm import
 * dialog. Pass the display options through `items` and
 * read the selection through `onValueChange`.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
function QuotaImportWindowCombobox({
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
}: QuotaImportWindowComboboxProps) {
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
      emptyLabel={QUOTA_IMPORT.FIELD_WINDOW}
      aria-invalid={ariaInvalid}
    />
  )
}

export { QuotaImportWindowCombobox }
