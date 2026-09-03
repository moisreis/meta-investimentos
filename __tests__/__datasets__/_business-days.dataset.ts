/**
 * Provides the business days used in investment fund
 * calculation tests.
 *
 * Each entry is a date in `YYYY-MM-DD` format. The list
 * covers the working days from late April to the end of
 * May 2026, excluding weekends and holidays.
 *
 * Tests use these dates to drive the daily growth factor
 * calculations. They determine the sequence of valuation
 * days in the cash flow and quota value datasets.
 */
export const BUSINESS_DAYS: string[] = [
  "2026-04-30",
  "2026-05-04",
  "2026-05-05",
  "2026-05-06",
  "2026-05-07",
  "2026-05-08",
  "2026-05-11",
  "2026-05-12",
  "2026-05-13",
  "2026-05-14",
  "2026-05-15",
  "2026-05-18",
  "2026-05-19",
  "2026-05-20",
  "2026-05-21",
  "2026-05-22",
  "2026-05-25",
  "2026-05-26",
  "2026-05-27",
  "2026-05-28",
  "2026-05-29",
];
