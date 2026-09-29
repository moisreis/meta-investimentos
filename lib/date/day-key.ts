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

export { ToDayKey }
