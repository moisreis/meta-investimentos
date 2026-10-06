"use client"

import { EntityCombobox } from "@/presentation/parts/components/entity-combobox"
import type { EntityComboboxItem } from "@/presentation/parts/components/entity-combobox"

import { BENCHMARK_HISTORY_FORM } from "../settings/labels.settings"

interface BenchmarkHistoryIndexComboboxProps {
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
 * Renders the index picker of the record rate form.
 *
 * @remarks
 * A controlled searchable combobox backed by Base UI. The
 * selected index is synced to the form as a string id. Each
 * option carries the index name as the title and its acronym
 * as the description, so two indices whose names begin alike
 * stay told apart at a glance.
 *
 * The field is required, so it carries no clear affordance:
 * an entry belongs to one index, and there is no empty state
 * to return it to.
 *
 * @explanation
 * Use for the index field of the record rate form. Pass the
 * display options through `items` and read the selection
 * through `onValueChange`.
 *
 * @param props - Props of the index picker.
 * @param props.id - Id of the input.
 * @param props.name - Form name submitted with the value.
 * @param props.value - The selected option's id.
 * @param props.onValueChange - Reports the next selection.
 * @param props.placeholder - Input placeholder.
 * @param props.items - The options offered.
 * @param props.required - Marks the field required.
 * @param props.disabled - Blocks interaction.
 * @param props.ariaInvalid - Marks the field invalid.
 *
 * @returns The index picker.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
function BenchmarkHistoryIndexCombobox({
  id,
  name,
  value,
  onValueChange,
  placeholder,
  items,
  required,
  disabled,
  "aria-invalid": ariaInvalid,
}: BenchmarkHistoryIndexComboboxProps) {
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
      emptyLabel={BENCHMARK_HISTORY_FORM.SEARCH_EMPTY}
      aria-invalid={ariaInvalid}
    />
  )
}

export { BenchmarkHistoryIndexCombobox }
