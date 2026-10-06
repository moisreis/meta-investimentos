import { z } from "zod"

import { IsValidSignedPercentage } from "@/lib/validation/percentage.validation"

/**
 * @summary
 * Matches a `YYYY-MM` month key accepted by the form.
 *
 * @remarks
 * An entry is a reference month rather than a day, so the key
 * is the whole value the user picks. The month becomes the
 * first day of that month when the action records it, which is
 * what lets the `(benchmark, date)` unique pair hold one rate
 * per month.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/

/**
 * @summary
 * Tells whether a `YYYY-MM` month key has already arrived.
 *
 * @remarks
 * A rate for a month that has not happened yet is not a
 * measurement, so the form rejects it. The month in progress is
 * accepted: a month-to-date figure is a real figure.
 *
 * The comparison is made against **UTC** because that is the
 * clock the stored date is anchored to, which keeps the rule
 * and the storage speaking the same calendar. The consequence is
 * that within a few hours of a month boundary the form is
 * slightly conservative for a reader far from UTC, which is the
 * price of a check the server can repeat without knowing the
 * reader's timezone.
 *
 * Both month keys are zero padded, so the string comparison is
 * the chronological one.
 *
 * @param month - The month key the user picked.
 *
 * @returns True when the month is the current one or past.
 *
 * @example
 * const ARRIVED = IsArrivedBenchmarkHistoryMonth("2099-01");
 * // returns false
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
function IsArrivedBenchmarkHistoryMonth(month: string): boolean {
  const NOW = new Date()
  const CURRENT_MONTH = `${NOW.getUTCFullYear()}-${String(
    NOW.getUTCMonth() + 1
  ).padStart(2, "0")}`

  return month <= CURRENT_MONTH
}

/**
 * @summary
 * Validates the record rate form fields with **Zod**.
 *
 * @remarks
 * The rate accepts a negative value, because an index falls as
 * well as rises and the stored column is a signed percentage.
 * The other percentage fields of the app are bounds and fees,
 * which cannot be negative, so they are guarded by
 * `IsValidPercentage` instead.
 *
 * The month is guarded twice: the pattern keeps out anything
 * that is not a month, and `IsArrivedBenchmarkHistoryMonth`
 * keeps out a month that has not arrived. The edit flow shares
 * this schema, so a dated-forward rate cannot be created and
 * cannot be left in place either.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
const BENCHMARK_HISTORY_FORM_SCHEMA = z.object({
  benchmarkId: z.string().trim().min(1, "Selecione um índice."),
  month: z
    .string()
    .trim()
    .regex(MONTH_PATTERN, {
      message: "Selecione um mês de referência.",
    })
    .refine(IsArrivedBenchmarkHistoryMonth, {
      message: "O mês de referência não pode estar no futuro.",
    }),
  rate: z
    .string()
    .trim()
    .min(1, "Informe a taxa.")
    .refine(IsValidSignedPercentage, {
      message: "Informe uma taxa entre -999,99 e 999,99.",
    }),
})

// Values of the record rate form fields.
type BenchmarkHistoryFormValues = z.infer<
  typeof BENCHMARK_HISTORY_FORM_SCHEMA
>

export {
  BENCHMARK_HISTORY_FORM_SCHEMA,
  IsArrivedBenchmarkHistoryMonth,
  MONTH_PATTERN,
  type BenchmarkHistoryFormValues,
}
