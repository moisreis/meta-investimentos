"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { FromDayKey, ToDayKey } from "@/lib/date/day-key"

import { EntityDateInput } from "./entity-date-input"

// Loads the quota dates of a fund. The route that renders
// the form supplies the server action, so the part never
// reaches into a route.
export type EntityQuotaDatesLoader = (input: {
  fundId: string
}) => Promise<{ success: boolean; data?: string[] }>

/**
 * Props for the quota-aware date picker.
 */
export interface EntityQuotaDateInputProps {
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

  // Loads the quota dates of a fund. Injected by the route
  // so the part carries no route import.
  loadDates: EntityQuotaDatesLoader
}

// Copy of the quota-aware picker, which reads differently
// from a plain date because only a day with a price can be
// committed.
const COPY = {
  // Default trigger placeholder.
  PLACEHOLDER: "Selecione a data",

  // Accessible label of the day grid.
  GRID_LABEL: "Calendário de dias com cota",
} as const

/**
 * @summary
 * Renders the quota-aware calendar-backed date picker.
 *
 * @remarks
 * Gates the shared date part with the quota dates of the
 * selected fund: every day without a quota entry is
 * **disabled** in the calendar. Until those dates resolve the
 * whole grid is disabled, so the user can never commit a day
 * the fund has no price for. Changing the fund clears a date
 * that is no longer available for it.
 *
 * The quota dates are resolved through the loader the
 * route passes in, so the picker carries no dependency
 * on the route that owns the query.
 *
 * @explanation
 * Use for the date field of the application and withdrawal
 * forms, where the date must have a corresponding quota entry
 * for the selected fund.
 *
 * @param props - Props of the date input.
 * @param props.fundId - The fund whose quota dates gate the
 * calendar. Pass `undefined` while no fund is selected.
 * @param props.loadDates - Loads the quota dates of a fund.
 *
 * @returns The date picker with quota-gated disabled dates.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
function EntityQuotaDateInput({
  id,
  name,
  value,
  onValueChange,
  placeholder = COPY.PLACEHOLDER,
  required = false,
  disabled = false,
  "aria-invalid": ariaInvalid,
  fundId,
  loadDates,
}: EntityQuotaDateInputProps) {
  // `null` means "not known yet", which is different from
  // "known to be empty". Gating on an empty set would hide
  // every day before the first response arrives.
  // Quota dates of the selected fund, keyed by the fund they
  // were fetched for. Keying by fund is what makes "still
  // loading" derivable instead of mirrored: the dates are
  // pending whenever the settled answer does not belong to
  // the fund currently selected, so the effect never has to
  // reset anything.
  const [QUOTA_DATES, setQuotaDates] = useState<{
    fundId: string
    dates: Set<string>
  } | null>(null)

  const LOADING_DATES =
    Boolean(fundId) && QUOTA_DATES?.fundId !== fundId

  // Day key of the current value. Derived through the shared
  // day-key contract so it names the same day the calendar
  // shows, whatever shape the raw value arrived in.
  const SELECTED = FromDayKey(value)
  const SELECTED_KEY = SELECTED ? ToDayKey(SELECTED) : ""

  useEffect(() => {
    if (!fundId) return

    let CANCELLED = false

    loadDates({ fundId })
      .then((result) => {
        if (CANCELLED) return
        setQuotaDates({
          fundId,
          dates:
            result.success && result.data
              ? new Set(result.data)
              : new Set(),
        })
      })
      .catch(() => {
        if (CANCELLED) return
        setQuotaDates({ fundId, dates: new Set() })
      })

    return () => {
      CANCELLED = true
    }
  }, [fundId, loadDates])

  // Fund the current selection was made against, so the date
  // is only cleared when the user switches to another fund.
  // Read inside the effect below rather than during render.
  const SELECTED_FUND = useRef<string | undefined>(undefined)

  // Settled dates of the fund currently selected, or `null`
  // while they are unknown.
  const AVAILABLE_DATES =
    fundId && QUOTA_DATES?.fundId === fundId
      ? QUOTA_DATES.dates
      : null

  // Latest commit callback, so the reset effect does not have
  // to depend on an identity the parent recreates each render.
  const COMMIT = useRef(onValueChange)

  useEffect(() => {
    COMMIT.current = onValueChange
  }, [onValueChange])

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
      return !AVAILABLE_DATES.has(ToDayKey(date))
    },
    [AVAILABLE_DATES, LOADING_DATES]
  )

  return (
    <EntityDateInput
      id={id}
      name={name}
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      aria-invalid={ariaInvalid}
      isDateDisabled={isDateDisabled}
      pending={LOADING_DATES}
      gridLabel={COPY.GRID_LABEL}
    />
  )
}

export { EntityQuotaDateInput }
