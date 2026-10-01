import { Marker, MarkerContent } from "@/presentation/ui/marker"

// Separates the counts of a finished job summary. A glyph
// rather than a word, because the counts read as one line of
// figures rather than as several statements.
const SEPARATOR = "·"

/**
 * One count reported by a finished job.
 *
 * @remarks
 * The count and its label are kept together so a caller cannot
 * render a figure without saying what it counts, which is the
 * mistake that makes a summary unreadable.
 */
export interface EntityJobProgressCount {
  // The figure, already formatted for the locale.
  value: string

  // What the figure counts, rendered after it.
  label: string
}

interface EntityJobProgressSummaryProps {
  // The counts to report, in the order they are shown.
  counts: readonly EntityJobProgressCount[]
}

/**
 * @summary
 * Renders the counts a finished job reports.
 *
 * @remarks
 * A finished import or calculation answers the same question
 * in the same shape: how much was done, how much was skipped,
 * and how much was in scope. Joining those counts into one line
 * is what makes them comparable, and doing it here is what keeps
 * the separator and the spacing identical across dialogs.
 *
 * The counts arrive already formatted, because the number is
 * the caller's to format — a month count and a row count do not
 * read the same way — and formatting belongs in a presenter.
 *
 * @explanation
 * Use in the finished branch of a job progress dialog. Pass the
 * counts in the order they should read.
 *
 * @param props - Props of the progress summary.
 * @param props.counts - The counts to report.
 *
 * @returns The progress summary.
 *
 * @example
 * <EntityJobProgressSummary
 *   counts={[
 *     {
 *       value: FormatCount(job.rowsImported),
 *       label: QUOTA_IMPORT.ROWS_IMPORTED_LABEL,
 *     },
 *   ]}
 * />
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function EntityJobProgressSummary({
  counts,
}: EntityJobProgressSummaryProps) {
  return (
    <Marker>
      <MarkerContent>
        {counts
          .map((count) => `${count.value} ${count.label}`)
          .join(` ${SEPARATOR} `)}
      </MarkerContent>
    </Marker>
  )
}

export { EntityJobProgressSummary }
