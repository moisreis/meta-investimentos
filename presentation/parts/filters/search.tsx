"use client"

import { IconSearch } from "@tabler/icons-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/presentation/ui/input-group"

export interface EntitySearchFilterProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
}

/**
 * @summary
 * Renders an entity-agnostic text search filter.
 *
 * @remarks
 * Composes the shared input group with a leading search
 * icon. The leading addon focuses the input when clicked
 * and the input reports every change up to the caller.
 *
 * @param props - The filter contract.
 * @param props.value - The current query.
 * @param props.onChange - Reports the next query.
 * @param props.placeholder - Input placeholder text.
 * @param props.label - Accessible input label.
 *
 * @returns The search filter.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function EntitySearchFilter({
  value,
  onChange,
  placeholder = "Buscar",
  label = "Buscar",
}: EntitySearchFilterProps) {
  return (
    <InputGroup className="w-52">
      <InputGroupAddon align="inline-start">
        <InputGroupText aria-hidden="true">
          <IconSearch />
        </InputGroupText>
      </InputGroupAddon>
      <InputGroupInput
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={label}
      />
    </InputGroup>
  )
}

export { EntitySearchFilter }
