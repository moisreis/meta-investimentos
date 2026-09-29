"use client"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/presentation/ui/combobox"
import {
  Item,
  ItemContent,
  ItemTitle,
} from "@/presentation/ui/item"

import { QUOTA_IMPORT } from "../settings/labels.settings"

// Option rendered by the quota import window combobox.
export interface QuotaImportWindowComboboxItem {
  // Id submitted to the form.
  id: string
  // Primary text rendered in the list and the input.
  name: string
}

interface QuotaImportWindowComboboxProps {
  id: string
  name: string
  value: string
  onValueChange: (value: string) => void
  placeholder: string
  items: QuotaImportWindowComboboxItem[]
  required?: boolean
  disabled?: boolean
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
  required = false,
  disabled = false,
  "aria-invalid": ariaInvalid,
}: QuotaImportWindowComboboxProps) {
  const SELECTED =
    items.find((item) => item.id === value) ?? null

  return (
    <Combobox
      items={items}
      value={SELECTED}
      onValueChange={(next) =>
        onValueChange(next ? next.id : "")
      }
      itemToStringLabel={(item) => item.name}
      itemToStringValue={(item) => item.id}
      isItemEqualToValue={(item, selected) =>
        item.id === selected.id
      }
      filter={(item, query) => {
        const NORMALIZED = query.trim().toLowerCase()
        if (!NORMALIZED) return true
        return item.name.toLowerCase().includes(NORMALIZED)
      }}
      autoHighlight
    >
      <ComboboxInput
        id={id}
        name={name}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-invalid={ariaInvalid}
      />
      <ComboboxContent>
        <ComboboxEmpty>{QUOTA_IMPORT.FIELD_WINDOW}</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.id} value={item}>
              <Item size="xs" className="p-0">
                <ItemContent>
                  <ItemTitle className="whitespace-nowrap">
                    {item.name}
                  </ItemTitle>
                </ItemContent>
              </Item>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

export { QuotaImportWindowCombobox }