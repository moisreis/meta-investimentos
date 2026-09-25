"use client"

import { useState } from "react"
import { ptBR } from "date-fns/locale"
import { type DateRange } from "react-day-picker"
import { IconCalendar } from "@tabler/icons-react"

import { Button } from "@/presentation/ui/button"
import { Calendar } from "@/presentation/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/presentation/ui/popover"
import { FormatDate } from "@/presentation/presenters/date.presenter"

export interface EntityDateRangeFilterProps {
  value: DateRange | undefined
  onChange: (range: DateRange | undefined) => void
  disabledDates?: Date[]
  placeholder?: string
  numberOfMonths?: number
}

/**
 * @summary
 * Renders an entity-agnostic date range filter.
 *
 * @remarks
 * Composes the shared popover and calendar primitives. The
 * trigger displays the selected range through the pt-BR
 * date presenter, or the placeholder when nothing is
 * selected. Days passed in `disabledDates` are disabled in
 * the calendar and the popover closes once a full range
 * is picked.
 *
 * @param props - The filter contract.
 * @param props.value - The selected range.
 * @param props.onChange - Reports the next range.
 * @param props.disabledDates - Days without registries.
 * @param props.placeholder - Trigger text when empty.
 * @param props.numberOfMonths - Months shown side by side.
 *
 * @returns The date range filter.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function EntityDateRangeFilter({
  value,
  onChange,
  disabledDates,
  placeholder = "Selecione um período",
  numberOfMonths = 2,
}: EntityDateRangeFilterProps) {
  const [OPEN, setOpen] = useState(false)

  const TRIGGER_LABEL =
    value?.from && value?.to
      ? `${FormatDate(value.from)} – ${FormatDate(value.to)}`
      : placeholder

  return (
    <Popover open={OPEN} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="h-8 gap-1.5 px-2.5 font-normal text-muted-foreground"
          >
            <IconCalendar aria-hidden="true" />
            <span>{TRIGGER_LABEL}</span>
          </Button>
        }
      />
      <PopoverContent align="start" className="w-auto p-1">
        <Calendar
          mode="range"
          locale={ptBR}
          defaultMonth={value?.from}
          selected={value}
          onSelect={(next) => {
            onChange(next)
            if (next?.from && next.to) setOpen(false)
          }}
          numberOfMonths={numberOfMonths}
          disabled={disabledDates}
        />
      </PopoverContent>
    </Popover>
  )
}

export { EntityDateRangeFilter }
