import { format } from "date-fns"

/**
 * @summary
 * Converts a date into the `yyyy-MM-dd` key of the day the
 * user sees in their own calendar.
 *
 * @remarks
 * Formats the **local** calendar components on purpose.
 * Going through `toISOString()` instead would shift the day
 * whenever the offset is not UTC: `endOfDay(31/08)` at
 * `UTC-3` is already `01/09` in UTC, and `startOfDay(01/08)`
 * at `UTC+3` is already `31/07`. A date range picker hands
 * back dates the user picked by eye, so the key has to
 * describe the same day the user saw.
 *
 * @explanation
 * Use when sending a picked calendar day to the server as a
 * string, such as a calculation range. Server-side code that
 * walks a range should keep parsing keys as UTC, which
 * matches how the `date` columns are compared.
 *
 * @param date - The date to read the local day from.
 * @returns The local day key, for example `2026-08-31`.
 *
 * @example
 * const TO = ToDayKey(dateRange.to);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
function ToDayKey(date: Date): string {
  return format(date, "yyyy-MM-dd")
}

/**
 * @summary
 * Reads a `yyyy-MM-dd` day key, or an ISO string, back into
 * the local date the user picked.
 *
 * @remarks
 * The inverse of `ToDayKey`, so the two never disagree about
 * which day a key names.
 *
 * A date-only key builds a **local midnight** date, which is
 * why it is not handed to `new Date()`: the string parser
 * reads it as UTC and the calendar would then show the
 * previous day to anyone west of Greenwich. A value carrying
 * a time is parsed as an instant, because only a real instant
 * can be shifted into the reader's own day.
 *
 * @param value - The raw day key or ISO string.
 *
 * @returns The local date, or `undefined` when the value is
 * empty or unparseable.
 *
 * @example
 * const DATE = FromDayKey("2026-08-31");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
function FromDayKey(value: string): Date | undefined {
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
 * Reads a stored calendar-day value back into the local date
 * the picker should show.
 *
 * @remarks
 * The `date` columns of the app are calendar days serialized
 * at UTC midnight, and the response DTOs surface them as ISO
 * strings such as `2026-07-01T00:00:00.000Z`. Reading such a
 * string as an instant would shift it into the previous day
 * west of Greenwich, exactly the shift `FromDayKey` keeps for
 * real instants. This function names the day the stored value
 * carries instead: a `yyyy-MM-dd` key builds the same local
 * midnight date `FromDayKey` builds, and any other parseable
 * value is reduced to the day of its **UTC** calendar
 * components, matching how the `date` columns are compared.
 *
 * @explanation
 * Use when a form opens over an existing record and the date
 * picker has to prefill the day the record was stored on,
 * whatever transport shape the row arrived in. As an inverse
 * of `ToDayKey` for stored values, it keeps the calendar, the
 * trigger label and the quota availability gating on the same
 * day the column stores.
 *
 * @param value - The raw day key or stored ISO value.
 *
 * @returns The local date of the stored day, or `undefined`
 * when the value is empty or unparseable.
 *
 * @example
 * const DATE = FromStoredDayValue("2026-07-01T00:00:00.000Z");
 *
 * @author Moisés Reis
 *
 * @date 2026-10-10
 */
function FromStoredDayValue(value: string): Date | undefined {
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
  if (Number.isNaN(DATE.getTime())) return undefined

  return new Date(
    DATE.getUTCFullYear(),
    DATE.getUTCMonth(),
    DATE.getUTCDate()
  )
}

export { FromDayKey, FromStoredDayValue, ToDayKey }
