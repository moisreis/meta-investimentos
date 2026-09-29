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

import { POSITION_PERFORMANCE_CALCULATE } from "../settings/labels.settings"

// Option rendered by the position performance position combobox.
export interface PositionPerformancePositionComboboxItem {
  // Id submitted to the form.
  id: string
  // Primary text rendered in the list and the input.
  name: string
  // Secondary text rendered under the name, which is the
  // fund the position holds.
  description?: string
}

interface PositionPerformancePositionComboboxProps {
  id: string
  name: string
  value: string
  onValueChange: (value: string) => void
  placeholder: string
  items: PositionPerformancePositionComboboxItem[]
  required?: boolean
  disabled?: boolean
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
  required = false,
  disabled = false,
  "aria-invalid": ariaInvalid,
}: PositionPerformancePositionComboboxProps) {
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
          {POSITION_PERFORMANCE_CALCULATE.ALL_POSITIONS_LABEL}
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

export { PositionPerformancePositionCombobox }