/**
 * The canonical timezone of the scheduled jobs.
 *
 * Every nightly cron in this application targets *Brazilian time*
 * (`America/Sao_Paulo`) because the investment data (CVM files, CDI,
 * IPCA) is published on the Brazilian business calendar.
 */
export const BUSINESS_TIMEZONE = "America/Sao_Paulo";

/**
 * Resolves the current calendar date in {@link BUSINESS_TIMEZONE} as a
 * `YYYY-MM-DD` string.
 *
 * The value is derived from `Intl.DateTimeFormat` so it stays correct as
 * the runtime's ICU data evolves; `America/Sao_Paulo` has abolished
 * daylight saving time but the resolution remains timezone aware.
 *
 * @param timeZone - The timezone to resolve the date in.
 * @returns The `YYYY-MM-DD` date string.
 */
export function todayInTimeZone(timeZone: string = BUSINESS_TIMEZONE): string {
  const PARTS = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const MAP = Object.fromEntries(PARTS.map((part) => [part.type, part.value]));
  return `${MAP.year}-${MAP.month}-${MAP.day}`;
}
