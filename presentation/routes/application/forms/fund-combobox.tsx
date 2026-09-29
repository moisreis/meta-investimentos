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
  ItemDescription,
  ItemTitle,
} from "@/presentation/ui/item"

import { APPLICATION_FORM } from "../settings/labels.settings"

// Option rendered by the application fund combobox.
export interface ApplicationFundComboboxItem {
  // Id submitted to the form.
  id: string
  // Primary text rendered in the list and the input.
  name: string
  // Secondary text rendered under the name.
  description?: string
}

interface ApplicationFundComboboxProps {
  id: string
  name: string
  value: string
  onValueChange: (value: string) => void
  placeholder: string
  items: ApplicationFundComboboxItem[]
  required?: boolean
  disabled?: boolean
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
  required = false,
  disabled = false,
  "aria-invalid": ariaInvalid,
}: ApplicationFundComboboxProps) {
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
        const HAYSTACK =
          `${item.name} ${item.description ?? ""}`.toLowerCase()
        return HAYSTACK.includes(NORMALIZED)
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
        <ComboboxEmpty>
          {APPLICATION_FORM.SEARCH_EMPTY}
        </ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.id} value={item}>
              <Item size="xs" className="p-0">
                <ItemContent>
                  <ItemTitle className="whitespace-nowrap">
                    {item.name}
                  </ItemTitle>
                  {item.description ? (
                    <ItemDescription className="whitespace-nowrap">
                      {item.description}
                    </ItemDescription>
                  ) : null}
                </ItemContent>
              </Item>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

export { ApplicationFundCombobox }
