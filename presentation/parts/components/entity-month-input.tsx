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
import { FormatMonth } from "@/presentation/presenters/date.presenter"

/**
 * Props for the month picker.
 */
export interface EntityMonthInputProps {
  // Id linked to the field label.
  id: string

  // Name of the field.
  name: string

  // The selected `yyyy-MM` key.
  value: string

  // Reports the next `yyyy-MM` key.
  onValueChange?: (value: string) => void

  // Copy while nothing is set.
  placeholder: string

  // Marks the field as required.
  required?: boolean

  // Blocks the interaction.
  disabled?: boolean

  // Marks the field as invalid.
  "aria-invalid"?: boolean | "true" | "false"

  // Accessible label of the day grid.
  gridLabel: string
}

// Parses a `yyyy-MM` month into the local date of its first
// day.
function ParseMonthValue(value: string): Date | undefined {
  if (!value) return undefined

  const MATCH = value.match(/^(\d{4})-(\d{2})$/)
  if (!MATCH) return undefined

  const YEAR = Number(MATCH[1])
  const MONTH = Number(MATCH[2]) - 1

  if (MONTH < 0 || MONTH > 11) return undefined

  return new Date(YEAR, MONTH, 1)
}

/**
 * @summary
 * Reduces a picked day to the `yyyy-MM` key of its month.
 *
 * @remarks
 * The value is a whole month, so the day the user clicks
 * carries no meaning of its own: only the month it belongs to
 * is kept. Reading the local calendar fields avoids the
 * time-zone shift an `toISOString` slice would introduce.
 *
 * @param date - The day picked in the calendar.
 *
 * @returns The `yyyy-MM` key of the picked day.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
function ToMonthKey(date: Date): string {
  const YEAR = date.getFullYear()
  const MONTH = String(date.getMonth() + 1).padStart(2, "0")
  return `${YEAR}-${MONTH}`
}

/**
 * @summary
 * Renders a picker whose value is a whole month.
 *
 * @remarks
 * Composes the shared popover and calendar primitives. The
 * calendar is a plain day grid: the month and year caption
 * is a label navigated with the previous and next buttons,
 * never a pair of dropdowns, so the user picks a day the
 * same way they do on the application and withdrawal forms.
 *
 * The day is a means of choosing the period, not a value of
 * its own. Picking any day reports the `yyyy-MM` key of the
 * month that day belongs to, and the trigger shows that month,
 * so the label always matches the period that was chosen. The
 * first day of the month carries the selected state for the
 * same reason.
 *
 * The string contract stays `yyyy-MM`, so a form schema, a
 * generate action and a period helper that read a month key
 * are untouched by picking this control.
 *
 * @explanation
 * Use for a field whose value is a reporting period rather
 * than a day, such as the reference month of a statement. The
 * copy is passed in rather than read from a settings file, so
 * a part stays independent of the route that uses it.
 *
 * @param props - Props of the month input.
 * @param props.id - Id linked to the field label.
 * @param props.name - Name of the field.
 * @param props.value - The selected `yyyy-MM` key.
 * @param props.onValueChange - Reports the next key.
 * @param props.placeholder - Copy while nothing is set.
 * @param props.required - Marks the field as required.
 * @param props.disabled - Blocks the interaction.
 * @param props.aria-invalid - Marks the field as invalid.
 * @param props.gridLabel - Accessible label of the grid.
 *
 * @returns The month picker.
 *
 * @example
 * <EntityMonthInput
 *   id="month"
 *   name="month"
 *   value={month}
 *   onValueChange={updateMonth}
 *   placeholder={STATEMENT_DIALOG.FIELD_MONTH_PLACEHOLDER}
 *   gridLabel={STATEMENT_DIALOG.FIELD_MONTH_GRID_LABEL}
 * />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
function EntityMonthInput({
  id,
  name,
  value,
  onValueChange,
  placeholder,
  required = false,
  disabled = false,
  "aria-invalid": ariaInvalid,
  gridLabel,
}: EntityMonthInputProps) {
  const [OPEN, setOpen] = useState(false)

  const SELECTED = ParseMonthValue(value)
  const TRIGGER_LABEL = SELECTED
    ? FormatMonth(SELECTED)
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
          numberOfMonths={1}
          showOutsideDays={false}
          onSelect={(next) => {
            if (!next) return
            onValueChange?.(ToMonthKey(next))
            setOpen(false)
          }}
          autoFocus
          aria-label={gridLabel}
        />
      </PopoverContent>
    </Popover>
  )
}

export { EntityMonthInput }
