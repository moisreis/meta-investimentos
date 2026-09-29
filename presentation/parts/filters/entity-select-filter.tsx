"use client"

import { cn } from "cn"

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

// Toolbar look of the control: borderless, like the search
// filter beside it, and wide enough for a fund or a
// portfolio name. The popover anchors to this width, so the
// options inherit it.
const TOOLBAR_WIDTH_CLASS = "w-64 border-none"

// Option rendered by the entity select filter.
export interface EntitySelectFilterOption {
  // Value submitted to the filter state.
  value: string
  // Primary text rendered above the description, and the
  // text that fills the input once selected.
  label: string
  // Secondary text rendered under the label, such as a
  // portfolio acronym or a formatted CNPJ. Omitted when the
  // entity has nothing else worth showing.
  description?: string
}

interface EntitySelectFilterProps {
  // The selected option value, or `undefined`.
  value: string | undefined
  // Reports the next option value, or `undefined`.
  onChange: (value: string | undefined) => void
  // Options offered by the filter.
  options: EntitySelectFilterOption[]
  // Input placeholder while nothing is selected.
  placeholder?: string
  // Accessible input label.
  label?: string
  // Copy of the empty list state.
  emptyLabel?: string
  // Overrides the toolbar width of the control.
  className?: string
}

/**
 * @summary
 * Renders an entity-agnostic single-select combobox
 * filter.
 *
 * @remarks
 * Composes the shared combobox primitives into a
 * searchable list. The selected option label fills the
 * input and the clear button appears while a value is
 * selected, resetting the filter to `undefined`. The
 * list narrows as the user types, matching the label and
 * the description, so an option can also be found by its
 * acronym or its CNPJ.
 *
 * Options that carry a `description` render on two lines,
 * mirroring the relation cells of the datatable columns:
 * the portfolio name above its acronym and the fund name
 * above its formatted CNPJ. The input keeps showing the
 * primary line only, so the toolbar control stays compact.
 *
 * The control is borderless and wide enough to hold a fund
 * or a portfolio name, matching the search filter beside it
 * on the datatable toolbar. The input group keeps its focus
 * ring, so the control stays reachable by keyboard even
 * without the border.
 *
 * @param props - The filter contract.
 * @param props.value - The selected option value.
 * @param props.onChange - Reports the next value.
 * @param props.options - The selectable options.
 * @param props.placeholder - Empty input placeholder.
 * @param props.label - Accessible input label.
 * @param props.emptyLabel - Copy of the empty state.
 * @param props.className - Overrides the control width.
 *
 * @returns The select filter.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function EntitySelectFilter({
  value,
  onChange,
  options,
  placeholder = "Selecione",
  label = "Filtrar",
  emptyLabel = "Nenhum resultado",
  className,
}: EntitySelectFilterProps) {
  const SELECTED =
    options.find((option) => option.value === value) ?? null

  return (
    <Combobox
      items={options}
      value={SELECTED}
      onValueChange={(next) =>
        onChange(next ? next.value : undefined)
      }
      itemToStringLabel={(item) => item.label}
      itemToStringValue={(item) => item.value}
      isItemEqualToValue={(item, selected) =>
        item.value === selected.value
      }
      filter={(item, query) => {
        const NORMALIZED = query.trim().toLowerCase()
        if (!NORMALIZED) return true
        const HAYSTACK =
          `${item.label} ${item.description ?? ""}`.toLowerCase()
        return HAYSTACK.includes(NORMALIZED)
      }}
      autoHighlight
    >
      <ComboboxInput
        className={cn(TOOLBAR_WIDTH_CLASS, className)}
        placeholder={placeholder}
        aria-label={label}
        showClear={value !== undefined}
      />
      <ComboboxContent className="w-96">
        <ComboboxEmpty>{emptyLabel}</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.value} value={item}>
              <Item size="xs" className="p-0">
                <ItemContent>
                  <ItemTitle className="whitespace-nowrap">
                    {item.label}
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

export { EntitySelectFilter }
