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
 * The icon states its own size rather than inheriting the
 * one `InputGroupText` would give it. The group is as tall
 * as a default button, and a default button draws its icon
 * at `size-3.5`; the inherited `size-4` would put a 16px
 * glyph next to the 14px glyphs of the toolbar actions and
 * leave one row carrying two icon scales. Naming the size
 * also opts the icon out of the group rule, which is written
 * to stand aside whenever an icon states a size of its own.
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
    <InputGroup className="w-52 border-none">
      <InputGroupAddon align="inline-start">
        <InputGroupText aria-hidden="true">
          <IconSearch className="size-3.5" />
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
