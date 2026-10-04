"use client"

import { useState } from "react"
import { ptBR } from "date-fns/locale"
import { type DateRange } from "react-day-picker"
import { IconCalendar } from "@tabler/icons-react"
import { type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { Button, buttonVariants } from "@/presentation/ui/button"
import { Calendar } from "@/presentation/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/presentation/ui/popover"
import { FormatDate } from "@/presentation/presenters/date.presenter"

// Where the control is rendered. A datatable toolbar keeps
// the compact borderless button that sits beside the other
// filters; a form field gets a bordered control that reads
// as an input rather than as a toolbar action.
export type EntityDateRangeFilterVariant = "toolbar" | "field"

type ButtonVariant = NonNullable<
  VariantProps<typeof buttonVariants>["variant"]
>

// Trigger look per context. The field variant stretches to
// the width of its container and pins the calendar icon and
// the label to the leading edge, instead of centring them
// the way a toolbar-sized action does.
const TRIGGER_PRESENTATION = {
  toolbar: {
    buttonVariant: "ghost",
    className: "font-normal text-muted-foreground",
  },
  field: {
    buttonVariant: "outline",
    className: "w-full justify-start font-normal",
  },
} as const satisfies Record<
  EntityDateRangeFilterVariant,
  { buttonVariant: ButtonVariant; className: string }
>

export interface EntityDateRangeFilterProps {
  value: DateRange | undefined
  onChange: (range: DateRange | undefined) => void
  isDateDisabled?: (date: Date) => boolean
  placeholder?: string
  numberOfMonths?: number
  // Context the control is rendered in. Defaults to the
  // datatable toolbar look.
  variant?: EntityDateRangeFilterVariant
  // Overrides the trigger classes of the chosen variant.
  className?: string
}

/**
 * @summary
 * Renders an entity-agnostic date range filter.
 *
 * @remarks
 * Composes the shared popover and calendar primitives. The
 * trigger displays the selected range through the pt-BR
 * date presenter, or the placeholder when nothing is
 * selected. Days matched by `isDateDisabled` are disabled
 * in the calendar and the popover closes once a full range
 * is picked.
 *
 * `variant` picks the trigger look, so the same control
 * serves the datatable toolbar and the calculation forms.
 * The `toolbar` variant is a borderless ghost button that
 * shrinks to its label. The `field` variant is bordered,
 * fills the width of its field and left-aligns the icon and
 * the label, which is what a form control has to do.
 *
 * @param props - The filter contract.
 * @param props.value - The selected range.
 * @param props.onChange - Reports the next range.
 * @param props.isDateDisabled - Disables a calendar day.
 * @param props.placeholder - Trigger text when empty.
 * @param props.numberOfMonths - Months shown side by side.
 * @param props.variant - Toolbar or form field look.
 * @param props.className - Overrides the trigger classes.
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
  isDateDisabled,
  placeholder = "Selecione um período",
  numberOfMonths = 2,
  variant = "toolbar",
  className,
}: EntityDateRangeFilterProps) {
  const [OPEN, setOpen] = useState(false)
  const TRIGGER = TRIGGER_PRESENTATION[variant]

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
            variant={TRIGGER.buttonVariant}
            className={cn(TRIGGER.className, className)}
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
            if (next?.to) {
              setOpen(false)
            }
          }}
          numberOfMonths={numberOfMonths}
          disabled={isDateDisabled}
        />
      </PopoverContent>
    </Popover>
  )
}

export { EntityDateRangeFilter }
