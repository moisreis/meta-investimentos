"use client"

import * as React from "react"
import { ptBR } from "date-fns/locale"
import { IconCalendar } from "@tabler/icons-react"

import { Button } from "@/presentation/ui/button"
import { Calendar } from "@/presentation/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/presentation/ui/popover"
import { STATEMENT_DIALOG } from "@/presentation/routes/statement/settings/labels.settings"

interface StatementMonthPickerProps {
  id: string
  name: string
  value: string
  onValueChange?: (value: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  "aria-invalid"?: boolean | "true" | "false"
}

// Parses a YYYY-MM string into a local date (first day of month).
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
 * Reduces a picked day to the `YYYY-MM` key of its month.
 *
 * @remarks
 * The statement is a monthly report, so the day the user
 * clicks carries no meaning of its own: only the month it
 * belongs to is kept. Reading the local calendar fields
 * avoids the time-zone shift an `toISOString` slice would
 * introduce.
 *
 * @param date - The day picked in the calendar.
 *
 * @returns The `YYYY-MM` key of the picked day.
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
 * Renders the reference date picker of the statement
 * generate form.
 *
 * @remarks
 * Composes the shared popover and calendar primitives. The
 * calendar is a plain day grid: the month and year caption
 * is a label navigated with the previous and next buttons,
 * never a pair of dropdowns, so the user picks a day the
 * same way they do on the application and withdrawal forms.
 *
 * The day is a means of choosing the report period, not a
 * value of its own. Picking any day reports the `YYYY-MM`
 * key of the month that day belongs to, and the trigger
 * shows that month, so the label always matches the period
 * the report is generated for. The first day of the month
 * carries the selected state for the same reason.
 *
 * The string contract stays `YYYY-MM`, so the form schema,
 * the generate action and the `BuildStatementPeriod` helper
 * are untouched.
 *
 * @explanation
 * Use for the reference date field of the statement
 * generate form.
 *
 * @param props - Props of the reference date picker.
 * @param props.value - The selected `YYYY-MM` key.
 * @param props.onValueChange - Reports the next key.
 *
 * @returns The reference date picker.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
function StatementMonthPicker({
  id,
  name,
  value,
  onValueChange,
  placeholder = STATEMENT_DIALOG.FIELD_MONTH_PLACEHOLDER,
  required = false,
  disabled = false,
  "aria-invalid": ariaInvalid,
}: StatementMonthPickerProps) {
  const [OPEN, setOpen] = React.useState(false)

  const SELECTED = ParseMonthValue(value)
  const TRIGGER_LABEL = SELECTED
    ? new Intl.DateTimeFormat("pt-BR", {
        month: "long",
        year: "numeric",
      })
        .format(SELECTED)
        .replace(/^./, (char) => char.toUpperCase())
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
          aria-label={STATEMENT_DIALOG.FIELD_MONTH_GRID_LABEL}
        />
      </PopoverContent>
    </Popover>
  )
}

export { StatementMonthPicker }
