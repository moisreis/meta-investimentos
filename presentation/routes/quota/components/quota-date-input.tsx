"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { ptBR } from "date-fns/locale"
import { IconCalendar, IconLoader2 } from "@tabler/icons-react"

import { FormatDate } from "@/presentation/presenters/date.presenter"
import { getQuotaDatesAction } from "@/presentation/routes/quota/actions/get-quota-dates.action"
import { QUOTA_DATE_INPUT } from "@/presentation/routes/quota/settings/labels.settings"
import { Button } from "@/presentation/ui/button"
import { Calendar } from "@/presentation/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/presentation/ui/popover"

/**
 * Props for the quota-aware date picker.
 */
export interface QuotaDateInputProps {
  id: string
  name: string
  value: string
  onValueChange?: (value: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  "aria-invalid"?: boolean | "true" | "false"
  // Fund whose quota dates gate the calendar. Pass `undefined`
  // while no fund is selected: the calendar then leaves every
  // day selectable instead of guessing.
  fundId: string | undefined
}

/**
 * @summary
 * Parses a `yyyy-MM-dd` or ISO string into a local date.
 *
 * @remarks
 * Date-only strings build a local-midnight date so the
 * calendar and the presenter never shift the day.
 *
 * @param value - The raw form value.
 *
 * @returns The parsed local date, or `undefined` when the
 * value is empty or unparseable.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
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

/**
 * @summary
 * Serializes a local date as a `yyyy-MM-dd` string.
 *
 * @remarks
 * Uses the local calendar fields, matching the day keys the
 * quota action returns, so the two never drift by a day.
 *
 * @param date - The local date.
 *
 * @returns The `yyyy-MM-dd` day key.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
function ToLocalDateString(date: Date): string {
  const YEAR = date.getFullYear()
  const MONTH = String(date.getMonth() + 1).padStart(2, "0")
  const DAY = String(date.getDate()).padStart(2, "0")
  return `${YEAR}-${MONTH}-${DAY}`
}

/**
 * @summary
 * Renders the quota-aware calendar-backed date picker.
 *
 * @remarks
 * Composes the shared popover and calendar primitives. The
 * trigger shows the selected date through the pt-BR date
 * presenter, or a placeholder when nothing is selected.
 * Picking a day reports the value as a `yyyy-MM-dd` string
 * and closes the popover.
 *
 * The fund passed through `fundId` owns the gate: the quota
 * dates of that fund are fetched, and every day without a
 * quota entry is **disabled** in the calendar. Until those
 * dates resolve the whole grid is disabled, so the user can
 * never commit a day the fund has no price for. Changing the
 * fund clears a date that is no longer available for it.
 *
 * @explanation
 * Use for the date field of the application and withdrawal
 * forms, where the date must have a corresponding quota entry
 * for the selected fund.
 *
 * @param props - Props of the date input.
 * @param props.fundId - The fund whose quota dates gate the
 * calendar. Pass `undefined` while no fund is selected.
 *
 * @returns The date picker with quota-gated disabled dates.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
function QuotaDateInput({
  id,
  name,
  value,
  onValueChange,
  placeholder = QUOTA_DATE_INPUT.PLACEHOLDER,
  required = false,
  disabled = false,
  "aria-invalid": ariaInvalid,
  fundId,
}: QuotaDateInputProps) {
  const [OPEN, setOpen] = useState(false)
  // `null` means "not known yet", which is different from
  // "known to be empty". Gating on an empty set would hide
  // every day before the first response arrives.
  const [AVAILABLE_DATES, setAvailableDates] = useState<Set<string> | null>(null)
  const [LOADING_DATES, setLoadingDates] = useState(false)
  // Fund the current selection was made against, so the date
  // is only cleared when the user switches to another fund.
  const SELECTED_FUND = useRef<string | undefined>(undefined)

  const SELECTED = ParseDateValue(value)
  const TRIGGER_LABEL = SELECTED ? FormatDate(SELECTED) : placeholder
  // Day key of the current value. Kept as a string so the
  // effect below depends on the day, not on a fresh `Date`
  // object rebuilt on every render.
  const SELECTED_KEY = SELECTED ? ToLocalDateString(SELECTED) : ""
  // Latest commit callback, so the reset effect does not have
  // to depend on an identity the parent recreates each render.
  const COMMIT = useRef(onValueChange)
  COMMIT.current = onValueChange

  useEffect(() => {
    if (!fundId) {
      setAvailableDates(null)
      setLoadingDates(false)
      return
    }

    let CANCELLED = false

    setAvailableDates(null)
    setLoadingDates(true)

    getQuotaDatesAction({ fundId })
      .then((result) => {
        if (CANCELLED) return
        setAvailableDates(
          result.success && result.data ? new Set(result.data) : new Set()
        )
      })
      .finally(() => {
        if (CANCELLED) return
        setLoadingDates(false)
      })

    return () => {
      CANCELLED = true
    }
  }, [fundId])

  // Clear a date that belongs to a previously selected fund
  // once the new fund's quota dates are known. The first
  // settle of a fund is left alone so a pre-filled date, such
  // as the one the edit form opens with, survives.
  useEffect(() => {
    if (!fundId || !AVAILABLE_DATES) return

    const PREVIOUS_FUND = SELECTED_FUND.current

    if (PREVIOUS_FUND === undefined) {
      SELECTED_FUND.current = fundId
      return
    }

    if (PREVIOUS_FUND === fundId) return

    SELECTED_FUND.current = fundId

    if (!SELECTED_KEY) return
    if (AVAILABLE_DATES.has(SELECTED_KEY)) return

    COMMIT.current?.("")
  }, [fundId, AVAILABLE_DATES, SELECTED_KEY])

  const isDateDisabled = useCallback(
    (date: Date) => {
      // Nothing to compare against yet: hold every day back
      // so the user cannot pick a day before knowing which
      // ones are valid.
      if (LOADING_DATES || !AVAILABLE_DATES) return true
      return !AVAILABLE_DATES.has(ToLocalDateString(date))
    },
    [AVAILABLE_DATES, LOADING_DATES]
  )

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
            {LOADING_DATES ? (
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
            onValueChange?.(ToLocalDateString(next))
            setOpen(false)
          }}
          autoFocus
          aria-label={QUOTA_DATE_INPUT.GRID_LABEL}
        />
      </PopoverContent>
    </Popover>
  )
}

export { QuotaDateInput }
