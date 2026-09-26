"use client"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/presentation/ui/combobox"

// Option rendered by the entity select filter.
export interface EntitySelectFilterOption {
  // Value submitted to the filter state.
  value: string
  // Text rendered in the list and the input.
  label: string
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
 * list narrows as the user types.
 *
 * @param props - The filter contract.
 * @param props.value - The selected option value.
 * @param props.onChange - Reports the next value.
 * @param props.options - The selectable options.
 * @param props.placeholder - Empty input placeholder.
 * @param props.label - Accessible input label.
 * @param props.emptyLabel - Copy of the empty state.
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
        return item.label.toLowerCase().includes(NORMALIZED)
      }}
      autoHighlight
    >
      <ComboboxInput
        placeholder={placeholder}
        aria-label={label}
        showClear={value !== undefined}
      />
      <ComboboxContent>
        <ComboboxEmpty>{emptyLabel}</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

export { EntitySelectFilter }
