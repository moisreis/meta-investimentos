"use client"

import { useState } from "react"
import { ptBR } from "date-fns/locale"
import { IconCalendar, IconLoader2 } from "@tabler/icons-react"

import { FromDayKey, ToDayKey } from "@/lib/date/day-key"
import { Button } from "@/presentation/ui/button"
import { Calendar } from "@/presentation/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/presentation/ui/popover"
import { FormatDate } from "@/presentation/presenters/date.presenter"

/**
 * Props for the shared calendar-backed date picker.
 */
export interface EntityDateInputProps {
  id: string
  name: string
  value: string
  onValueChange?: (value: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  "aria-invalid"?: boolean | "true" | "false"
  /** Blocks a day in the grid. */
  isDateDisabled?: (date: Date) => boolean
  /** Shows the loading mark on the trigger. */
  pending?: boolean
  /** Accessible label of the day grid. */
  gridLabel?: string
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
 * A calendar day is not always pickable, so `isDateDisabled`
 * lets the owner of the field decide which ones are. While
 * `pending` is set the trigger shows a loading mark, which is
 * the honest answer while the days are still being resolved.
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
 * @param props.isDateDisabled - Blocks a day in the grid.
 * @param props.pending - Shows the loading mark.
 * @param props.gridLabel - Accessible label of the grid.
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
  isDateDisabled,
  pending = false,
  gridLabel,
}: EntityDateInputProps) {
  const [OPEN, setOpen] = useState(false)

  const SELECTED = FromDayKey(value)
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
            aria-required={required}
          >
            {pending ? (
              <IconLoader2
                className="animate-spin text-muted-foreground"
                aria-hidden="true"
              />
            ) : (
              <IconCalendar
                className="text-muted-foreground"
                aria-hidden="true"
              />
            )}
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
          disabled={isDateDisabled}
          onSelect={(next) => {
            if (!next) return
            onValueChange?.(ToDayKey(next))
            setOpen(false)
          }}
          autoFocus
          aria-label={gridLabel}
        />
      </PopoverContent>
    </Popover>
  )
}

export { EntityDateInput }
