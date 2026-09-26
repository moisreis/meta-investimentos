"use client"

import { useState } from "react"
import { ptBR } from "date-fns/locale"
import { IconCalendar } from "@tabler/icons-react"

import { Button } from "@/presentation/ui/button"
import { Calendar } from "@/presentation/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/presentation/ui/popover"
import { FormatDate } from "@/presentation/presenters/date.presenter"

export interface EntityDateInputProps {
  id: string
  name: string
  value: string
  onValueChange?: (value: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  "aria-invalid"?: boolean | "true" | "false"
}

// Parses a yyyy-MM-dd or ISO string into a local date.
// Date-only strings build a local-midnight date so the
// calendar and the presenter never shift the day.
function ParseDateValue(value: string): Date | undefined {
  if (!value) return undefined

  const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/
  const MATCH = value.match(DATE_ONLY)

  if (MATCH) {
    return new Date(
      Number(MATCH[1]),
      Number(MATCH[2]) - 1,
      Number(MATCH[3])
    )
  }

  const DATE = new Date(value)
  return Number.isNaN(DATE.getTime()) ? undefined : DATE
}

// Serializes a local date as a yyyy-MM-dd string.
function ToLocalDateString(date: Date): string {
  const YEAR = date.getFullYear()
  const MONTH = String(date.getMonth() + 1).padStart(2, "0")
  const DAY = String(date.getDate()).padStart(2, "0")
  return `${YEAR}-${MONTH}-${DAY}`
}

/**
 * @summary
 * Renders the shared calendar-backed date picker.
 *
 * @remarks
 * Composes the shared popover and calendar primitives. The
 * trigger displays the selected date through the pt-BR
 * date presenter, or a placeholder when nothing is
 * selected. Picking a day reports the value as a
 * `yyyy-MM-dd` string and closes the popover. When
 * `disabled`, renders only the read-only trigger.
 *
 * @explanation
 * Use for the date field of any form. The string
 * contract is a calendar day, so the same shape flows
 * into the `Zod` validations and into the repository
 * lookups keyed by day.
 *
 * @param props - Props of the date input.
 * @param props.id - Id linked to the field label.
 * @param props.name - Name of the field.
 * @param props.value - The selected `yyyy-MM-dd` value.
 * @param props.onValueChange - Reports the next day.
 * @param props.placeholder - Copy while nothing is set.
 * @param props.required - Marks the field as required.
 * @param props.disabled - Blocks the interaction.
 * @param props.aria-invalid - Marks the field as invalid.
 *
 * @returns The date picker.
 *
 * @example
 * <EntityDateInput id="date" name="date" value={date}
 *   onValueChange={setDate} />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function EntityDateInput({
  id,
  name,
  value,
  onValueChange,
  placeholder = "Selecione a data",
  required = false,
  disabled = false,
  "aria-invalid": ariaInvalid,
}: EntityDateInputProps) {
  const [OPEN, setOpen] = useState(false)

  const SELECTED = ParseDateValue(value)
  const TRIGGER_LABEL = SELECTED
    ? FormatDate(SELECTED)
    : placeholder

  return (
    <Popover open={OPEN} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            name={name}
            type="button"
            variant="outline"
            data-placeholder={SELECTED ? undefined : true}
            className="w-full justify-start gap-2 font-normal data-[placeholder=true]:text-muted-foreground"
            disabled={disabled}
            aria-invalid={ariaInvalid}
          >
            <IconCalendar
              className="text-muted-foreground"
              aria-hidden="true"
            />
            <span className="truncate">{TRIGGER_LABEL}</span>
          </Button>
        }
      />
      <PopoverContent align="start" className="w-auto p-1">
        <Calendar
          mode="single"
          locale={ptBR}
          defaultMonth={SELECTED}
          selected={SELECTED}
          onSelect={(next) => {
            if (!next) return
            onValueChange?.(ToLocalDateString(next))
            setOpen(false)
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}

export { EntityDateInput }
