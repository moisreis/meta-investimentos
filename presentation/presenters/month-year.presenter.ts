import { FormatUtcDate } from "./date.presenter"

/**
 * Formats an ISO date as a month and year label like
 * `SET/2026` or `AGO/2025` in Portuguese.
 *
 * @param iso - The ISO 8601 date string.
 *
 * @returns The formatted month/year label.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-21
 */
export function FormatMonthYear(iso: string): string {
  const DATE = new Date(iso)

  if (Number.isNaN(DATE.getTime())) {
    return FormatUtcDate(iso)
  }

  const MONTH = DATE.getUTCMonth()
  const YEAR = DATE.getUTCFullYear()

  const LABELS = [
    "JAN",
    "FEV",
    "MAR",
    "ABR",
    "MAI",
    "JUN",
    "JUL",
    "AGO",
    "SET",
    "OUT",
    "NOV",
    "DEZ",
  ]

  return `${LABELS[MONTH] ?? ""}/${YEAR}`
}
